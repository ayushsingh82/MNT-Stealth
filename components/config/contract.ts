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

// Mantle testnet configuration
export const mantleConfig = {
  chainId: 5003,
  name: "Mantle Testnet",
  network: "mantle-testnet",
  nativeCurrency: {
    decimals: 18,
    name: "MNT",
    symbol: "MNT",
  },
  rpcUrls: {
    public: { http: ["https://rpc.sepolia.mantle.xyz"] },
    default: { http: ["https://rpc.sepolia.mantle.xyz"] },
  },
  blockExplorers: {
    default: { 
      name: "Mantle Explorer", 
      url: "https://explorer.testnet.mantle.xyz" 
    },
  },
  testnet: true,
} as const; 