import { QuoteRequest } from "@defuse-protocol/one-click-sdk-typescript";
import { getAccount, getAccountBalanceOfMultiToken, transferMultiTokenForQuote } from "./near";
import { getQuote, waitUntilQuoteExecutionCompletes } from "./intent";

// Loading environment variables
require("dotenv").config({ path: ".env" });

async function testWithdrawToIntents(): Promise<void> {
  const account = getAccount();
  
  console.log(`🔍 Testing withdraw to intents for account: ${account.accountId}`);
  
  // Check USDC balance first
  const usdcTokenId = "nep141:base-0x833589fcd6edb6e08f4c7c32d4f71b54bda02913.omft.near";
  const balance = await getAccountBalanceOfMultiToken(account, usdcTokenId);
  console.log(`💰 Current USDC balance: ${(Number(balance) / 1_000_000).toFixed(6)} USDC`);
  
  const withdrawAmount = BigInt(100_000); // 0.1 USDC
  
  if (balance < withdrawAmount) {
    console.log("❌ Insufficient USDC balance for withdrawal");
    return;
  }
  
  console.log(`\n🔄 Attempting to withdraw 0.1 USDC to intents (keeping in intents)...`);
  
  try {
    // Try withdrawing to intents first (recipient stays in intents)
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
      recipient: account.accountId, // Keep in intents
      recipientType: QuoteRequest.recipientType.INTENTS, // Stay in intents
      deadline: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    });
    
    console.log(`✅ Quote received: ${quote.amountInFormatted} → ${quote.amountOutFormatted}`);
    
    // Execute the withdrawal
    await transferMultiTokenForQuote(account, quote, usdcTokenId);
    await waitUntilQuoteExecutionCompletes(quote);
    
    console.log("🎉 Withdrawal to intents completed successfully!");
    console.log("💰 USDC is now available in intents for further operations");
    
  } catch (error) {
    console.error("❌ Withdrawal to intents failed:", error);
    
    // Try alternative: maybe we need to use a different destination asset format
    console.log("\n🔄 Trying alternative approach...");
    
    try {
      // Try with different destination asset format
      const quote2 = await getQuote({
        dry: false,
        swapType: QuoteRequest.swapType.EXACT_INPUT,
        slippageTolerance: 10,
        depositType: QuoteRequest.depositType.INTENTS,
        originAsset: usdcTokenId,
        destinationAsset: "nep141:base-0x833589fcd6edb6e08f4c7c32d4f71b54bda02913.omft.near", // Same as origin
        amount: withdrawAmount.toString(),
        refundTo: account.accountId,
        refundType: QuoteRequest.refundType.INTENTS,
        recipient: account.accountId,
        recipientType: QuoteRequest.recipientType.INTENTS,
        deadline: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      });
      
      console.log(`✅ Alternative quote received: ${quote2.amountInFormatted} → ${quote2.amountOutFormatted}`);
      
    } catch (error2) {
      console.error("❌ Alternative approach also failed:", error2);
      console.log("\n💡 Possible issues:");
      console.log("1. The 1Click API might not support this withdrawal route");
      console.log("2. There might be insufficient liquidity for USDC on Base");
      console.log("3. The token addresses might not be supported for withdrawal");
      console.log("4. You might need to use a different withdrawal method");
    }
  }
}

testWithdrawToIntents().catch(console.error);
