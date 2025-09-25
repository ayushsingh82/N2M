import { QuoteRequest } from "@defuse-protocol/one-click-sdk-typescript";
import { getAccount, getAccountBalanceOfMultiToken, transferMultiTokenForQuote } from "./near";
import { getQuote, waitUntilQuoteExecutionCompletes } from "./intent";

// Loading environment variables
require("dotenv").config({ path: ".env" });

async function simpleWithdraw(): Promise<void> {
  const account = getAccount();
  const baseAddress = "0xB822B51A88E8a03fCe0220B15Cb2C662E42Adec1";
  
  console.log(`🚀 Simple USDC Withdrawal to Base Chain`);
  console.log(`📍 From: ${account.accountId} (intents)`);
  console.log(`📍 To: ${baseAddress} (Base chain)`);
  
  // Check USDC balance
  const usdcTokenId = "nep141:base-0x833589fcd6edb6e08f4c7c32d4f71b54bda02913.omft.near";
  const balance = await getAccountBalanceOfMultiToken(account, usdcTokenId);
  const usdcBalance = Number(balance) / 1_000_000;
  
  console.log(`💰 Available USDC: ${usdcBalance.toFixed(6)} USDC`);
  
  if (usdcBalance < 0.1) {
    console.log("❌ Insufficient USDC balance (need at least 0.1 USDC)");
    return;
  }
  
  const withdrawAmount = BigInt(100_000); // 0.1 USDC
  
  try {
    console.log(`\n🔄 Getting quote for withdrawal...`);
    
    // Try with different parameters for Base chain withdrawal
    const quote = await getQuote({
      dry: false,
      swapType: QuoteRequest.swapType.EXACT_INPUT,
      slippageTolerance: 50, // Increased slippage tolerance
      depositType: QuoteRequest.depositType.INTENTS,
      originAsset: usdcTokenId, // USDC in intents
      destinationAsset: "base:0x833589fcd6edb6e08f4c7c32d4f71b54bda02913", // USDC on Base
      amount: withdrawAmount.toString(),
      refundTo: account.accountId,
      refundType: QuoteRequest.refundType.INTENTS,
      recipient: baseAddress, // External Base address
      recipientType: QuoteRequest.recipientType.DESTINATION_CHAIN, // To destination chain
      deadline: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
    });
    
    console.log(`✅ Quote received: ${quote.amountInFormatted} → ${quote.amountOutFormatted}`);
    console.log(`📤 Sending ${quote.amountInFormatted} to get ${quote.amountOutFormatted} on Base`);
    
    // Execute the withdrawal
    console.log(`\n🔄 Executing withdrawal transaction...`);
    await transferMultiTokenForQuote(account, quote, usdcTokenId);
    
    console.log(`⏳ Waiting for withdrawal to complete...`);
    await waitUntilQuoteExecutionCompletes(quote);
    
    console.log(`\n🎉 WITHDRAWAL SUCCESSFUL!`);
    console.log(`💰 0.1 USDC has been sent to Base chain address: ${baseAddress}`);
    console.log(`🔗 Check your Base wallet for the USDC`);
    
  } catch (error) {
    console.error(`\n❌ Withdrawal failed:`, error);
    
    if (error instanceof Error && error.message.includes("HTTP 400")) {
      console.log(`\n💡 The 1Click API doesn't support this withdrawal route.`);
      console.log(`📋 Alternative options:`);
      console.log(`   1. Keep USDC in intents for subscription payments`);
      console.log(`   2. Try withdrawing to a different chain`);
      console.log(`   3. Use a different withdrawal service`);
      console.log(`   4. Swap to a different token first`);
    }
  }
}

simpleWithdraw().catch(console.error);
