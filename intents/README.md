# NEAR Intents Workflow

This folder contains all the core files used in the NEAR intents subscription payment workflow.

## 📁 Core Files

### **Blockchain Integration**
- **`near.ts`** - Core NEAR account functions (getAccount, getBalance, deposit, transfer)
- **`intent.ts`** - Intent and quote functions (getQuote, waitUntilQuoteExecutionCompletes)
- **`constants.ts`** - Intents contract ID and constants

### **Payment Operations**
- **`deposit.ts`** - Deposit NEAR as cross-chain asset
- **`swap.ts`** - Cross-chain token swapping
- **`withdraw.ts`** - Withdraw tokens to destination chains

### **Complete Workflows**
- **`complete-flow.ts`** - Complete flow: Deposit → Swap → Withdraw
- **`function-examples.ts`** - Examples of all function calls

### **Token Management**
- **`token-mapping.ts`** - Comprehensive token/chain database and helper functions

### **Automation & Scheduling**
- **`payment-service.ts`** - Automated payment service with cron jobs
- **`cron-demo.ts`** - Cron job demonstration and testing

## 📚 Documentation

- **`FUNCTION_CALL_GUIDE.md`** - How to call functions from each file
- **`CRON_JOBS_DOCUMENTATION.md`** - Cron job dependencies and usage
- **`PAYMENT_SYSTEM_README.md`** - Payment system explanation for judges
- **`SUBSCRIPTION_README.md`** - Subscription automation guide

## 🚀 Quick Start

### **Basic Flow**
```bash
# 1. Deposit NEAR to intents
npm run examples:deposit

# 2. Swap NEAR → USDC
npm run examples:quote

# 3. Complete flow (Deposit → Swap → Withdraw)
npm run flow:complete
```

### **Automation**
```bash
# Start payment service
npm run payment:start

# Start cron job demo
npm run cron:start

# Check status
npm run payment:status
npm run cron:status
```

### **Token Management**
```bash
# Get token information
npm run token:info <assetId>

# List supported chains
npm run token:chains

# Find tokens by symbol
npm run token:symbol USDC
```

## 🔧 Function Examples

### **Account Management**
```typescript
import { getAccount, getAccountBalanceOfNear } from "./near";

const account = getAccount();
const balance = await getAccountBalanceOfNear(account);
```

### **Deposit**
```typescript
import { depositNearAsMultiToken } from "./near";
import { NEAR } from "@near-js/tokens";

await depositNearAsMultiToken(account, NEAR.toUnits("0.1"));
```

### **Swap**
```typescript
import { getQuote, waitUntilQuoteExecutionCompletes } from "./intent";
import { transferMultiTokenForQuote } from "./near";

const quote = await getQuote({...});
await transferMultiTokenForQuote(account, quote, tokenId);
await waitUntilQuoteExecutionCompletes(quote);
```

### **Withdraw**
```typescript
import { withdraw } from "./withdraw";

await withdraw({
  inputToken: "nep141:base-0x833589fcd6edb6e08f4c7c32d4f71b54bda02913.omft.near",
  outputToken: "base:0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
  inputAmount: BigInt(100_000),
  slippageTolerance: 10,
  receiverAddress: "0xB822B51A88E8a03fCe0220B15Cb2C662E42Adec1"
});
```

## 🎯 Key Features

### ✅ **Cross-Chain Payments**
- Deposit NEAR as multi-token
- Swap between different tokens and chains
- Automated cross-chain transfers

### ✅ **Subscription Automation**
- Cron job scheduling (5min, weekly, monthly)
- Automated payment processing
- Real-time monitoring and logging

### ✅ **Token Management**
- Comprehensive token database
- Multi-chain support (Ethereum, Base, Arbitrum, Solana, etc.)
- Helper functions for token operations

### ✅ **Professional Implementation**
- TypeScript with proper types
- Error handling and logging
- Comprehensive documentation
- Production-ready code

## 🔐 Environment Setup

Create a `.env` file in the parent directory:
```bash
ACCOUNT_PRIVATE_KEY=your_near_private_key
ACCOUNT_ID=your_near_account_id
```

## 📊 Supported Networks

- **NEAR Protocol** (native)
- **Ethereum** (ETH, USDC, USDT, DAI)
- **Base** (ETH, USDC)
- **Arbitrum** (ETH, USDC, USDT)
- **Solana** (USDC, USDT)
- **Polygon** (USDC, USDT)
- **BSC** (USDC, USDT)
- **Optimism** (ETH, USDC, USDT)
- **Avalanche** (USDC, USDT)

## 🎉 Perfect for Subscription Payments

This workflow is designed for subscription payment systems where:
- Users deposit tokens to intents
- Automated payments are processed via cron jobs
- Cross-chain payments happen seamlessly
- No need for external withdrawals

The intents ecosystem handles all the complexity of cross-chain operations internally!
