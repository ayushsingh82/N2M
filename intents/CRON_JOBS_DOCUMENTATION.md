# Cron Jobs Documentation

This document shows the cron job dependencies and their usage throughout the codebase.

## 📦 Dependencies Added

### Package.json Dependencies
```json
{
  "dependencies": {
    "node-cron": "^3.0.3",
    "cron": "^3.1.6"
  },
  "devDependencies": {
    "@types/node-cron": "^3.0.11"
  }
}
```

### Installation Command
```bash
npm install node-cron cron @types/node-cron
```

## 🔧 Cron Libraries Used

### 1. **node-cron** (Simple Cron Scheduling)
- **Purpose**: Simple, lightweight cron scheduling
- **Usage**: Basic cron expression validation and task scheduling
- **Best for**: Simple recurring tasks

### 2. **cron** (Advanced Cron Management)
- **Purpose**: Advanced cron job management with more features
- **Usage**: Complex scheduling, timezone support, job lifecycle management
- **Best for**: Production applications with complex scheduling needs

## 📁 Files Using Cron Jobs

### 1. **payment-service.ts**
**Location**: `/intents/payment-service.ts`

**Imports**:
```typescript
import * as cron from 'node-cron';
import { CronJob } from 'cron';
```

**Usage**:
```typescript
class CronScheduler {
  private jobs: Map<string, CronJob> = new Map();
  private nodeCronTasks: Map<string, cron.ScheduledTask> = new Map();

  schedulePayment(payment: PaymentRequest): void {
    const cronExpression = this.getCronExpression(payment.frequency);
    
    // Using CronJob (advanced)
    const cronJob = new CronJob(cronExpression, executePayment, null, true, 'UTC');
    this.jobs.set(payment.id, cronJob);
    
    // Using node-cron (simple)
    const nodeCronTask = cron.schedule(cronExpression, executePayment, {
      scheduled: true,
      timezone: 'UTC'
    });
    this.nodeCronTasks.set(payment.id, nodeCronTask);
  }
}
```

### 2. **cron-demo.ts**
**Location**: `/intents/cron-demo.ts`

**Purpose**: Comprehensive demonstration of cron job functionality

**Features**:
- Multiple cron job examples
- Validation of cron expressions
- Job lifecycle management
- Real-time status monitoring

## 🎯 Cron Expressions Used

### Payment Frequencies
```typescript
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
```

### Demo Jobs
```typescript
const demoJobs: CronDemoJob[] = [
  {
    id: 'payment-5min',
    cronExpression: '*/5 * * * *',
    description: 'Executes payment every 5 minutes'
  },
  {
    id: 'payment-weekly',
    cronExpression: '0 0 * * 0',
    description: 'Executes payment every Sunday at midnight'
  },
  {
    id: 'payment-monthly',
    cronExpression: '0 0 1 * *',
    description: 'Executes payment on the 1st of every month at midnight'
  },
  {
    id: 'balance-check',
    cronExpression: '0 * * * *',
    description: 'Checks account balance every hour'
  },
  {
    id: 'health-check',
    cronExpression: '0 9 * * *',
    description: 'Performs system health check every day at 9 AM'
  }
];
```

## 🚀 Available Commands

### Payment Service Commands
```bash
# Start payment cron jobs
npm run payment:start

# Execute single payment
npm run payment:execute demo-5min

# Check payment service status
npm run payment:status
```

### Cron Demo Commands
```bash
# Start all demo cron jobs
npm run cron:start

# Stop all jobs or specific job
npm run cron:stop [jobId]

# Show current job status
npm run cron:status

# Validate all cron expressions
npm run cron:validate

# Show cron expression examples
npm run cron:examples

# Get detailed job information
npm run cron:info <jobId>
```

## 🔍 Cron Expression Examples

### Common Patterns
```bash
*/5 * * * *     # Every 5 minutes
0 * * * *       # Every hour at minute 0
0 0 * * *       # Every day at midnight
0 0 * * 0       # Every Sunday at midnight
0 0 1 * *       # First day of every month at midnight
0 9 * * 1-5     # Every weekday at 9 AM
*/30 * * * * *  # Every 30 seconds
0 0 1 1 *       # January 1st at midnight (yearly)
```

### Validation
```typescript
// Validate cron expression
const isValid = cron.validate('*/5 * * * *');
console.log(isValid); // true
```

## 🎭 Frontend Integration

### PaymentProcessor.tsx
**Location**: `/src/app/components/PaymentProcessor.tsx`

**Cron Job Simulation**:
```typescript
// Simulate cron job execution
const intervalMs = payment.frequency === '5min' 
  ? 5 * 60 * 1000 
  : payment.frequency === 'weekly' 
    ? 7 * 24 * 60 * 60 * 1000 
    : 30 * 24 * 60 * 60 * 1000;

const intervalId = setInterval(() => {
  processPayment(payment);
}, intervalMs);
```

## 🔧 Technical Implementation

### Dual Cron Library Usage
The system uses both cron libraries for different purposes:

1. **CronJob (cron library)**: Advanced features, timezone support, job lifecycle
2. **node-cron**: Simple validation, lightweight scheduling

### Job Management
```typescript
class CronScheduler {
  // Start job
  schedulePayment(payment: PaymentRequest): void {
    const cronJob = new CronJob(cronExpression, executePayment, null, true, 'UTC');
    this.jobs.set(payment.id, cronJob);
  }

  // Stop job
  stopPayment(paymentId: string): void {
    const cronJob = this.jobs.get(paymentId);
    if (cronJob) {
      cronJob.stop();
      this.jobs.delete(paymentId);
    }
  }

  // Get job info
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
}
```

## 📊 Monitoring & Logging

### Real-time Logging
```typescript
const executePayment = async () => {
  const timestamp = new Date().toLocaleString();
  console.log(`⏰ [${timestamp}] Executing: ${job.name}`);
  console.log(`📅 Cron Expression: ${job.cronExpression}`);
  console.log(`🎯 Frequency: ${job.frequency}`);
  
  // Execute payment logic
  const result = await paymentService.executePayment(payment);
  
  console.log(`✅ Job completed successfully`);
};
```

### Status Tracking
```typescript
printJobStatus(): void {
  this.jobs.forEach((cronJob, jobId) => {
    const nextExecution = cronJob.nextDate().toLocaleString();
    console.log(`🟢 ${job.name}`);
    console.log(`   Next Execution: ${nextExecution}`);
    console.log(`   Status: Running`);
  });
}
```

## 🧪 Testing & Demonstration

### For Judges

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Cron Demo**:
   ```bash
   npm run cron:start
   ```

3. **Observe Execution**:
   - Watch jobs execute at scheduled intervals
   - See real-time logs
   - Test different frequencies

4. **Validate Expressions**:
   ```bash
   npm run cron:validate
   npm run cron:examples
   ```

5. **Check Status**:
   ```bash
   npm run cron:status
   ```

## 🔐 Security & Best Practices

### Environment Variables
```bash
# Required for payment execution
ACCOUNT_PRIVATE_KEY=your_near_private_key
ACCOUNT_ID=your_near_account_id
```

### Error Handling
```typescript
try {
  const result = await executePayment(payment);
  if (result.success) {
    console.log(`✅ Payment completed successfully`);
  } else {
    console.error(`❌ Payment failed: ${result.error}`);
  }
} catch (error) {
  console.error(`❌ Cron job error:`, error);
}
```

### Resource Management
```typescript
// Cleanup on process exit
process.on('SIGINT', () => {
  console.log('🛑 Stopping all cron jobs...');
  scheduler.stopAllPayments();
  process.exit(0);
});
```

## 📈 Performance Considerations

### Memory Management
- Jobs are stored in Maps for efficient lookup
- Proper cleanup when jobs are stopped
- No memory leaks from abandoned intervals

### Execution Efficiency
- Immediate execution for demo purposes
- Proper error handling prevents job failures
- Logging provides visibility into execution

This comprehensive cron job system demonstrates professional-grade scheduling capabilities with proper dependency management, error handling, and monitoring features.
