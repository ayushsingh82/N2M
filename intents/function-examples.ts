import { NEAR } from "@near-js/tokens";
import { QuoteRequest } from "@defuse-protocol/one-click-sdk-typescript";
import {
  getAccount,
  getAccountBalanceOfNear,
  getAccountBalanceOfMultiToken,
  depositNearAsMultiToken,
  transferMultiTokenForQuote
} from "./near";
import { getQuote, waitUntilQuoteExecutionCompletes } from "./intent";

// Loading environment variables
require("dotenv").config({ path: ".env" });

async function demonstrateFunctionCalls(): Promise<void> {
  console.log("🚀 Demonstrating function calls from near.ts and deposit.ts\n");

  try {
    // ========================================
    // 1. GET ACCOUNT
    // ========================================
    console.log("1️⃣ Getting NEAR account...");
    const account = getAccount();
    console.log(`✅ Account ID: ${account.accountId}\n`);

    // ========================================
    // 2. GET NEAR BALANCE
    // ========================================
    console.log("2️⃣ Getting NEAR balance...");
    const nearBalance = await getAccountBalanceOfNear(account);
    console.log(`✅ NEAR Balance: ${NEAR.toDecimal(nearBalance)} NEAR\n`);

    // ========================================
    // 3. GET MULTI-TOKEN BALANCE
    // ========================================
    console.log("3️⃣ Getting multi-token balance...");
    const tokenId = "nep141:near.omft.near"; // Example token
    const multiTokenBalance = await getAccountBalanceOfMultiToken(account, tokenId);
    console.log(`✅ Multi-token Balance (${tokenId}): ${multiTokenBalance.toString()}\n`);

    // ========================================
    // 4. DEPOSIT NEAR AS MULTI-TOKEN
    // ========================================
    console.log("4️⃣ Depositing NEAR as multi-token...");
    const depositAmount = NEAR.toUnits("0.01"); // 0.01 NEAR for demo
    
    if (nearBalance >= depositAmount) {
      await depositNearAsMultiToken(account, depositAmount);
      console.log("✅ NEAR deposited as multi-token successfully!\n");
    } else {
      console.log("❌ Insufficient NEAR balance for deposit\n");
    }

    // ========================================
    // 5. GET QUOTE AND EXECUTE
    // ========================================
    console.log("5️⃣ Getting quote and executing...");
    const deadline = new Date();
    deadline.setMinutes(deadline.getMinutes() + 5);

    const quote = await getQuote({
      dry: false,
      swapType: QuoteRequest.swapType.EXACT_INPUT,
      slippageTolerance: 10, // 0.1%
      depositType: QuoteRequest.depositType.INTENTS,
      originAsset: "nep141:near.omft.near",
      destinationAsset: "nep141:base-0x833589fcd6edb6e08f4c7c32d4f71b54bda02913.omft.near",
      amount: depositAmount.toString(),
      refundTo: account.accountId,
      refundType: QuoteRequest.refundType.INTENTS,
      recipient: account.accountId,
      recipientType: QuoteRequest.recipientType.INTENTS,
      deadline: deadline.toISOString(),
    });

    console.log(`✅ Quote received: ${quote.amountInFormatted} → ${quote.amountOutFormatted}`);

    // Execute the quote
    await transferMultiTokenForQuote(account, quote, "nep141:near.omft.near");
    await waitUntilQuoteExecutionCompletes(quote);
    console.log("✅ Quote executed successfully!\n");

    console.log("🎉 All function calls completed successfully!");

  } catch (error) {
    console.error("❌ Error:", error);
  }
}

// ========================================
// INDIVIDUAL FUNCTION EXAMPLES
// ========================================

async function exampleGetAccount(): Promise<void> {
  console.log("📝 Example: getAccount()");
  const account = getAccount();
  console.log(`Account ID: ${account.accountId}`);
  console.log(`Provider: ${account.provider}`);
}

async function exampleGetBalance(): Promise<void> {
  console.log("📝 Example: getAccountBalanceOfNear()");
  const account = getAccount();
  const balance = await getAccountBalanceOfNear(account);
  console.log(`Balance: ${NEAR.toDecimal(balance)} NEAR`);
}

async function exampleGetMultiTokenBalance(): Promise<void> {
  console.log("📝 Example: getAccountBalanceOfMultiToken()");
  const account = getAccount();
  const tokenId = "nep141:near.omft.near";
  const balance = await getAccountBalanceOfMultiToken(account, tokenId);
  console.log(`Multi-token balance: ${balance.toString()}`);
}

async function exampleDeposit(): Promise<void> {
  console.log("📝 Example: depositNearAsMultiToken()");
  const account = getAccount();
  const amount = NEAR.toUnits("0.1"); // Increased to 0.1 NEAR for swap
  
  // Check balance first
  const balance = await getAccountBalanceOfNear(account);
  console.log(`Current NEAR balance: ${NEAR.toDecimal(balance)} NEAR`);
  console.log(`Attempting to deposit: ${NEAR.toDecimal(amount)} NEAR`);
  
  if (balance >= amount) {
    await depositNearAsMultiToken(account, amount);
    console.log("✅ Deposit successful!");
    console.log("💡 Now you can run 'npm run examples:quote' to swap NEAR → USDC");
  } else {
    console.log("❌ Insufficient balance");
    console.log(`Required: ${NEAR.toDecimal(amount)} NEAR, Available: ${NEAR.toDecimal(balance)} NEAR`);
  }
}

async function exampleExecuteQuote(): Promise<void> {
  console.log("📝 Example: Execute Quote");
  const account = getAccount();
  
  // Use a larger amount for the quote (0.1 NEAR instead of 0.01)
  const swapAmount = NEAR.toUnits("0.1");
  
  console.log(`Attempting to swap ${NEAR.toDecimal(swapAmount)} NEAR to USDC on Base`);
  
  try {
    // Get quote - using the correct token ID (wrap.near instead of near.omft.near)
    const quote = await getQuote({
      dry: false,
      swapType: QuoteRequest.swapType.EXACT_INPUT,
      slippageTolerance: 10,
      depositType: QuoteRequest.depositType.INTENTS,
      originAsset: "nep141:wrap.near", // ← Fixed: Use wrap.near (what you actually have)
      destinationAsset: "nep141:base-0x833589fcd6edb6e08f4c7c32d4f71b54bda02913.omft.near",
      amount: swapAmount.toString(),
      refundTo: account.accountId,
      refundType: QuoteRequest.refundType.INTENTS,
      recipient: account.accountId,
      recipientType: QuoteRequest.recipientType.INTENTS,
      deadline: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    });

    console.log(`✅ Quote received: ${quote.amountInFormatted} → ${quote.amountOutFormatted}`);

    // Execute quote - using the correct token ID
    await transferMultiTokenForQuote(account, quote, "nep141:wrap.near");
    await waitUntilQuoteExecutionCompletes(quote);
    console.log("✅ Quote executed successfully!");
    
  } catch (error) {
    console.error("❌ Quote execution failed:", error);
    
    // Check if it's a balance issue
    const balance = await getAccountBalanceOfMultiToken(account, "nep141:wrap.near");
    console.log(`Current multi-token balance: ${balance.toString()}`);
    console.log(`Required amount: ${swapAmount.toString()}`);
    
    if (balance < swapAmount) {
      console.log("💡 Solution: Deposit more NEAR first using 'npm run examples:deposit'");
    }
  }
}

// ========================================
// HOW TO CALL DEPOSIT FUNCTION
// ========================================

async function callDepositFunction(): Promise<void> {
  console.log("📝 How to call deposit function from deposit.ts:");
  
  // Note: The deposit function in deposit.ts is not exported
  // So we need to call the functions individually (recommended approach)
  const account = getAccount();
  const amount = NEAR.toUnits("0.1");
  
  console.log(`You are about to deposit NEAR as cross-chain asset on Near`);
  console.log(`Checking the balance of NEAR for the account ${account.accountId}`);
  
  // Check balance
  const balance = await getAccountBalanceOfNear(account);
  if (balance >= amount) {
    await depositNearAsMultiToken(account, amount);
    console.log("Deposit completed!");
  } else {
    const minBalanceDecimal = NEAR.toDecimal(amount);
    const accountBalanceDecimal = NEAR.toDecimal(balance);
    console.log(`Insufficient balance (required: ${minBalanceDecimal}N, your: ${accountBalanceDecimal}N)`);
  }
}

// ========================================
// MAIN EXECUTION
// ========================================

async function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'demo':
      await demonstrateFunctionCalls();
      break;
    case 'account':
      await exampleGetAccount();
      break;
    case 'balance':
      await exampleGetBalance();
      break;
    case 'multitoken':
      await exampleGetMultiTokenBalance();
      break;
    case 'deposit':
      await exampleDeposit();
      break;
    case 'quote':
      await exampleExecuteQuote();
      break;
    case 'deposit-fn':
      await callDepositFunction();
      break;
    default:
      console.log(`
🔧 Function Call Examples

Usage:
  npm run examples:demo        - Run complete demonstration
  npm run examples:account     - Get account example
  npm run examples:balance      - Get balance example
  npm run examples:multitoken   - Get multi-token balance example
  npm run examples:deposit      - Deposit example
  npm run examples:quote       - Execute quote example
  npm run examples:deposit-fn   - Call deposit function example

Individual Function Calls:
  import { getAccount, getAccountBalanceOfNear, depositNearAsMultiToken } from './near';
  
  const account = getAccount();
  const balance = await getAccountBalanceOfNear(account);
  await depositNearAsMultiToken(account, NEAR.toUnits("0.1"));
      `);
  }
}

// Export functions for use in other files
export {
  exampleGetAccount,
  exampleGetBalance,
  exampleGetMultiTokenBalance,
  exampleDeposit,
  exampleExecuteQuote,
  callDepositFunction
};

// Run if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}
