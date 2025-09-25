# Function Call Guide

This guide shows how to call functions from `near.ts`, `deposit.ts`, `intent.ts`, and `withdraw.ts`.

## 📁 File Structure & Function Sources

### **near.ts** - Core NEAR Account Functions
- `getAccount()` - Get NEAR account instance
- `getAccountBalanceOfNear()` - Get NEAR token balance
- `getAccountBalanceOfMultiToken()` - Get multi-token balance
- `depositNearAsMultiToken()` - Deposit NEAR as cross-chain asset
- `transferMultiTokenForQuote()` - Execute quote transfer

### **intent.ts** - Intent & Quote Functions
- `getQuote()` - Get cross-chain swap quote
- `waitUntilQuoteExecutionCompletes()` - Wait for quote completion

### **deposit.ts** - Deposit Functions
- `deposit()` - Main deposit function (not exported, use individual functions)

### **withdraw.ts** - Withdrawal Functions
- `withdraw()` - Withdraw tokens to destination chain

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

### 7. **Withdraw Tokens** - Withdraw to Destination Chain
```typescript
import { withdraw } from "./withdraw";

// Withdraw USDC from NEAR intents to Base chain
await withdraw({
  inputToken: "nep141:base-0x833589fcd6edb6e08f4c7c32d4f71b54bda02913.omft.near", // USDC on Base (from swap)
  outputToken: "base:0x833589fcd6edb6e08f4c7c32d4f71b54bda02913", // USDC on Base chain
  inputAmount: BigInt(100_000), // 0.1 USDC (6 decimals)
  slippageTolerance: 10, // 0.1%
  receiverAddress: "0xB822B51A88E8a03fCe0220B15Cb2C662E42Adec1", // Base chain address
});
```

## 🚀 Available Commands

```bash
# Run complete demonstration
npm run examples:demo

# Individual examples
npm run examples:account      # getAccount() from near.ts
npm run examples:balance      # getAccountBalanceOfNear() from near.ts
npm run examples:multitoken   # getAccountBalanceOfMultiToken() from near.ts
npm run examples:deposit      # depositNearAsMultiToken() from near.ts
npm run examples:quote        # Execute quote from intent.ts
npm run examples:deposit-fn   # Call deposit function from deposit.ts

# Withdraw example
npm run withdraw              # withdraw() from withdraw.ts
```

## 🔧 Environment Setup

Make sure you have these environment variables in your `.env` file:
```bash
ACCOUNT_PRIVATE_KEY=your_near_private_key_here
ACCOUNT_ID=your_near_account_id_here
```

## 📝 Common Patterns

### Complete Flow Example (Deposit → Swap → Withdraw)
```typescript
import { getAccount, getAccountBalanceOfNear, depositNearAsMultiToken, transferMultiTokenForQuote } from "./near";
import { getQuote, waitUntilQuoteExecutionCompletes } from "./intent";
import { withdraw } from "./withdraw";
import { QuoteRequest } from "@defuse-protocol/one-click-sdk-typescript";
import { NEAR } from "@near-js/tokens";

async function completeFlow() {
  const account = getAccount();
  const amount = NEAR.toUnits("0.1");
  
  // 1. Check NEAR balance
  const balance = await getAccountBalanceOfNear(account);
  if (balance < amount) {
    throw new Error("Insufficient NEAR balance");
  }
  
  // 2. Deposit NEAR as multi-token (from near.ts)
  await depositNearAsMultiToken(account, amount);
  console.log("✅ NEAR deposited as multi-token");
  
  // 3. Get quote for NEAR → USDC swap (from intent.ts)
  const quote = await getQuote({
    dry: false,
    swapType: QuoteRequest.swapType.EXACT_INPUT,
    slippageTolerance: 10,
    depositType: QuoteRequest.depositType.INTENTS,
    originAsset: "nep141:near.omft.near",
    destinationAsset: "nep141:base-0x833589fcd6edb6e08f4c7c32d4f71b54bda02913.omft.near",
    amount: amount.toString(),
    refundTo: account.accountId,
    refundType: QuoteRequest.refundType.INTENTS,
    recipient: account.accountId,
    recipientType: QuoteRequest.recipientType.INTENTS,
    deadline: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
  });
  
  // 4. Execute quote (from near.ts + intent.ts)
  await transferMultiTokenForQuote(account, quote, "nep141:near.omft.near");
  await waitUntilQuoteExecutionCompletes(quote);
  console.log("✅ NEAR swapped to USDC on Base");
  
  // 5. Withdraw USDC to Base chain (from withdraw.ts)
  await withdraw({
    inputToken: "nep141:base-0x833589fcd6edb6e08f4c7c32d4f71b54bda02913.omft.near",
    outputToken: "base:0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
    inputAmount: BigInt(100_000), // 0.1 USDC
    slippageTolerance: 10,
    receiverAddress: "0xB822B51A88E8a03fCe0220B15Cb2C662E42Adec1",
  });
  console.log("✅ USDC withdrawn to Base chain");
  
  console.log("🎉 Complete flow finished!");
}
```

## 📊 Function Call Summary

| Command | Function Called | Source File | Purpose |
|---------|----------------|-------------|---------|
| `npm run examples:account` | `getAccount()` | `near.ts` | Get NEAR account instance |
| `npm run examples:balance` | `getAccountBalanceOfNear()` | `near.ts` | Get NEAR token balance |
| `npm run examples:multitoken` | `getAccountBalanceOfMultiToken()` | `near.ts` | Get multi-token balance |
| `npm run examples:deposit` | `depositNearAsMultiToken()` | `near.ts` | Deposit NEAR as cross-chain asset |
| `npm run examples:quote` | `getQuote()` + `transferMultiTokenForQuote()` | `intent.ts` + `near.ts` | Execute cross-chain swap |
| `npm run examples:deposit-fn` | Individual functions | `deposit.ts` | Call deposit function (not exported) |
| `npm run withdraw` | `withdraw()` | `withdraw.ts` | Withdraw tokens to destination chain |

## 🔄 Complete Flow Commands

```bash
# Run the complete flow (Deposit → Swap → Withdraw)
npm run flow:complete

# Test individual components
npm run examples:demo    # All function examples
npm run withdraw         # Withdraw example
```

## ⚠️ Important Notes

1. **Always check balance** before depositing or withdrawing
2. **Use proper error handling** with try-catch blocks
3. **Set appropriate deadlines** for quotes (usually 5 minutes)
4. **Use correct token IDs** for multi-token operations
5. **Wait for transaction finalization** when needed
6. **Withdraw function** requires sufficient multi-token balance
7. **Cross-chain addresses** must be valid for destination chain
