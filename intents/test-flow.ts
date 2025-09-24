import { NEAR } from "@near-js/tokens";
import { getAccount, getAccountBalanceOfNear } from "./near";

// Loading environment variables
require("dotenv").config({ path: ".env" });

async function testFlow(): Promise<void> {
  console.log("🧪 Testing flow setup...\n");

  try {
    const account = getAccount();
    const amount = NEAR.toUnits("0.1");

    console.log("📊 Checking account setup...");
    console.log(`Account ID: ${account.accountId}`);
    
    console.log("\n💰 Checking NEAR balance...");
    const balance = await getAccountBalanceOfNear(account);
    console.log(`Current NEAR balance: ${NEAR.toDecimal(balance)} NEAR`);
    
    if (balance >= amount) {
      console.log("✅ Sufficient balance for 0.1 NEAR transaction");
    } else {
      console.log("❌ Insufficient balance. Need at least 0.1 NEAR");
      console.log(`Required: ${NEAR.toDecimal(amount)} NEAR`);
      console.log(`Available: ${NEAR.toDecimal(balance)} NEAR`);
    }

    console.log("\n🔧 Environment check:");
    console.log(`ACCOUNT_ID: ${process.env.ACCOUNT_ID ? '✅ Set' : '❌ Missing'}`);
    console.log(`ACCOUNT_PRIVATE_KEY: ${process.env.ACCOUNT_PRIVATE_KEY ? '✅ Set' : '❌ Missing'}`);

    console.log("\n📋 Flow Summary:");
    console.log("1. Deposit 0.1 NEAR → Multi-token in intents");
    console.log("2. Swap NEAR → USDC on Base (via intents)");
    console.log("3. Withdraw USDC → Base chain");
    console.log("\n🎯 Ready to run: npm run flow:complete");

  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testFlow();
