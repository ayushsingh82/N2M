import { NEAR } from "@near-js/tokens";
import { QuoteRequest } from "@defuse-protocol/one-click-sdk-typescript";
import { depositNearAsMultiToken, getAccount, getAccountBalanceOfNear } from "./near";
import { getQuote, waitUntilQuoteExecutionCompletes } from "./intent";
import { transferMultiTokenForQuote } from "./near";

// Loading environment variables
require("dotenv").config({ path: ".env" });

async function completeFlow(): Promise<void> {
  console.log("🚀 Starting complete NEAR to USDC on Base flow...\n");

  const account = getAccount();
  const amount = NEAR.toUnits("0.1"); // 0.1 NEAR

  try {
    // Step 1: Check NEAR balance
    console.log("📊 Step 1: Checking NEAR balance...");
    const balance = await getAccountBalanceOfNear(account);
    console.log(`Current NEAR balance: ${NEAR.toDecimal(balance)} NEAR`);

    if (balance < amount) {
      throw new Error(`Insufficient NEAR balance. Required: ${NEAR.toDecimal(amount)} NEAR`);
    }

    // Step 2: Deposit NEAR as multi-token
    console.log("\n💰 Step 2: Depositing NEAR as multi-token...");
    await depositNearAsMultiToken(account, amount);
    console.log("✅ NEAR deposited successfully!");

    // Step 3: Get quote for NEAR to USDC on Base
    console.log("\n🔄 Step 3: Getting quote for NEAR to USDC on Base...");
    const deadline = new Date();
    deadline.setMinutes(deadline.getMinutes() + 5);

    const quote = await getQuote({
      dry: false,
      swapType: QuoteRequest.swapType.EXACT_INPUT,
      slippageTolerance: 10, // 0.1%
      depositType: QuoteRequest.depositType.INTENTS,
      originAsset: "nep141:near.omft.near",
      destinationAsset: "nep141:base-0x833589fcd6edb6e08f4c7c32d4f71b54bda02913.omft.near", // USDC on Base
      amount: amount.toString(),
      refundTo: account.accountId,
      refundType: QuoteRequest.refundType.INTENTS,
      recipient: account.accountId, // Keep in intents for now
      recipientType: QuoteRequest.recipientType.INTENTS,
      deadline: deadline.toISOString(),
    });

    console.log(`📈 Quote received: ${quote.amountInFormatted} NEAR → ${quote.amountOutFormatted} USDC`);

    // Step 4: Execute the swap
    console.log("\n⚡ Step 4: Executing NEAR to USDC swap...");
    await transferMultiTokenForQuote(account, quote, "nep141:near.omft.near");
    await waitUntilQuoteExecutionCompletes(quote);
    console.log("✅ Swap completed successfully!");

    // Step 5: Now withdraw USDC to Base chain
    console.log("\n🏦 Step 5: Withdrawing USDC to Base chain...");
    const withdrawQuote = await getQuote({
      dry: false,
      swapType: QuoteRequest.swapType.EXACT_INPUT,
      slippageTolerance: 10,
      depositType: QuoteRequest.depositType.INTENTS,
      originAsset: "nep141:base-0x833589fcd6edb6e08f4c7c32d4f71b54bda02913.omft.near",
      destinationAsset: "base:0x833589fcd6edb6e08f4c7c32d4f71b54bda02913", // USDC on Base
      amount: quote.amountOut, // Use the amount from the swap
      refundTo: account.accountId,
      refundType: QuoteRequest.refundType.INTENTS,
      recipient: "0xB822B51A88E8a03fCe0220B15Cb2C662E42Adec1", // Base chain address
      recipientType: QuoteRequest.recipientType.DESTINATION_CHAIN,
      deadline: deadline.toISOString(),
    });

    console.log(`📤 Withdraw quote: ${withdrawQuote.amountInFormatted} USDC → Base chain`);

    await transferMultiTokenForQuote(account, withdrawQuote, "nep141:base-0x833589fcd6edb6e08f4c7c32d4f71b54bda02913.omft.near");
    await waitUntilQuoteExecutionCompletes(withdrawQuote);

    console.log("\n🎉 Complete flow finished successfully!");
    console.log("📋 Summary:");
    console.log(`   • Deposited: ${NEAR.toDecimal(amount)} NEAR`);
    console.log(`   • Swapped to: ${quote.amountOutFormatted} USDC`);
    console.log(`   • Withdrawn to Base: ${withdrawQuote.amountOutFormatted} USDC`);

  } catch (error) {
    console.error("❌ Error in complete flow:", error);
    throw error;
  }
}

// Run the complete flow
completeFlow().catch((error: unknown) => {
  const { styleText } = require("node:util");

  if (error instanceof Error) {
    console.error(styleText("red", error.message));
  } else {
    console.error(styleText("red", JSON.stringify(error)));
  }
});
