# Function Call Guide

This guide shows how to call functions from `near.ts` and `deposit.ts`.

## 📋 Quick Reference

### 1. **getAccount()** - Get NEAR Account
```typescript
import { getAccount } from "./near";

const account = getAccount();
console.log(`Account ID: ${account.accountId}`);
```

### 2. **getAccountBalanceOfNear()** - Get NEAR Balance
```typescript
import { getAccount, getAccountBalanceOfNear } from "./near";
import { NEAR } from "@near-js/tokens";

const account = getAccount();
const balance = await getAccountBalanceOfNear(account);
console.log(`Balance: ${NEAR.toDecimal(balance)} NEAR`);
```

### 3. **getAccountBalanceOfMultiToken()** - Get Multi-Token Balance
```typescript
import { getAccount, getAccountBalanceOfMultiToken } from "./near";

const account = getAccount();
const tokenId = "nep141:near.omft.near";
const balance = await getAccountBalanceOfMultiToken(account, tokenId);
console.log(`Multi-token balance: ${balance.toString()}`);
```

### 4. **depositNearAsMultiToken()** - Deposit NEAR as Multi-Token
```typescript
import { getAccount, depositNearAsMultiToken, getAccountBalanceOfNear } from "./near";
import { NEAR } from "@near-js/tokens";

const account = getAccount();
const amount = NEAR.toUnits("0.1"); // 0.1 NEAR

// Check balance first
const balance = await getAccountBalanceOfNear(account);
if (balance >= amount) {
  await depositNearAsMultiToken(account, amount);
  console.log("Deposit successful!");
} else {
  console.log("Insufficient balance");
}
```

### 5. **Call Deposit Function from deposit.ts**
```typescript
// Method 1: Import the deposit function
import { deposit } from "./deposit";

// Method 2: Call functions individually (recommended)
import { getAccount, depositNearAsMultiToken, getAccountBalanceOfNear } from "./near";
import { NEAR } from "@near-js/tokens";

const account = getAccount();
const amount = NEAR.toUnits("0.1");

const balance = await getAccountBalanceOfNear(account);
if (balance >= amount) {
  await depositNearAsMultiToken(account, amount);
}
```

### 6. **Execute Quote** - Get Quote and Execute
```typescript
import { getAccount, transferMultiTokenForQuote } from "./near";
import { getQuote, waitUntilQuoteExecutionCompletes } from "./intent";
import { QuoteRequest } from "@defuse-protocol/one-click-sdk-typescript";
import { NEAR } from "@near-js/tokens";

const account = getAccount();

// Get quote
const quote = await getQuote({
  dry: false,
  swapType: QuoteRequest.swapType.EXACT_INPUT,
  slippageTolerance: 10, // 0.1%
  depositType: QuoteRequest.depositType.INTENTS,
  originAsset: "nep141:near.omft.near",
  destinationAsset: "nep141:base-0x833589fcd6edb6e08f4c7c32d4f71b54bda02913.omft.near",
  amount: NEAR.toUnits("0.1").toString(),
  refundTo: account.accountId,
  refundType: QuoteRequest.refundType.INTENTS,
  recipient: account.accountId,
  recipientType: QuoteRequest.recipientType.INTENTS,
  deadline: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
});

// Execute quote
await transferMultiTokenForQuote(account, quote, "nep141:near.omft.near");
await waitUntilQuoteExecutionCompletes(quote);
console.log("Quote executed successfully!");
```

## 🚀 Available Commands

```bash
# Run complete demonstration
npm run examples:demo

# Individual examples
npm run examples:account      # getAccount()
npm run examples:balance      # getAccountBalanceOfNear()
npm run examples:multitoken   # getAccountBalanceOfMultiToken()
npm run examples:deposit      # depositNearAsMultiToken()
npm run examples:quote        # Execute quote
npm run examples:deposit-fn   # Call deposit function
```

## 🔧 Environment Setup

Make sure you have these environment variables in your `.env` file:
```bash
ACCOUNT_PRIVATE_KEY=your_near_private_key_here
ACCOUNT_ID=your_near_account_id_here
```

## 📝 Common Patterns

### Complete Flow Example
```typescript
import { getAccount, getAccountBalanceOfNear, depositNearAsMultiToken } from "./near";
import { getQuote, waitUntilQuoteExecutionCompletes } from "./intent";
import { transferMultiTokenForQuote } from "./near";
import { NEAR } from "@near-js/tokens";

async function completeFlow() {
  const account = getAccount();
  const amount = NEAR.toUnits("0.1");
  
  // 1. Check balance
  const balance = await getAccountBalanceOfNear(account);
  if (balance < amount) {
    throw new Error("Insufficient balance");
  }
  
  // 2. Deposit NEAR as multi-token
  await depositNearAsMultiToken(account, amount);
  
  // 3. Get quote
  const quote = await getQuote({...});
  
  // 4. Execute quote
  await transferMultiTokenForQuote(account, quote, "nep141:near.omft.near");
  await waitUntilQuoteExecutionCompletes(quote);
  
  console.log("Flow completed!");
}
```

## ⚠️ Important Notes

1. **Always check balance** before depositing
2. **Use proper error handling** with try-catch blocks
3. **Set appropriate deadlines** for quotes (usually 5 minutes)
4. **Use correct token IDs** for multi-token operations
5. **Wait for transaction finalization** when needed
