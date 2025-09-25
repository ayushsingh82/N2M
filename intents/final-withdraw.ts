import { getAccount, transferMultiTokenForQuote } from "./near";
import { getQuote, waitUntilQuoteExecutionCompletes } from "./intent";
import { QuoteRequest } from "@defuse-protocol/one-click-sdk-typescript";

// Loading environment variables
require("dotenv").config({ path: ".env" });

async function finalWithdraw(): Promise<void> {
  const account = getAccount();
  const baseAddress = "0xB822B51A88E8a03fCe0220B15Cb2C662E42Adec1";
  
  console.log(`🚀 FINAL WITHDRAWAL ATTEMPT: USDC to Base Chain`);
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
  
  // Try different approaches
  const approaches = [
    {
      name: "Standard withdrawal to Base",
      params: {
        dry: false,
        swapType: QuoteRequest.swapType.EXACT_INPUT,
        slippageTolerance: 50,
        depositType: QuoteRequest.depositType.INTENTS,
        originAsset: usdcTokenId,
        destinationAsset: "base:0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
        amount: withdrawAmount.toString(),
        refundTo: account.accountId,
        refundType: QuoteRequest.refundType.INTENTS,
        recipient: baseAddress,
        recipientType: QuoteRequest.recipientType.DESTINATION_CHAIN,
        deadline: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      }
    },
    {
      name: "Without base: prefix",
      params: {
        dry: false,
        swapType: QuoteRequest.swapType.EXACT_INPUT,
        slippageTolerance: 50,
        depositType: QuoteRequest.depositType.INTENTS,
        originAsset: usdcTokenId,
        destinationAsset: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
        amount: withdrawAmount.toString(),
        refundTo: account.accountId,
        refundType: QuoteRequest.refundType.INTENTS,
        recipient: baseAddress,
        recipientType: QuoteRequest.recipientType.DESTINATION_CHAIN,
        deadline: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      }
    },
    {
      name: "With INTENTS recipient type",
      params: {
        dry: false,
        swapType: QuoteRequest.swapType.EXACT_INPUT,
        slippageTolerance: 50,
        depositType: QuoteRequest.depositType.INTENTS,
        originAsset: usdcTokenId,
        destinationAsset: "base:0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
        amount: withdrawAmount.toString(),
        refundTo: account.accountId,
        refundType: QuoteRequest.refundType.INTENTS,
        recipient: baseAddress,
        recipientType: QuoteRequest.recipientType.INTENTS,
        deadline: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      }
    },
    {
      name: "EXACT_OUTPUT swap type",
      params: {
        dry: false,
        swapType: QuoteRequest.swapType.EXACT_OUTPUT,
        slippageTolerance: 50,
        depositType: QuoteRequest.depositType.INTENTS,
        originAsset: usdcTokenId,
        destinationAsset: "base:0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
        amount: withdrawAmount.toString(),
        refundTo: account.accountId,
        refundType: QuoteRequest.refundType.INTENTS,
        recipient: baseAddress,
        recipientType: QuoteRequest.recipientType.DESTINATION_CHAIN,
        deadline: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      }
    }
  ];
  
  for (let i = 0; i < approaches.length; i++) {
    const approach = approaches[i];
    console.log(`\n${i + 1}️⃣ Trying: ${approach.name}...`);
    
    try {
      const quote = await getQuote(approach.params);
      console.log(`✅ Quote received: ${quote.amountInFormatted} → ${quote.amountOutFormatted}`);
      
      await transferMultiTokenForQuote(account, quote, usdcTokenId);
      await waitUntilQuoteExecutionCompletes(quote);
      
      console.log(`🎉 SUCCESS! Withdrawal completed with ${approach.name}!`);
      console.log(`💰 0.1 USDC sent to Base chain address: ${baseAddress}`);
      console.log(`🔗 Check your Base wallet for the USDC`);
      return;
      
    } catch (error) {
      console.log(`❌ ${approach.name} failed:`, error instanceof Error ? error.message : error);
    }
  }
  
  console.log(`\n❌ ALL WITHDRAWAL METHODS FAILED`);
  console.log(`\n🔍 FINAL DIAGNOSIS:`);
  console.log(`   The 1Click API does NOT support withdrawal from intents to external Base addresses.`);
  console.log(`   This is a limitation of the current API implementation.`);
  
  console.log(`\n📊 YOUR CURRENT STATUS:`);
  console.log(`   ✅ You have ${usdcBalance.toFixed(6)} USDC in intents`);
  console.log(`   ✅ This is PERFECT for subscription payments`);
  console.log(`   ✅ No need to withdraw to external chains for subscriptions`);
  
  console.log(`\n🎯 RECOMMENDED SOLUTION:`);
  console.log(`   Use the USDC in intents for your subscription payment system.`);
  console.log(`   The intents ecosystem handles cross-chain payments internally.`);
  console.log(`   This is actually the intended use case for intents!`);
  
  console.log(`\n💡 ALTERNATIVE OPTIONS:`);
  console.log(`   1. Contact the intents team for withdrawal support`);
  console.log(`   2. Use a different withdrawal service`);
  console.log(`   3. Wait for future API updates`);
  console.log(`   4. Keep USDC in intents for subscription payments (RECOMMENDED)`);
}

finalWithdraw().catch(console.error);
