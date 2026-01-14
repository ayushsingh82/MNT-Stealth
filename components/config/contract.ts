// Import ABIs from the main ABI file
import { TokenTransferAbi, ERC20Abi } from '../abi';

// Contract configuration for TokenTransfer
export const contractConfig = {
  address: "0xf12F7584143D17169905D7954D3DEab8942a310d", // Replace with deployed contract address
  abi: TokenTransferAbi,
} as const;

// ERC20 Token configuration
export const erc20Config = {
  abi: ERC20Abi,
} as const;

// Mantle Sepolia testnet configuration
export const mantleConfig = {
  chainId: 5003,
  name: "Mantle Sepolia Testnet",
  network: "mantle-sepolia-testnet",
  nativeCurrency: {
    decimals: 18,
    name: "MNT",
    symbol: "MNT",
  },
  rpcUrls: {
    public: { http: ["https://mantle-sepolia.drpc.org"] },
    default: { http: ["https://mantle-sepolia.drpc.org"] },
  },
  blockExplorers: {
    default: { 
      name: "Mantle Sepolia Explorer", 
      url: "https://explorer.sepolia.mantle.xyz" 
    },
  },
  testnet: true,
} as const; 