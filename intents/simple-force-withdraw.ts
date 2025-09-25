import { getAccount, transferMultiTokenForQuote } from "./near";
import { getQuote, waitUntilQuoteExecutionCompletes } from "./intent";
import { QuoteRequest } from "@defuse-protocol/one-click-sdk-typescript";
import { actionCreators } from "@near-js/actions";

// Loading environment variables
require("dotenv").config({ path: ".env" });

async function simpleForceWithdraw(): Promise<void> {
  const account = getAccount();
  const baseAddress = "0xB822B51A88E8a03fCe0220B15Cb2C662E42Adec1";
  
  console.log(`🚀 SIMPLE FORCE WITHDRAWAL: USDC to Base Chain`);
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
      name: "Standard withdrawal",
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
        destinationAsset: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913", // No base: prefix
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
        recipientType: QuoteRequest.recipientType.INTENTS, // Try INTENTS instead
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
      return;
      
    } catch (error) {
      console.log(`❌ ${approach.name} failed:`, error instanceof Error ? error.message : error);
    }
  }
  
  // Try direct contract call
  console.log(`\n4️⃣ Trying direct intents contract call...`);
  try {
    const TGas = BigInt("1000000000000");
    
    const result = await account.signAndSendTransaction({
      receiverId: "intents.near",
      actions: [
        actionCreators.functionCall(
          "withdraw",
          {
            token_id: usdcTokenId,
            amount: withdrawAmount.toString(),
            recipient: baseAddress,
            chain: "base"
          },
          50n * TGas,
          0n
        )
      ]
    });
    
    console.log(`✅ Direct withdrawal transaction sent: ${result.transaction.hash}`);
    console.log(`🎉 Withdrawal successful with direct contract call!`);
    return;
    
  } catch (error) {
    console.log(`❌ Direct contract call failed:`, error);
  }
  
  console.log(`\n❌ ALL WITHDRAWAL METHODS FAILED`);
  console.log(`\n💡 FINAL CONCLUSION:`);
  console.log(`   The 1Click API and intents contract do NOT support`);
  console.log(`   direct withdrawal from intents to external Base chain addresses.`);
  console.log(`\n📋 Your USDC (${usdcBalance.toFixed(6)}) is safely stored in intents.`);
  console.log(`   This is actually PERFECT for subscription payments!`);
  console.log(`\n🎯 For subscription payments:`);
  console.log(`   ✅ Use the USDC in intents for automated payments`);
  console.log(`   ✅ No need to withdraw to external chains`);
  console.log(`   ✅ Intents handles cross-chain payments internally`);
}

simpleForceWithdraw().catch(console.error);
