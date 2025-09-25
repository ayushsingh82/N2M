import { getAccount, getAccountBalanceOfMultiToken } from "./near";

// Loading environment variables
require("dotenv").config({ path: ".env" });

async function checkUSDCBalance(): Promise<void> {
  const account = getAccount();
  
  console.log(`🔍 Checking USDC balance for account: ${account.accountId}\n`);
  
  // Check USDC on Base balance
  const usdcTokenId = "nep141:base-0x833589fcd6edb6e08f4c7c32d4f71b54bda02913.omft.near";
  
  try {
    const balance = await getAccountBalanceOfMultiToken(account, usdcTokenId);
    console.log(`💰 USDC Balance: ${balance.toString()}`);
    console.log(`💰 USDC Balance (decimal): ${(Number(balance) / 1_000_000).toFixed(6)} USDC`);
    console.log(`💰 Token ID: ${usdcTokenId}`);
    
    // Check if we have enough for 0.1 USDC withdrawal
    const requiredAmount = BigInt(100_000); // 0.1 USDC
    console.log(`\n📊 Withdrawal Check:`);
    console.log(`   Required: ${requiredAmount.toString()} (0.1 USDC)`);
    console.log(`   Available: ${balance.toString()} (${(Number(balance) / 1_000_000).toFixed(6)} USDC)`);
    console.log(`   Can withdraw: ${balance >= requiredAmount ? '✅ YES' : '❌ NO'}`);
    
  } catch (error) {
    console.error("❌ Error checking balance:", error);
  }
}

checkUSDCBalance().catch(console.error);
