import { getAccount, transferMultiTokenForQuote } from "./near";
import { getQuote, waitUntilQuoteExecutionCompletes } from "./intent";
import { QuoteRequest } from "@defuse-protocol/one-click-sdk-typescript";

// Loading environment variables
require("dotenv").config({ path: ".env" });

async function forceWithdraw(): Promise<void> {
  const account = getAccount();
  const baseAddress = "0xB822B51A88E8a03fCe0220B15Cb2C662E42Adec1";
  
  console.log(`🚀 FORCE WITHDRAWAL: USDC from Intents to Base Chain`);
  console.log(`📍 From: ${account.accountId} (intents)`);
  console.log(`📍 To: ${baseAddress} (Base chain)`);
  
  // Check USDC balance
  const usdcTokenId = "nep141:base-0x833589fcd6edb6e08f4c7c32d4f71b54bda02913.omft.near";
  const balance = await account.provider.callFunction(
    "intents.near",
    "mt_balance_of",
    {
      token_id: usdcTokenId,
      account_id: account.accountId,
    }
  );
  
  const usdcBalance = Number(balance as string) / 1_000_000;
  console.log(`💰 Available USDC: ${usdcBalance.toFixed(6)} USDC`);
  
  if (usdcBalance < 0.1) {
    console.log("❌ Insufficient USDC balance");
    return;
  }
  
  const withdrawAmount = BigInt(100_000); // 0.1 USDC
  
  console.log(`\n🔄 Attempting multiple withdrawal approaches...`);
  
  // Approach 1: Try with different destination asset format
  console.log(`\n1️⃣ Trying with different destination asset format...`);
  try {
    const quote1 = await getQuote({
      dry: false,
      swapType: QuoteRequest.swapType.EXACT_INPUT,
      slippageTolerance: 100, // 1% slippage
      depositType: QuoteRequest.depositType.INTENTS,
      originAsset: usdcTokenId,
      destinationAsset: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913", // Without "base:" prefix
      amount: withdrawAmount.toString(),
      refundTo: account.accountId,
      refundType: QuoteRequest.refundType.INTENTS,
      recipient: baseAddress,
      recipientType: QuoteRequest.recipientType.DESTINATION_CHAIN,
      deadline: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    });
    
    console.log(`✅ Quote 1 received: ${quote1.amountInFormatted} → ${quote1.amountOutFormatted}`);
    await transferMultiTokenForQuote(account, quote1, usdcTokenId);
    await waitUntilQuoteExecutionCompletes(quote1);
    console.log(`🎉 Withdrawal successful with approach 1!`);
    return;
    
  } catch (error) {
    console.log(`❌ Approach 1 failed:`, error);
  }
  
  // Approach 2: Try with different recipient type
  console.log(`\n2️⃣ Trying with different recipient type...`);
  try {
    const quote2 = await getQuote({
      dry: false,
      swapType: QuoteRequest.swapType.EXACT_INPUT,
      slippageTolerance: 100,
      depositType: QuoteRequest.depositType.INTENTS,
      originAsset: usdcTokenId,
      destinationAsset: "base:0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
      amount: withdrawAmount.toString(),
      refundTo: account.accountId,
      refundType: QuoteRequest.refundType.INTENTS,
      recipient: baseAddress,
      recipientType: QuoteRequest.recipientType.INTENTS, // Try INTENTS instead of DESTINATION_CHAIN
      deadline: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    });
    
    console.log(`✅ Quote 2 received: ${quote2.amountInFormatted} → ${quote2.amountOutFormatted}`);
    await transferMultiTokenForQuote(account, quote2, usdcTokenId);
    await waitUntilQuoteExecutionCompletes(quote2);
    console.log(`🎉 Withdrawal successful with approach 2!`);
    return;
    
  } catch (error) {
    console.log(`❌ Approach 2 failed:`, error);
  }
  
  // Approach 3: Try with different swap type
  console.log(`\n3️⃣ Trying with different swap type...`);
  try {
    const quote3 = await getQuote({
      dry: false,
      swapType: QuoteRequest.swapType.EXACT_OUTPUT, // Try EXACT_OUTPUT
      slippageTolerance: 100,
      depositType: QuoteRequest.depositType.INTENTS,
      originAsset: usdcTokenId,
      destinationAsset: "base:0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
      amount: withdrawAmount.toString(),
      refundTo: account.accountId,
      refundType: QuoteRequest.refundType.INTENTS,
      recipient: baseAddress,
      recipientType: QuoteRequest.recipientType.DESTINATION_CHAIN,
      deadline: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    });
    
    console.log(`✅ Quote 3 received: ${quote3.amountInFormatted} → ${quote3.amountOutFormatted}`);
    await transferMultiTokenForQuote(account, quote3, usdcTokenId);
    await waitUntilQuoteExecutionCompletes(quote3);
    console.log(`🎉 Withdrawal successful with approach 3!`);
    return;
    
  } catch (error) {
    console.log(`❌ Approach 3 failed:`, error);
  }
  
  // Approach 4: Try direct intents contract call
  console.log(`\n4️⃣ Trying direct intents contract call...`);
  try {
    // Try to call a withdrawal method directly on the intents contract
    const result = await account.signAndSendTransaction({
      receiverId: "intents.near",
      actions: [
        {
          type: "FunctionCall",
          params: {
            methodName: "withdraw",
            args: {
              token_id: usdcTokenId,
              amount: withdrawAmount.toString(),
              recipient: baseAddress,
              chain: "base"
            },
            gas: "300000000000000",
            deposit: "0"
          }
        }
      ]
    });
    
    console.log(`✅ Direct withdrawal transaction sent: ${result.transaction.hash}`);
    console.log(`🎉 Withdrawal successful with direct contract call!`);
    return;
    
  } catch (error) {
    console.log(`❌ Approach 4 failed:`, error);
  }
  
  console.log(`\n❌ ALL APPROACHES FAILED`);
  console.log(`💡 The 1Click API and intents contract do not support direct withdrawal to external Base addresses.`);
  console.log(`📋 Your options:`);
  console.log(`   1. Keep USDC in intents for subscription payments`);
  console.log(`   2. Use a different withdrawal service`);
  console.log(`   3. Contact the intents team for withdrawal support`);
  console.log(`   4. Wait for future API updates that support this feature`);
}

forceWithdraw().catch(console.error);
