// Token mapping file for Defuse asset IDs and addresses
// Based on the Defuse token list provided

export interface TokenInfo {
  defuseAssetId: string;
  address: string;
  decimals: number;
  icon: string;
  chainName: string;
  bridge: string;
  symbol: string;
  name: string;
  type?: "native";
  unifiedAssetId?: string;
  groupedTokens?: TokenInfo[];
  tags?: string[];
}

export interface TokenMapping {
  [defuseAssetId: string]: {
    address: string;
    chainName: string;
    symbol: string;
    decimals: number;
    name: string;
  };
}

// Native NEAR token
export const NATIVE_NEAR: TokenInfo = {
  defuseAssetId: "nep141:wrap.near",
  address: "wrap.near",
  decimals: 24,
  icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/6535.png",
  chainName: "near",
  bridge: "direct",
  symbol: "NEAR",
  name: "Near",
};

// Main token mapping object
export const TOKEN_MAPPING: TokenMapping = {
  // NEAR tokens
  "nep141:wrap.near": {
    address: "wrap.near",
    chainName: "near",
    symbol: "NEAR",
    decimals: 24,
    name: "Near",
  },
  "nep141:near.omft.near": {
    address: "wrap.near",
    chainName: "near",
    symbol: "NEAR",
    decimals: 24,
    name: "Near",
  },

  // USDC tokens
  "nep141:eth-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.omft.near": {
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    chainName: "eth",
    symbol: "USDC",
    decimals: 6,
    name: "USD Coin",
  },
  "nep141:17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1": {
    address: "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
    chainName: "near",
    symbol: "USDC",
    decimals: 6,
    name: "USD Coin",
  },
  "nep141:base-0x833589fcd6edb6e08f4c7c32d4f71b54bda02913.omft.near": {
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    chainName: "base",
    symbol: "USDC",
    decimals: 6,
    name: "USD Coin",
  },
  "nep141:arb-0xaf88d065e77c8cc2239327c5edb3a432268e5831.omft.near": {
    address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    chainName: "arbitrum",
    symbol: "USDC",
    decimals: 6,
    name: "USD Coin",
  },
  "nep141:sol-5ce3bf3a31af18be40ba30f721101b4341690186.omft.near": {
    address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    chainName: "solana",
    symbol: "USDC",
    decimals: 6,
    name: "USD Coin",
  },
  "nep141:gnosis-0x2a22f9c3b484c3629090feed35f17ff8f88f76f0.omft.near": {
    address: "0x2a22f9c3b484c3629090feed35f17ff8f88f76f0",
    chainName: "gnosis",
    symbol: "USDC",
    decimals: 6,
    name: "USD Coin",
  },

  // USDT tokens
  "nep141:eth-0xdac17f958d2ee523a2206206994597c13d831ec7.omft.near": {
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    chainName: "eth",
    symbol: "USDT",
    decimals: 6,
    name: "Tether USD",
  },
  "nep141:usdt.tether-token.near": {
    address: "usdt.tether-token.near",
    chainName: "near",
    symbol: "USDT",
    decimals: 6,
    name: "Tether USD",
  },
  "nep141:arb-0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9.omft.near": {
    address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    chainName: "arbitrum",
    symbol: "USDT",
    decimals: 6,
    name: "Tether USD",
  },
  "nep141:sol-c800a4bd850783ccb82c2b2c7e84175443606352.omft.near": {
    address: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    chainName: "solana",
    symbol: "USDT",
    decimals: 6,
    name: "Tether USD",
  },
  "nep141:tron-d28a265909efecdcee7c5028585214ea0b96f015.omft.near": {
    address: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
    chainName: "tron",
    symbol: "USDT",
    decimals: 6,
    name: "Tether USD",
  },

  // ETH tokens
  "nep141:eth.omft.near": {
    address: "native",
    chainName: "eth",
    symbol: "ETH",
    decimals: 18,
    name: "ETH",
  },
  "nep141:eth.bridge.near": {
    address: "eth.bridge.near",
    chainName: "near",
    symbol: "ETH",
    decimals: 18,
    name: "ETH",
  },
  "nep141:aurora": {
    address: "aurora",
    chainName: "near",
    symbol: "ETH",
    decimals: 18,
    name: "ETH",
  },
  "nep141:base.omft.near": {
    address: "native",
    chainName: "base",
    symbol: "ETH",
    decimals: 18,
    name: "ETH",
  },
  "nep141:arb.omft.near": {
    address: "native",
    chainName: "arbitrum",
    symbol: "ETH",
    decimals: 18,
    name: "ETH",
  },

  // DAI tokens
  "nep141:eth-0x6b175474e89094c44da98b954eedeac495271d0f.omft.near": {
    address: "0x6b175474e89094c44da98b954eedeac495271d0f",
    chainName: "eth",
    symbol: "DAI",
    decimals: 18,
    name: "DAI",
  },
  "nep141:gnosis.omft.near": {
    address: "native",
    chainName: "gnosis",
    symbol: "xDAI",
    decimals: 18,
    name: "xDAI",
  },

  // BTC tokens
  "nep141:btc.omft.near": {
    address: "native",
    chainName: "bitcoin",
    symbol: "BTC",
    decimals: 8,
    name: "Bitcoin",
  },
  "nep141:nbtc.bridge.near": {
    address: "nbtc.bridge.near",
    chainName: "near",
    symbol: "nBTC",
    decimals: 8,
    name: "Bitcoin",
  },

  // Aurora tokens
  "nep141:aaaaaa20d9e0e2461697782ef11675f668207961.factory.bridge.near": {
    address: "aaaaaa20d9e0e2461697782ef11675f668207961.factory.bridge.near",
    chainName: "near",
    symbol: "AURORA",
    decimals: 18,
    name: "Aurora",
  },
  "nep141:eth-0xaaaaaa20d9e0e2461697782ef11675f668207961.omft.near": {
    address: "0xAaAAAA20D9E0e2461697782ef11675f668207961",
    chainName: "eth",
    symbol: "AURORA",
    decimals: 18,
    name: "Aurora",
  },

  // ZEC tokens
  "nep141:zec.omft.near": {
    address: "native",
    chainName: "zcash",
    symbol: "ZEC",
    decimals: 8,
    name: "Zcash",
  },

  // BERA tokens
  "nep141:bera.omft.near": {
    address: "native",
    chainName: "berachain",
    symbol: "BERA",
    decimals: 18,
    name: "BERA",
  },

  // Meme tokens
  "nep141:sol-c58e6539c2f2e097c251f8edf11f9c03e581f8d4.omft.near": {
    address: "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN",
    chainName: "solana",
    symbol: "TRUMP",
    decimals: 6,
    name: "OFFICIAL TRUMP",
  },
  "nep141:sol-d600e625449a4d9380eaf5e3265e54c90d34e260.omft.near": {
    address: "FUAfBo2jgks6gB4Z4LfZkqSZgzNucisEHqnNebaRxM1P",
    chainName: "solana",
    symbol: "MELANIA",
    decimals: 6,
    name: "Official Melania Meme",
  },
  "nep141:eth-0x6982508145454ce325ddbe47a25d4ec3d2311933.omft.near": {
    address: "0x6982508145454Ce325dDbE47a25d4ec3d2311933",
    chainName: "eth",
    symbol: "PEPE",
    decimals: 18,
    name: "Pepe",
  },
  "nep141:eth-0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce.omft.near": {
    address: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE",
    chainName: "eth",
    symbol: "SHIB",
    decimals: 18,
    name: "Shiba Inu",
  },

  // Other tokens
  "nep141:eth-0x514910771af9ca656af840dff83e8264ecf986ca.omft.near": {
    address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    chainName: "eth",
    symbol: "LINK",
    decimals: 18,
    name: "Chainlink",
  },
};

// Helper functions
export function getTokenByAssetId(assetId: string): TokenMapping[string] | undefined {
  return TOKEN_MAPPING[assetId];
}

export function getTokenAddress(assetId: string): string | undefined {
  return TOKEN_MAPPING[assetId]?.address;
}

export function getTokenChain(assetId: string): string | undefined {
  return TOKEN_MAPPING[assetId]?.chainName;
}

export function getTokenSymbol(assetId: string): string | undefined {
  return TOKEN_MAPPING[assetId]?.symbol;
}

export function getTokenDecimals(assetId: string): number | undefined {
  return TOKEN_MAPPING[assetId]?.decimals;
}

export function getTokenName(assetId: string): string | undefined {
  return TOKEN_MAPPING[assetId]?.name;
}

// Get all tokens for a specific chain
export function getTokensByChain(chainName: string): Array<{ assetId: string; token: TokenMapping[string] }> {
  return Object.entries(TOKEN_MAPPING)
    .filter(([_, token]) => token.chainName === chainName)
    .map(([assetId, token]) => ({ assetId, token }));
}

// Get all supported chains
export function getSupportedChains(): string[] {
  const chains = new Set<string>();
  Object.values(TOKEN_MAPPING).forEach(token => chains.add(token.chainName));
  return Array.from(chains).sort();
}

// Get all tokens for a specific symbol
export function getTokensBySymbol(symbol: string): Array<{ assetId: string; token: TokenMapping[string] }> {
  return Object.entries(TOKEN_MAPPING)
    .filter(([_, token]) => token.symbol === symbol)
    .map(([assetId, token]) => ({ assetId, token }));
}

// Common token asset IDs for easy access
export const COMMON_TOKENS = {
  NEAR: "nep141:wrap.near",
  USDC_ETH: "nep141:eth-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.omft.near",
  USDC_BASE: "nep141:base-0x833589fcd6edb6e08f4c7c32d4f71b54bda02913.omft.near",
  USDC_ARB: "nep141:arb-0xaf88d065e77c8cc2239327c5edb3a432268e5831.omft.near",
  USDC_SOL: "nep141:sol-5ce3bf3a31af18be40ba30f721101b4341690186.omft.near",
  USDT_ETH: "nep141:eth-0xdac17f958d2ee523a2206206994597c13d831ec7.omft.near",
  USDT_ARB: "nep141:arb-0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9.omft.near",
  USDT_SOL: "nep141:sol-c800a4bd850783ccb82c2b2c7e84175443606352.omft.near",
  ETH: "nep141:eth.omft.near",
  ETH_BASE: "nep141:base.omft.near",
  ETH_ARB: "nep141:arb.omft.near",
  DAI: "nep141:eth-0x6b175474e89094c44da98b954eedeac495271d0f.omft.near",
  BTC: "nep141:btc.omft.near",
  AURORA: "nep141:aaaaaa20d9e0e2461697782ef11675f668207961.factory.bridge.near",
  ZEC: "nep141:zec.omft.near",
  BERA: "nep141:bera.omft.near",
  PEPE: "nep141:eth-0x6982508145454ce325ddbe47a25d4ec3d2311933.omft.near",
  SHIB: "nep141:eth-0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce.omft.near",
  LINK: "nep141:eth-0x514910771af9ca656af840dff83e8264ecf986ca.omft.near",
};

// Example usage functions
export function printTokenInfo(assetId: string): void {
  const token = getTokenByAssetId(assetId);
  if (token) {
    console.log(`Token Info for ${assetId}:`);
    console.log(`  Symbol: ${token.symbol}`);
    console.log(`  Name: ${token.name}`);
    console.log(`  Address: ${token.address}`);
    console.log(`  Chain: ${token.chainName}`);
    console.log(`  Decimals: ${token.decimals}`);
  } else {
    console.log(`Token not found for asset ID: ${assetId}`);
  }
}

export function printAllChains(): void {
  console.log("Supported Chains:");
  getSupportedChains().forEach(chain => {
    console.log(`  - ${chain}`);
  });
}

export function printTokensByChain(chainName: string): void {
  const tokens = getTokensByChain(chainName);
  console.log(`Tokens on ${chainName}:`);
  tokens.forEach(({ assetId, token }) => {
    console.log(`  ${token.symbol} (${token.name}) - ${assetId}`);
  });
}

// CLI interface for testing
if (require.main === module) {
  const command = process.argv[2];
  const arg = process.argv[3];

  switch (command) {
    case 'info':
      if (arg) printTokenInfo(arg);
      else console.log('Usage: npm run token:info <assetId>');
      break;
    case 'chains':
      printAllChains();
      break;
    case 'chain':
      if (arg) printTokensByChain(arg);
      else console.log('Usage: npm run token:chain <chainName>');
      break;
    case 'symbol':
      if (arg) {
        const tokens = getTokensBySymbol(arg);
        console.log(`Tokens with symbol ${arg}:`);
        tokens.forEach(({ assetId, token }) => {
          console.log(`  ${assetId} - ${token.chainName} - ${token.address}`);
        });
      } else {
        console.log('Usage: npm run token:symbol <symbol>');
      }
      break;
    default:
      console.log(`
🔧 Token Mapping CLI

Usage:
  npm run token:info <assetId>     - Get token info by asset ID
  npm run token:chains             - List all supported chains
  npm run token:chain <chain>      - List tokens by chain
  npm run token:symbol <symbol>    - List tokens by symbol

Examples:
  npm run token:info nep141:wrap.near
  npm run token:chain eth
  npm run token:symbol USDC
      `);
  }
}
