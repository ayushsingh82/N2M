import { 
  TOKEN_MAPPING, 
  COMMON_TOKENS, 
  getTokenByAssetId, 
  getTokenAddress, 
  getTokenChain, 
  getTokenSymbol,
  getTokensByChain,
  getSupportedChains,
  printTokenInfo 
} from './token-mapping';

// Loading environment variables
require("dotenv").config({ path: ".env" });

async function demonstrateTokenMapping(): Promise<void> {
  console.log("🔧 Token Mapping Demonstration\n");

  // 1. Get token info by asset ID
  console.log("1️⃣ Get token info by asset ID:");
  const usdcBaseAssetId = COMMON_TOKENS.USDC_BASE;
  const tokenInfo = getTokenByAssetId(usdcBaseAssetId);
  console.log(`USDC on Base:`, tokenInfo);
  console.log();

  // 2. Get specific token properties
  console.log("2️⃣ Get specific token properties:");
  const nearAssetId = COMMON_TOKENS.NEAR;
  console.log(`NEAR Address: ${getTokenAddress(nearAssetId)}`);
  console.log(`NEAR Chain: ${getTokenChain(nearAssetId)}`);
  console.log(`NEAR Symbol: ${getTokenSymbol(nearAssetId)}`);
  console.log();

  // 3. Get all tokens for a specific chain
  console.log("3️⃣ Get all tokens for Ethereum chain:");
  const ethTokens = getTokensByChain("eth");
  ethTokens.forEach(({ assetId, token }) => {
    console.log(`  ${token.symbol} - ${assetId}`);
  });
  console.log();

  // 4. Get all supported chains
  console.log("4️⃣ All supported chains:");
  const chains = getSupportedChains();
  chains.forEach(chain => {
    console.log(`  - ${chain}`);
  });
  console.log();

  // 5. Common tokens quick access
  console.log("5️⃣ Common tokens quick access:");
  console.log(`NEAR: ${COMMON_TOKENS.NEAR}`);
  console.log(`USDC on Base: ${COMMON_TOKENS.USDC_BASE}`);
  console.log(`USDC on Ethereum: ${COMMON_TOKENS.USDC_ETH}`);
  console.log(`ETH: ${COMMON_TOKENS.ETH}`);
  console.log(`BTC: ${COMMON_TOKENS.BTC}`);
  console.log();

  // 6. Print detailed token info
  console.log("6️⃣ Detailed token info:");
  printTokenInfo(COMMON_TOKENS.USDC_BASE);
  console.log();
  printTokenInfo(COMMON_TOKENS.ETH);
  console.log();

  // 7. Example usage in quotes
  console.log("7️⃣ Example usage in quotes:");
  const originAsset = COMMON_TOKENS.NEAR;
  const destinationAsset = COMMON_TOKENS.USDC_BASE;
  
  console.log(`Origin: ${getTokenSymbol(originAsset)} on ${getTokenChain(originAsset)}`);
  console.log(`Destination: ${getTokenSymbol(destinationAsset)} on ${getTokenChain(destinationAsset)}`);
  console.log(`Origin Address: ${getTokenAddress(originAsset)}`);
  console.log(`Destination Address: ${getTokenAddress(destinationAsset)}`);
}

// Example function to build quote request using token mapping
function buildQuoteRequest(originAssetId: string, destinationAssetId: string, amount: string) {
  const originToken = getTokenByAssetId(originAssetId);
  const destinationToken = getTokenByAssetId(destinationAssetId);

  if (!originToken || !destinationToken) {
    throw new Error("Invalid asset IDs");
  }

  return {
    originAsset: originAssetId,
    destinationAsset: destinationAssetId,
    amount: amount,
    originTokenInfo: originToken,
    destinationTokenInfo: destinationToken,
  };
}

// Example usage in your existing scripts
function exampleUsageInScripts(): void {
  console.log("📝 Example usage in your scripts:");
  
  // Example 1: NEAR to USDC on Base
  const quote1 = buildQuoteRequest(
    COMMON_TOKENS.NEAR,
    COMMON_TOKENS.USDC_BASE,
    "1000000000000000000000000" // 1 NEAR in yoctoNEAR
  );
  console.log("NEAR → USDC on Base:", quote1);
  console.log();

  // Example 2: USDC on Ethereum to USDT on Arbitrum
  const quote2 = buildQuoteRequest(
    COMMON_TOKENS.USDC_ETH,
    COMMON_TOKENS.USDT_ARB,
    "1000000" // 1 USDC (6 decimals)
  );
  console.log("USDC on ETH → USDT on ARB:", quote2);
  console.log();

  // Example 3: ETH to BTC
  const quote3 = buildQuoteRequest(
    COMMON_TOKENS.ETH,
    COMMON_TOKENS.BTC,
    "1000000000000000000" // 1 ETH in wei
  );
  console.log("ETH → BTC:", quote3);
}

// Main execution
async function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'demo':
      await demonstrateTokenMapping();
      break;
    case 'examples':
      exampleUsageInScripts();
      break;
    default:
      console.log(`
🔧 Token Mapping Usage Examples

Usage:
  npm run token:demo        - Run complete demonstration
  npm run token:examples    - Show usage examples in scripts

Individual Commands:
  npm run token:info <assetId>     - Get token info
  npm run token:chains             - List all chains
  npm run token:chain <chain>      - List tokens by chain
  npm run token:symbol <symbol>    - List tokens by symbol

Common Token Asset IDs:
  NEAR: ${COMMON_TOKENS.NEAR}
  USDC_BASE: ${COMMON_TOKENS.USDC_BASE}
  USDC_ETH: ${COMMON_TOKENS.USDC_ETH}
  ETH: ${COMMON_TOKENS.ETH}
  BTC: ${COMMON_TOKENS.BTC}
      `);
  }
}

// Export for use in other files
export { buildQuoteRequest, demonstrateTokenMapping, exampleUsageInScripts };

// Run if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}
