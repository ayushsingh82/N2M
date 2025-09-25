import * as cron from 'node-cron';
import { CronJob } from 'cron';

// Loading environment variables
require("dotenv").config({ path: ".env" });

interface CronDemoJob {
  id: string;
  name: string;
  frequency: string;
  cronExpression: string;
  description: string;
}

class CronJobDemo {
  private jobs: Map<string, CronJob> = new Map();
  private nodeCronTasks: Map<string, cron.ScheduledTask> = new Map();

  // Demo jobs configuration
  private demoJobs: CronDemoJob[] = [
    {
      id: 'payment-5min',
      name: '5-Minute Payment',
      frequency: '5min',
      cronExpression: '*/5 * * * *',
      description: 'Executes payment every 5 minutes'
    },
    {
      id: 'payment-weekly',
      name: 'Weekly Payment',
      frequency: 'weekly',
      cronExpression: '0 0 * * 0',
      description: 'Executes payment every Sunday at midnight'
    },
    {
      id: 'payment-monthly',
      name: 'Monthly Payment',
      frequency: 'monthly',
      cronExpression: '0 0 1 * *',
      description: 'Executes payment on the 1st of every month at midnight'
    },
    {
      id: 'balance-check',
      name: 'Balance Check',
      frequency: 'hourly',
      cronExpression: '0 * * * *',
      description: 'Checks account balance every hour'
    },
    {
      id: 'health-check',
      name: 'Health Check',
      frequency: 'daily',
      cronExpression: '0 9 * * *',
      description: 'Performs system health check every day at 9 AM'
    }
  ];

  // Start all demo cron jobs
  startAllJobs(): void {
    console.log('🚀 Starting all cron job demonstrations...\n');

    this.demoJobs.forEach(job => {
      this.startJob(job);
    });

    console.log(`✅ Started ${this.demoJobs.length} cron jobs`);
    this.printJobStatus();
  }

  // Start a specific job
  startJob(job: CronDemoJob): void {
    const executeJob = () => {
      const timestamp = new Date().toLocaleString();
      console.log(`⏰ [${timestamp}] Executing: ${job.name}`);
      console.log(`   📋 Description: ${job.description}`);
      console.log(`   📅 Cron Expression: ${job.cronExpression}`);
      console.log(`   🎯 Frequency: ${job.frequency}`);
      
      // Simulate different job types
      this.simulateJobExecution(job);
      console.log(`   ✅ Job completed successfully\n`);
    };

    // Schedule using CronJob (advanced)
    const cronJob = new CronJob(job.cronExpression, executeJob, null, true, 'UTC');
    this.jobs.set(job.id, cronJob);

    // Schedule using node-cron (simple)
    const nodeCronTask = cron.schedule(job.cronExpression, executeJob, {
      scheduled: true,
      timezone: 'UTC'
    });
    this.nodeCronTasks.set(job.id, nodeCronTask);

    console.log(`📅 Scheduled: ${job.name} (${job.frequency})`);
  }

  // Simulate different types of job execution
  private simulateJobExecution(job: CronDemoJob): void {
    switch (job.frequency) {
      case '5min':
        console.log(`   💳 Processing payment: 0.1 USDC to Base chain`);
        console.log(`   🔄 Executing cross-chain transfer...`);
        break;
      case 'weekly':
        console.log(`   💰 Processing weekly payment: 100 USDC to Ethereum`);
        console.log(`   📊 Checking subscription status...`);
        break;
      case 'monthly':
        console.log(`   🏦 Processing monthly payment: 50 USDT to Polygon`);
        console.log(`   📈 Generating monthly report...`);
        break;
      case 'hourly':
        console.log(`   💎 Checking NEAR balance...`);
        console.log(`   📊 Current balance: 0.75 NEAR`);
        break;
      case 'daily':
        console.log(`   🔍 Performing system health check...`);
        console.log(`   ✅ All systems operational`);
        break;
    }
  }

  // Stop a specific job
  stopJob(jobId: string): void {
    const cronJob = this.jobs.get(jobId);
    if (cronJob) {
      cronJob.stop();
      this.jobs.delete(jobId);
    }

    const nodeCronTask = this.nodeCronTasks.get(jobId);
    if (nodeCronTask) {
      nodeCronTask.stop();
      this.nodeCronTasks.delete(jobId);
    }

    console.log(`⏹️ Stopped job: ${jobId}`);
  }

  // Stop all jobs
  stopAllJobs(): void {
    console.log('🛑 Stopping all cron jobs...\n');

    this.jobs.forEach((cronJob, jobId) => {
      cronJob.stop();
      console.log(`⏹️ Stopped CronJob: ${jobId}`);
    });
    this.jobs.clear();

    this.nodeCronTasks.forEach((task, jobId) => {
      task.stop();
      console.log(`⏹️ Stopped node-cron task: ${jobId}`);
    });
    this.nodeCronTasks.clear();

    console.log('\n✅ All cron jobs stopped');
  }

  // Print current job status
  printJobStatus(): void {
    console.log('\n📊 Current Cron Job Status:');
    console.log('=====================================');
    
    this.jobs.forEach((cronJob, jobId) => {
      const job = this.demoJobs.find(j => j.id === jobId);
      if (job) {
        const nextExecution = cronJob.nextDate().toLocaleString();
        console.log(`🟢 ${job.name}`);
        console.log(`   ID: ${job.id}`);
        console.log(`   Frequency: ${job.frequency}`);
        console.log(`   Cron Expression: ${job.cronExpression}`);
        console.log(`   Next Execution: ${nextExecution}`);
        console.log(`   Status: Running`);
        console.log('   ---');
      }
    });

    console.log(`\n📈 Summary:`);
    console.log(`   Active Jobs: ${this.jobs.size}`);
    console.log(`   Total Jobs: ${this.demoJobs.length}`);
  }

  // Validate cron expressions
  validateCronExpressions(): void {
    console.log('\n🔍 Validating Cron Expressions:');
    console.log('=====================================');

    this.demoJobs.forEach(job => {
      const isValid = cron.validate(job.cronExpression);
      const status = isValid ? '✅ Valid' : '❌ Invalid';
      console.log(`${status} ${job.name}: ${job.cronExpression}`);
    });
  }

  // Show cron expression examples
  showCronExamples(): void {
    console.log('\n📚 Cron Expression Examples:');
    console.log('=====================================');
    
    const examples = [
      { expression: '*/5 * * * *', description: 'Every 5 minutes' },
      { expression: '0 * * * *', description: 'Every hour at minute 0' },
      { expression: '0 0 * * *', description: 'Every day at midnight' },
      { expression: '0 0 * * 0', description: 'Every Sunday at midnight' },
      { expression: '0 0 1 * *', description: 'First day of every month at midnight' },
      { expression: '0 9 * * 1-5', description: 'Every weekday at 9 AM' },
      { expression: '*/30 * * * * *', description: 'Every 30 seconds' },
      { expression: '0 0 1 1 *', description: 'January 1st at midnight (yearly)' }
    ];

    examples.forEach(example => {
      const isValid = cron.validate(example.expression);
      const status = isValid ? '✅' : '❌';
      console.log(`${status} ${example.expression} - ${example.description}`);
    });
  }

  // Get job information
  getJobInfo(jobId: string): void {
    const job = this.demoJobs.find(j => j.id === jobId);
    if (job) {
      const cronJob = this.jobs.get(jobId);
      console.log(`\n📋 Job Information: ${job.name}`);
      console.log('=====================================');
      console.log(`ID: ${job.id}`);
      console.log(`Name: ${job.name}`);
      console.log(`Frequency: ${job.frequency}`);
      console.log(`Cron Expression: ${job.cronExpression}`);
      console.log(`Description: ${job.description}`);
      
      if (cronJob) {
        console.log(`Status: Running`);
        console.log(`Next Execution: ${cronJob.nextDate().toLocaleString()}`);
        console.log(`Last Execution: ${cronJob.lastDate()?.toLocaleString() || 'Never'}`);
      } else {
        console.log(`Status: Stopped`);
      }
    } else {
      console.log(`❌ Job not found: ${jobId}`);
    }
  }
}

// CLI interface
async function main() {
  const command = process.argv[2];
  const arg = process.argv[3];
  const demo = new CronJobDemo();

  switch (command) {
    case 'start':
      demo.startAllJobs();
      
      // Keep the process running
      process.on('SIGINT', () => {
        console.log('\n🛑 Received SIGINT, stopping all jobs...');
        demo.stopAllJobs();
        process.exit(0);
      });
      
      console.log('\n⏰ Cron jobs are running. Press Ctrl+C to stop.');
      break;
      
    case 'stop':
      if (arg) {
        demo.stopJob(arg);
      } else {
        demo.stopAllJobs();
      }
      break;
      
    case 'status':
      demo.printJobStatus();
      break;
      
    case 'validate':
      demo.validateCronExpressions();
      break;
      
    case 'examples':
      demo.showCronExamples();
      break;
      
    case 'info':
      if (arg) {
        demo.getJobInfo(arg);
      } else {
        console.log('Usage: npm run cron:info <jobId>');
        console.log('Available job IDs:', demo['demoJobs'].map(j => j.id).join(', '));
      }
      break;
      
    default:
      console.log(`
🔧 Cron Job Demo CLI

Usage:
  npm run cron:start              - Start all demo cron jobs
  npm run cron:stop [jobId]       - Stop all jobs or specific job
  npm run cron:status             - Show current job status
  npm run cron:validate           - Validate all cron expressions
  npm run cron:examples           - Show cron expression examples
  npm run cron:info <jobId>       - Get detailed job information

Available Job IDs:
  ${demo['demoJobs'].map(j => `  ${j.id} - ${j.name}`).join('\n')}

Cron Libraries Used:
  📦 node-cron: Simple cron scheduling
  📦 cron: Advanced cron job management
      `);
  }
}

// Export for use in other modules
export { CronJobDemo };

// Run CLI if this file is executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
}
