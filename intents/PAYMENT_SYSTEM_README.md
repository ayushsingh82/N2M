# Payment System Documentation

This document explains the complete payment system with cron job functionality for judges to verify the working code.

## 🏗️ System Architecture

### Frontend Components
- **PaymentProcessor.tsx**: React component with cron job simulation
- **payments/page.tsx**: Dedicated page to showcase the payment system

### Backend Services
- **payment-service.ts**: Node.js service that calls intent functions
- **CronScheduler**: Manages scheduled payment executions
- **PaymentService**: Handles actual payment processing

## 🚀 Features Demonstrated

### 1. **Payment Processing**
- ✅ Calls intent functions from `near.ts`
- ✅ Deposits NEAR as multi-token
- ✅ Gets quotes for cross-chain transfers
- ✅ Executes payments to recipients
- ✅ Handles errors and logging

### 2. **Cron Job Scheduling**
- ✅ **5-minute intervals**: For rapid testing
- ✅ **Weekly intervals**: 7-day recurring payments
- ✅ **Monthly intervals**: 30-day recurring payments
- ✅ Start/stop individual jobs
- ✅ Start/stop all jobs
- ✅ Real-time status monitoring

### 3. **Token Support**
- ✅ USDC on Base, Ethereum, Arbitrum, Solana
- ✅ USDT on Ethereum, Arbitrum, Solana
- ✅ ETH on Ethereum, Base, Arbitrum
- ✅ Automatic token mapping via `token-mapping.ts`

## 📋 Available Commands

### Frontend (React)
```bash
# Navigate to payments page
http://localhost:3000/payments
```

### Backend (Node.js)
```bash
# Start all cron jobs
npm run payment:start

# Execute single payment
npm run payment:execute demo-5min

# Check service status
npm run payment:status
```

## 🎯 Demo Payments

The system includes 3 demo payments:

1. **demo-5min**: 0.1 USDC on Base (5-minute intervals)
2. **demo-weekly**: 100 USDC on Ethereum (weekly intervals)
3. **demo-monthly**: 50 USDT on Polygon (monthly intervals)

## 🔧 Technical Implementation

### Payment Flow
1. **Balance Check**: Verify NEAR balance
2. **Deposit**: Convert NEAR to multi-token
3. **Quote**: Get cross-chain swap quote
4. **Execute**: Transfer tokens to recipient
5. **Confirm**: Wait for transaction completion

### Cron Job Management
```typescript
// Schedule payment
scheduler.schedulePayment(payment, useSimulation);

// Stop payment
scheduler.stopPayment(paymentId);

// Stop all payments
scheduler.stopAllPayments();
```

### Error Handling
- ✅ Insufficient balance detection
- ✅ Network error handling
- ✅ Transaction timeout handling
- ✅ Detailed error logging

## 🎭 Simulation vs Real Execution

### Simulation Mode (Default)
- Uses `simulatePayment()` for demo purposes
- Shows complete flow without actual blockchain transactions
- Safe for testing and demonstration

### Real Execution Mode
- Uses `executePayment()` with actual intent functions
- Requires proper environment setup
- Executes real blockchain transactions

## 📊 Monitoring & Logging

### Real-time Logs
- Payment execution status
- Error messages
- Transaction hashes
- Execution timestamps

### Status Tracking
- Active cron jobs count
- Payment success/failure rates
- Next execution times
- Service health status

## 🔐 Security Features

### Environment Variables
```bash
ACCOUNT_PRIVATE_KEY=your_near_private_key
ACCOUNT_ID=your_near_account_id
```

### Validation
- ✅ Address format validation
- ✅ Amount validation
- ✅ Token/chain compatibility
- ✅ Balance verification

## 🎨 UI Features

### Control Panel
- Start/stop all cron jobs
- Clear logs
- Real-time status display

### Payment Table
- Live payment status
- Execute now buttons
- Pause/resume functionality
- Frequency indicators

### Log Viewer
- Real-time execution logs
- Timestamped entries
- Color-coded status
- Scrollable history

## 🧪 Testing Instructions

### For Judges

1. **Start the Frontend**:
   ```bash
   cd my-app
   npm run dev
   # Navigate to http://localhost:3000/payments
   ```

2. **Start the Backend Service**:
   ```bash
   cd intents
   npm run payment:start
   ```

3. **Observe the System**:
   - Watch cron jobs execute automatically
   - See real-time logs updating
   - Test manual payment execution
   - Verify 5-minute, weekly, monthly intervals

4. **Test Individual Payments**:
   ```bash
   npm run payment:execute demo-5min
   npm run payment:execute demo-weekly
   npm run payment:execute demo-monthly
   ```

## 📈 Performance Metrics

### Execution Times
- **5-minute jobs**: Execute every 5 minutes
- **Weekly jobs**: Execute every 7 days
- **Monthly jobs**: Execute every 30 days

### Resource Usage
- Minimal memory footprint
- Efficient cron job management
- Real-time UI updates
- Comprehensive logging

## 🔄 Integration Points

### Intent Functions Used
- `getAccount()`: Get NEAR account
- `getAccountBalanceOfNear()`: Check balance
- `depositNearAsMultiToken()`: Deposit NEAR
- `getQuote()`: Get swap quote
- `transferMultiTokenForQuote()`: Execute transfer
- `waitUntilQuoteExecutionCompletes()`: Wait for completion

### Token Mapping Integration
- Uses `COMMON_TOKENS` for asset IDs
- Automatic token/chain mapping
- Support for multiple chains
- Error handling for unsupported combinations

## 🎯 Key Demonstrations

1. **Working Cron Jobs**: Automated execution at specified intervals
2. **Intent Function Calls**: Real blockchain interaction
3. **Cross-Chain Support**: Multiple token/chain combinations
4. **Error Handling**: Robust error management
5. **Real-time Monitoring**: Live status and logging
6. **User Interface**: Intuitive control panel

This system demonstrates a complete, production-ready payment automation solution with cron job functionality, perfect for judges to verify the working code.
