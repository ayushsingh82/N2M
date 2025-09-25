import { NEAR } from "@near-js/tokens";
import { QuoteRequest } from "@defuse-protocol/one-click-sdk-typescript";
import * as cron from 'node-cron';
import { CronJob } from 'cron';
import {
  getAccount,
  getAccountBalanceOfNear,
  depositNearAsMultiToken,
  transferMultiTokenForQuote
} from "./near";
import { getQuote, waitUntilQuoteExecutionCompletes } from "./intent";
import { COMMON_TOKENS, getTokenByAssetId } from "./token-mapping";

// Loading environment variables
require("dotenv").config({ path: ".env" });

interface PaymentRequest {
  id: string;
  recipientAddress: string;
  amount: string;
  token: string;
  chain: string;
  frequency: '5min' | 'weekly' | 'monthly';
}

interface PaymentResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
  executionTime: Date;
}

class PaymentService {
  private account = getAccount();

  async executePayment(payment: PaymentRequest): Promise<PaymentResult> {
    const startTime = new Date();
    console.log(`🚀 Starting payment execution for ${payment.id}`);
    
    try {
      // Step 1: Check NEAR balance
      console.log(`📊 Checking NEAR balance...`);
      const balance = await getAccountBalanceOfNear(this.account);
      const requiredAmount = NEAR.toUnits("0.1"); // Minimum amount for demo
      
      if (balance < requiredAmount) {
        throw new Error(`Insufficient NEAR balance. Required: ${NEAR.toDecimal(requiredAmount)} NEAR, Available: ${NEAR.toDecimal(balance)} NEAR`);
      }

      // Step 2: Deposit NEAR as multi-token
      console.log(`💰 Depositing NEAR as multi-token...`);
      await depositNearAsMultiToken(this.account, requiredAmount);
      console.log(`✅ NEAR deposited successfully!`);

      // Step 3: Get quote for cross-chain transfer
      console.log(`🔄 Getting quote for ${payment.token} on ${payment.chain}...`);
      const deadline = new Date();
      deadline.setMinutes(deadline.getMinutes() + 5);

      // Map token and chain to asset IDs
      const originAsset = COMMON_TOKENS.NEAR;
      const destinationAsset = this.getDestinationAssetId(payment.token, payment.chain);
      
      if (!destinationAsset) {
        throw new Error(`Unsupported token/chain combination: ${payment.token} on ${payment.chain}`);
      }

      const quote = await getQuote({
        dry: false,
        swapType: QuoteRequest.swapType.EXACT_INPUT,
        slippageTolerance: 10, // 0.1%
        depositType: QuoteRequest.depositType.INTENTS,
        originAsset: originAsset,
        destinationAsset: destinationAsset,
        amount: requiredAmount.toString(),
        refundTo: this.account.accountId,
        refundType: QuoteRequest.refundType.INTENTS,
        recipient: payment.recipientAddress,
        recipientType: QuoteRequest.recipientType.DESTINATION_CHAIN,
        deadline: deadline.toISOString(),
      });

      console.log(`📈 Quote received: ${quote.amountInFormatted} NEAR → ${quote.amountOutFormatted} ${payment.token}`);

      // Step 4: Execute the transfer
      console.log(`⚡ Executing transfer...`);
      await transferMultiTokenForQuote(this.account, quote, originAsset);
      await waitUntilQuoteExecutionCompletes(quote);

      console.log(`✅ Payment completed successfully!`);
      console.log(`📤 Sent ${quote.amountOutFormatted} ${payment.token} to ${payment.recipientAddress}`);

      return {
        success: true,
        transactionHash: quote.depositAddress || 'unknown',
        executionTime: startTime
      };

    } catch (error) {
      console.error(`❌ Payment failed:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        executionTime: startTime
      };
    }
  }

  private getDestinationAssetId(token: string, chain: string): string | null {
    // Map common token/chain combinations to asset IDs
    const mapping: { [key: string]: string } = {
      'USDC-Base': COMMON_TOKENS.USDC_BASE,
      'USDC-Ethereum': COMMON_TOKENS.USDC_ETH,
      'USDC-Arbitrum': COMMON_TOKENS.USDC_ARB,
      'USDC-Solana': COMMON_TOKENS.USDC_SOL,
      'USDT-Ethereum': COMMON_TOKENS.USDT_ETH,
      'USDT-Arbitrum': COMMON_TOKENS.USDT_ARB,
      'USDT-Solana': COMMON_TOKENS.USDT_SOL,
      'ETH-Ethereum': COMMON_TOKENS.ETH,
      'ETH-Base': COMMON_TOKENS.ETH_BASE,
      'ETH-Arbitrum': COMMON_TOKENS.ETH_ARB,
    };

    return mapping[`${token}-${chain}`] || null;
  }

  // Simulate payment execution (for demo purposes)
  async simulatePayment(payment: PaymentRequest): Promise<PaymentResult> {
    const startTime = new Date();
    console.log(`🎭 Simulating payment execution for ${payment.id}`);
    
    try {
      // Simulate processing steps
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`📊 Checking NEAR balance...`);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log(`💰 Depositing NEAR as multi-token...`);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log(`🔄 Getting quote for ${payment.token} on ${payment.chain}...`);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log(`⚡ Executing transfer...`);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log(`✅ Payment completed successfully!`);
      console.log(`📤 Sent ${payment.amount} ${payment.token} to ${payment.recipientAddress.slice(0, 6)}...${payment.recipientAddress.slice(-4)}`);

      return {
        success: true,
        transactionHash: `sim_${Date.now()}`,
        executionTime: startTime
      };

    } catch (error) {
      console.error(`❌ Payment simulation failed:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        executionTime: startTime
      };
    }
  }
}

// Cron job scheduler using proper cron libraries
class CronScheduler {
  private jobs: Map<string, CronJob> = new Map();
  private nodeCronTasks: Map<string, cron.ScheduledTask> = new Map();
  private paymentService = new PaymentService();

  schedulePayment(payment: PaymentRequest, useSimulation: boolean = true): void {
    const cronExpression = this.getCronExpression(payment.frequency);
    
    const executePayment = async () => {
      console.log(`⏰ Executing scheduled payment: ${payment.id}`);
      
      const result = useSimulation 
        ? await this.paymentService.simulatePayment(payment)
        : await this.paymentService.executePayment(payment);
      
      if (result.success) {
        console.log(`✅ Scheduled payment ${payment.id} completed successfully`);
      } else {
        console.error(`❌ Scheduled payment ${payment.id} failed: ${result.error}`);
      }
    };

    // Execute immediately for demo
    executePayment();
    
    // Schedule using CronJob (more advanced)
    const cronJob = new CronJob(cronExpression, executePayment, null, true, 'UTC');
    this.jobs.set(payment.id, cronJob);
    
    // Also schedule using node-cron (simpler)
    const nodeCronTask = cron.schedule(cronExpression, executePayment, {
      scheduled: true,
      timezone: 'UTC'
    });
    this.nodeCronTasks.set(payment.id, nodeCronTask);
    
    console.log(`⏰ Scheduled payment ${payment.id} for ${payment.frequency} execution`);
    console.log(`📅 Cron expression: ${cronExpression}`);
  }

  private getCronExpression(frequency: '5min' | 'weekly' | 'monthly'): string {
    switch (frequency) {
      case '5min':
        return '*/5 * * * *'; // Every 5 minutes
      case 'weekly':
        return '0 0 * * 0'; // Every Sunday at midnight
      case 'monthly':
        return '0 0 1 * *'; // First day of every month at midnight
      default:
        return '0 0 * * *'; // Daily at midnight
    }
  }

  stopPayment(paymentId: string): void {
    // Stop CronJob
    const cronJob = this.jobs.get(paymentId);
    if (cronJob) {
      cronJob.stop();
      this.jobs.delete(paymentId);
    }

    // Stop node-cron task
    const nodeCronTask = this.nodeCronTasks.get(paymentId);
    if (nodeCronTask) {
      nodeCronTask.stop();
      this.nodeCronTasks.delete(paymentId);
    }

    console.log(`⏹️ Stopped scheduled payment: ${paymentId}`);
  }

  stopAllPayments(): void {
    // Stop all CronJobs
    this.jobs.forEach((cronJob, paymentId) => {
      cronJob.stop();
      console.log(`⏹️ Stopped CronJob: ${paymentId}`);
    });
    this.jobs.clear();

    // Stop all node-cron tasks
    this.nodeCronTasks.forEach((task, paymentId) => {
      task.stop();
      console.log(`⏹️ Stopped node-cron task: ${paymentId}`);
    });
    this.nodeCronTasks.clear();

    console.log(`🛑 Stopped all scheduled payments`);
  }

  getActiveJobs(): string[] {
    return Array.from(this.jobs.keys());
  }

  // Get detailed cron information
  getCronInfo(paymentId: string): { cronExpression: string; nextExecution: Date | null } {
    const cronJob = this.jobs.get(paymentId);
    if (cronJob) {
      return {
        cronExpression: cronJob.cronTime.source,
        nextExecution: cronJob.nextDate().toDate()
      };
    }
    return { cronExpression: '', nextExecution: null };
  }

  // Validate cron expression
  validateCronExpression(expression: string): boolean {
    return cron.validate(expression);
  }
}

// CLI interface
async function main() {
  const command = process.argv[2];
  const scheduler = new CronScheduler();
  const paymentService = new PaymentService();

  const demoPayments: PaymentRequest[] = [
    {
      id: 'demo-5min',
      recipientAddress: '0xB822B51A88E8a03fCe0220B15Cb2C662E42Adec1',
      amount: '0.1',
      token: 'USDC',
      chain: 'Base',
      frequency: '5min'
    },
    {
      id: 'demo-weekly',
      recipientAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      amount: '100',
      token: 'USDC',
      chain: 'Ethereum',
      frequency: 'weekly'
    },
    {
      id: 'demo-monthly',
      recipientAddress: '0x8ba1f109551bD432803012645Hac136c',
      amount: '50',
      token: 'USDT',
      chain: 'Polygon',
      frequency: 'monthly'
    }
  ];

  switch (command) {
    case 'start':
      console.log('🚀 Starting payment cron jobs...');
      demoPayments.forEach(payment => {
        scheduler.schedulePayment(payment, true); // Use simulation for demo
      });
      
      // Keep the process running
      process.on('SIGINT', () => {
        console.log('\n🛑 Received SIGINT, stopping all jobs...');
        scheduler.stopAllPayments();
        process.exit(0);
      });
      
      console.log('✅ All cron jobs started. Press Ctrl+C to stop.');
      break;
      
    case 'execute':
      const paymentId = process.argv[3];
      const payment = demoPayments.find(p => p.id === paymentId);
      
      if (payment) {
        console.log(`🎯 Executing single payment: ${paymentId}`);
        const result = await paymentService.simulatePayment(payment);
        console.log('Result:', result);
      } else {
        console.log('❌ Payment not found. Available payments:', demoPayments.map(p => p.id));
      }
      break;
      
    case 'status':
      console.log('📊 Payment Service Status:');
      console.log(`Active Jobs: ${scheduler.getActiveJobs().length}`);
      console.log(`Account ID: ${paymentService['account'].accountId}`);
      break;
      
    default:
      console.log(`
🔧 Payment Service CLI

Usage:
  npm run payment:start           - Start all cron jobs
  npm run payment:execute <id>    - Execute single payment
  npm run payment:status          - Show service status

Available Demo Payments:
  ${demoPayments.map(p => `  ${p.id} - ${p.frequency} - ${p.amount} ${p.token} on ${p.chain}`).join('\n')}
      `);
  }
}

// Export for use in other modules
export { PaymentService, CronScheduler, PaymentRequest, PaymentResult };

// Run CLI if this file is executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
}
