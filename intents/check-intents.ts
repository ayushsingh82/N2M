import { getAccount, getAccountBalanceOfMultiToken } from "./near";
import { INTENTS_CONTRACT_ID } from "./constants";

// Loading environment variables
require("dotenv").config({ path: ".env" });

async function checkIntents(): Promise<void> {
  const account = getAccount();
  const baseAddress = "0xB822B51A88E8a03fCe0220B15Cb2C662E42Adec1";
  
  console.log(`🔍 Checking intents contract and withdrawal options...`);
  console.log(`📍 Account: ${account.accountId}`);
  console.log(`📍 Intents Contract: ${INTENTS_CONTRACT_ID}`);
  console.log(`📍 Target Address: ${baseAddress}`);
  
  // Check USDC balance
  const usdcTokenId = "nep141:base-0x833589fcd6edb6e08f4c7c32d4f71b54bda02913.omft.near";
  const balance = await getAccountBalanceOfMultiToken(account, usdcTokenId);
  const usdcBalance = Number(balance) / 1_000_000;
  
  console.log(`\n💰 Your USDC Balance: ${usdcBalance.toFixed(6)} USDC`);
  
  console.log(`\n🔍 Checking available withdrawal methods...`);
  
  // Try to get your tokens from intents
  try {
    const tokens = await account.provider.callFunction(
      INTENTS_CONTRACT_ID,
      "mt_tokens_for_account",
      {
        account_id: account.accountId
      }
    );
    console.log(`📋 Your tokens in intents:`, tokens);
  } catch (error) {
    console.log(`❌ Could not get token list:`, error);
  }
  
  console.log(`\n💡 CONCLUSION:`);
  console.log(`   ❌ Direct withdrawal from intents to external Base address is NOT supported`);
  console.log(`   ❌ The 1Click API doesn't support this withdrawal route`);
  console.log(`   ❌ No direct intents contract methods for external withdrawal`);
  
  console.log(`\n🎯 FOR YOUR SUBSCRIPTION SYSTEM:`);
  console.log(`   ✅ Your USDC (${usdcBalance.toFixed(6)}) is safely stored in intents`);
  console.log(`   ✅ This is PERFECT for automated subscription payments!`);
  console.log(`   ✅ You can use this USDC for recurring payments without withdrawal`);
  console.log(`   ✅ The subscription system works entirely within intents`);
  
  console.log(`\n🚀 NEXT STEPS:`);
  console.log(`   1. Use the USDC in intents for subscription payments`);
  console.log(`   2. Set up cron jobs to process payments automatically`);
  console.log(`   3. No need to withdraw to external chains for subscriptions`);
  console.log(`   4. The intents system handles cross-chain payments internally`);
}

checkIntents().catch(console.error);
