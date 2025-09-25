import { QuoteRequest } from "@defuse-protocol/one-click-sdk-typescript";
import { getAccount, getAccountBalanceOfMultiToken, transferMultiTokenForQuote } from "./near";
import { getQuote, waitUntilQuoteExecutionCompletes } from "./intent";

// Loading environment variables
require("dotenv").config({ path: ".env" });

async function testWithdraw(): Promise<void> {
  const account = getAccount();
  
  console.log(`🔍 Testing withdraw for account: ${account.accountId}`);
  
  // Check USDC balance first
  const usdcTokenId = "nep141:base-0x833589fcd6edb6e08f4c7c32d4f71b54bda02913.omft.near";
  const balance = await getAccountBalanceOfMultiToken(account, usdcTokenId);
  console.log(`💰 Current USDC balance: ${(Number(balance) / 1_000_000).toFixed(6)} USDC`);
  
  const withdrawAmount = BigInt(100_000); // 0.1 USDC
  
  if (balance < withdrawAmount) {
    console.log("❌ Insufficient USDC balance for withdrawal");
    return;
  }
  
  console.log(`\n🔄 Attempting to withdraw 0.1 USDC to Base chain...`);
  console.log(`📍 Destination: 0xB822B51A88E8a03fCe0220B15Cb2C662E42Adec1`);
  
  try {
    // Get quote for withdrawal
    const quote = await getQuote({
      dry: false,
      swapType: QuoteRequest.swapType.EXACT_INPUT,
      slippageTolerance: 10, // 0.1%
      depositType: QuoteRequest.depositType.INTENTS,
      originAsset: usdcTokenId, // USDC in intents
      destinationAsset: "base:0x833589fcd6edb6e08f4c7c32d4f71b54bda02913", // USDC on Base chain
      amount: withdrawAmount.toString(),
      refundTo: account.accountId,
      refundType: QuoteRequest.refundType.INTENTS,
      recipient: "0xB822B51A88E8a03fCe0220B15Cb2C662E42Adec1", // Base chain address
      recipientType: QuoteRequest.recipientType.DESTINATION_CHAIN, // Important: destination chain
      deadline: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    });
    
    console.log(`✅ Quote received: ${quote.amountInFormatted} → ${quote.amountOutFormatted}`);
    
    // Execute the withdrawal
    await transferMultiTokenForQuote(account, quote, usdcTokenId);
    await waitUntilQuoteExecutionCompletes(quote);
    
    console.log("🎉 Withdrawal completed successfully!");
    console.log("💰 0.1 USDC has been sent to Base chain!");
    
  } catch (error) {
    console.error("❌ Withdrawal failed:", error);
    
    // Try to get more details about the error
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      if (error.message.includes("HTTP 400")) {
        console.log("\n💡 HTTP 400 usually means:");
        console.log("1. Invalid token addresses");
        console.log("2. Insufficient liquidity");
        console.log("3. Invalid recipient address");
        console.log("4. Quote parameters mismatch");
      }
    }
  }
}

testWithdraw().catch(console.error);
