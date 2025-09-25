import { getAccount, getAccountBalanceOfMultiToken } from "./near";
import { INTENTS_CONTRACT_ID } from "./constants";

// Loading environment variables
require("dotenv").config({ path: ".env" });

async function checkAllBalances(): Promise<void> {
  const account = getAccount();
  
  console.log(`🔍 Checking balances for account: ${account.accountId}`);
  console.log(`📋 Intents contract: ${INTENTS_CONTRACT_ID}\n`);
  
  // Common token IDs to check
  const tokenIds = [
    "nep141:near.omft.near",
    "nep141:wrap.near", 
    "nep141:near",
    "wrap.near",
    "near.omft.near"
  ];
  
  for (const tokenId of tokenIds) {
    try {
      const balance = await getAccountBalanceOfMultiToken(account, tokenId);
      console.log(`💰 ${tokenId}: ${balance.toString()}`);
    } catch (error) {
      console.log(`❌ ${tokenId}: Error - ${error}`);
    }
  }
  
  // Also try to get all tokens from intents contract
  try {
    console.log("\n🔍 Trying to get all tokens...");
    const allTokens = await account.provider.callFunction(
      INTENTS_CONTRACT_ID,
      "mt_tokens_for_account",
      {
        account_id: account.accountId,
      }
    );
    console.log("📋 All tokens:", allTokens);
  } catch (error) {
    console.log("❌ Could not get all tokens:", error);
  }
}

checkAllBalances().catch(console.error);
