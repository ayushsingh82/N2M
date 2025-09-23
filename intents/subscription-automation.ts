import { NEAR } from "@near-js/tokens";
import { depositNearAsMultiToken, getAccount, getAccountBalanceOfNear } from "./near";
import { getQuote, waitUntilQuoteExecutionCompletes } from "./intent";
import { transferMultiTokenForQuote } from "./near";

// Loading environment variables
require("dotenv").config({ path: ".env" });

interface SubscriptionConfig {
  recipientAddress: string;
  amount: bigint;
  token: string;
  chain: string;
  frequency: 'weekly' | 'monthly' | '5min';
}

interface SubscriptionSchedule {
  id: string;
  config: SubscriptionConfig;
  nextExecution: Date;
  isActive: boolean;
}

class SubscriptionManager {
  private subscriptions: Map<string, SubscriptionSchedule> = new Map();
  private intervalId: NodeJS.Timeout | null = null;

  constructor() {
    // Initialize with demo subscription (fixed recipient, amount, chain, token)
    this.addDemoSubscription();
  }

  private addDemoSubscription(): void {
    const demoConfig: SubscriptionConfig = {
      recipientAddress: "demo-recipient.near", // Fixed recipient for demo
      amount: NEAR.toUnits("0.1"), // Fixed amount for demo
      token: "nep141:sol.omft.near", // Fixed token for demo
      chain: "near", // Fixed chain for demo
      frequency: 'weekly' // Default frequency
    };

    this.addSubscription("demo-subscription", demoConfig);
  }

  addSubscription(id: string, config: SubscriptionConfig): void {
    const nextExecution = this.calculateNextExecution(config.frequency);
    
    const subscription: SubscriptionSchedule = {
      id,
      config,
      nextExecution,
      isActive: true
    };

    this.subscriptions.set(id, subscription);
    console.log(`✅ Subscription ${id} added. Next execution: ${nextExecution.toISOString()}`);
  }

  updateSubscriptionFrequency(id: string, frequency: 'weekly' | 'monthly' | '5min'): void {
    const subscription = this.subscriptions.get(id);
    if (subscription) {
      subscription.config.frequency = frequency;
      subscription.nextExecution = this.calculateNextExecution(frequency);
      console.log(`🔄 Subscription ${id} frequency updated to ${frequency}. Next execution: ${subscription.nextExecution.toISOString()}`);
    }
  }

  private calculateNextExecution(frequency: 'weekly' | 'monthly' | '5min'): Date {
    const now = new Date();
    
    switch (frequency) {
      case '5min':
        return new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes
      case 'weekly':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
      case 'monthly':
        const nextMonth = new Date(now);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        return nextMonth;
      default:
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // Default to weekly
    }
  }

  async executeSubscription(subscription: SubscriptionSchedule): Promise<void> {
    try {
      console.log(`🚀 Executing subscription ${subscription.id}...`);
      
      const account = getAccount();
      
      // Check balance
      const balance = await getAccountBalanceOfNear(account);
      if (balance <= subscription.config.amount) {
        throw new Error(`Insufficient balance for subscription ${subscription.id}`);
      }

      // For demo purposes, we'll simulate the payment process
      // In a real implementation, you would:
      // 1. Deposit NEAR as multi-token
      // 2. Get quote for cross-chain transfer
      // 3. Execute the transfer
      
      console.log(`💰 Processing payment of ${NEAR.toDecimal(subscription.config.amount)} NEAR to ${subscription.config.recipientAddress}`);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log(`✅ Payment completed for subscription ${subscription.id}`);
      
      // Update next execution time
      subscription.nextExecution = this.calculateNextExecution(subscription.config.frequency);
      console.log(`📅 Next execution scheduled for: ${subscription.nextExecution.toISOString()}`);
      
    } catch (error) {
      console.error(`❌ Failed to execute subscription ${subscription.id}:`, error);
    }
  }

  async executeAllDueSubscriptions(): Promise<void> {
    const now = new Date();
    
    for (const [id, subscription] of this.subscriptions) {
      if (subscription.isActive && subscription.nextExecution <= now) {
        await this.executeSubscription(subscription);
      }
    }
  }

  startAutomation(): void {
    console.log("🤖 Starting subscription automation...");
    
    // Check for due subscriptions every minute
    this.intervalId = setInterval(async () => {
      await this.executeAllDueSubscriptions();
    }, 60 * 1000); // Check every minute
    
    console.log("✅ Subscription automation started. Checking every minute for due payments.");
  }

  stopAutomation(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log("🛑 Subscription automation stopped.");
    }
  }

  getSubscriptionStatus(): void {
    console.log("\n📊 Current Subscription Status:");
    console.log("=====================================");
    
    for (const [id, subscription] of this.subscriptions) {
      const status = subscription.isActive ? "🟢 Active" : "🔴 Inactive";
      const nextExec = subscription.nextExecution.toISOString();
      const frequency = subscription.config.frequency;
      
      console.log(`${status} | ${id}`);
      console.log(`   Frequency: ${frequency}`);
      console.log(`   Next execution: ${nextExec}`);
      console.log(`   Amount: ${NEAR.toDecimal(subscription.config.amount)} NEAR`);
      console.log(`   Recipient: ${subscription.config.recipientAddress}`);
      console.log("   ---");
    }
  }

  // Method to simulate real payment execution (for production use)
  async executeRealPayment(subscription: SubscriptionSchedule): Promise<void> {
    try {
      const account = getAccount();
      
      // Step 1: Deposit NEAR as multi-token
      await depositNearAsMultiToken(account, subscription.config.amount);
      
      // Step 2: Get quote for cross-chain transfer
      const quoteRequest = {
        originAsset: subscription.config.token,
        destinationAsset: `${subscription.config.chain}:${subscription.config.recipientAddress}`,
        amountIn: subscription.config.amount.toString(),
        dry: false
      };
      
      const quote = await getQuote(quoteRequest);
      
      // Step 3: Transfer multi-token for quote
      await transferMultiTokenForQuote(account, quote, subscription.config.token);
      
      // Step 4: Wait for execution to complete
      await waitUntilQuoteExecutionCompletes(quote);
      
      console.log(`✅ Real payment completed for subscription ${subscription.id}`);
      
    } catch (error) {
      console.error(`❌ Real payment failed for subscription ${subscription.id}:`, error);
      throw error;
    }
  }
}

// CLI Interface
async function main() {
  const manager = new SubscriptionManager();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'start':
      manager.startAutomation();
      // Keep the process running
      process.on('SIGINT', () => {
        console.log('\n🛑 Received SIGINT, stopping automation...');
        manager.stopAutomation();
        process.exit(0);
      });
      break;
      
    case 'status':
      manager.getSubscriptionStatus();
      break;
      
    case 'test-weekly':
      manager.updateSubscriptionFrequency('demo-subscription', 'weekly');
      manager.getSubscriptionStatus();
      break;
      
    case 'test-monthly':
      manager.updateSubscriptionFrequency('demo-subscription', 'monthly');
      manager.getSubscriptionStatus();
      break;
      
    case 'test-5min':
      manager.updateSubscriptionFrequency('demo-subscription', '5min');
      manager.getSubscriptionStatus();
      break;
      
    case 'execute-now':
      const subscription = manager['subscriptions'].get('demo-subscription');
      if (subscription) {
        await manager.executeSubscription(subscription);
      }
      break;
      
    default:
      console.log(`
🤖 Subscription Automation CLI

Usage:
  npm run subscription:start     - Start the automation service
  npm run subscription:status    - Show current subscription status
  npm run subscription:weekly    - Set frequency to weekly
  npm run subscription:monthly   - Set frequency to monthly
  npm run subscription:5min      - Set frequency to 5 minutes
  npm run subscription:execute   - Execute subscription immediately

Environment Variables Required:
  ACCOUNT_PRIVATE_KEY - Your NEAR account private key
  ACCOUNT_ID - Your NEAR account ID
      `);
  }
}

// Export for use in other modules
export { SubscriptionManager, SubscriptionConfig, SubscriptionSchedule };

// Run CLI if this file is executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
}
