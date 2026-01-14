// Fluidkey stealth address generation using ERC5564
import { ERC5564StealthAddressGenerator, type StealthMetaAddress } from '../erc5564/StealthAddressGenerator';
import * as secp from '@noble/secp256k1';
import { keccak256, toHex, toBytes } from 'viem';
import { extractViewingPrivateKeyNode } from '../utils/extractViewingPrivateKeyNode';
import { generateEphemeralPrivateKey } from '../utils/generateEphemeralPrivateKey';

// Fluidkey Parameters as per documentation
const chainId = 5003 // Mantle Sepolia testnet chain ID
const safeVersion = '1.3.0'
const useDefaultAddress = true
const threshold = 1

/**
 * Generate stealth meta-address from a signature
 * This derives spending and viewing keys from the signature
 */
async function generateStealthMetaAddress(signer: any, account: `0x${string}`): Promise<StealthMetaAddress> {
    try {
        console.log("Starting generateStealthMetaAddress...");
        
        // Request signature from user using viem's signMessage format
        const message = "Generate stealth keys for Mnt-Stealth";
        const signature = await signer.signMessage({
            account,
            message
        });
        console.log("Signature generated:", signature);
        
        // Derive private keys from signature using keccak256
        // Use the signature as entropy to generate deterministic keys
        const signatureBytes = toBytes(signature);
        const signatureHash = keccak256(toHex(signatureBytes));
        
        // Generate spending private key from signature hash
        const spendingPrivateKey = signatureHash;
        
        // Generate viewing private key from a different derivation of the signature
        const viewingKeyMessage = toBytes(signature + "viewing");
        const viewingKeyHash = keccak256(toHex(viewingKeyMessage));
        const viewingPrivateKey = viewingKeyHash;
        
        // Generate public keys from private keys
        // secp.getPublicKey expects private key bytes (without 0x prefix for the slice)
        const spendingPrivateKeyBytes = toBytes(spendingPrivateKey);
        const viewingPrivateKeyBytes = toBytes(viewingPrivateKey);
        
        // Get public keys (compressed format)
        const spendingPubKey = secp.getPublicKey(spendingPrivateKeyBytes, true);
        const viewingPubKey = secp.getPublicKey(viewingPrivateKeyBytes, true);
        
        // Convert to hex format with 0x prefix
        return {
            spendingPubKey: `0x${Buffer.from(spendingPubKey).toString('hex')}` as `0x${string}`,
            viewingPubKey: `0x${Buffer.from(viewingPubKey).toString('hex')}` as `0x${string}`
        };
        
    } catch (error) {
        console.error("Error generating stealth meta-address:", error);
        throw error;
    }
}

/**
 * Generate a stealth address for the receiver
 * This is what the receiver shares with the payer
 */
async function createStealthAddress(signer: any, account: `0x${string}`, recipientPublicKeys: `0x${string}`[] = []): Promise<string> {
    try {
        console.log("Starting createStealthAddress...");
        
        // Generate stealth meta-address from signature
        const stealthMetaAddress = await generateStealthMetaAddress(signer, account);
        console.log("Stealth meta-address generated:", stealthMetaAddress);
        
        // Use ERC5564 to generate stealth address from meta-address
        const generator = new ERC5564StealthAddressGenerator();
        const result = generator.generateStealthAddress(stealthMetaAddress);
        
        console.log("Stealth address generated:", result.stealthAddress);
        return result.stealthAddress;
        
    } catch (error) {
        console.error("Error creating stealth address:", error);
        throw error;
    }
}

// Function to predict stealth Safe address
async function predictStealthSafeAddress(stealthAddresses: `0x${string}`[]) {
    try {
        console.log("Starting predictStealthSafeAddress...");
        
        // For demo purposes, create a simple Safe address
        const demoSafeAddress = `0x${stealthAddresses[0].slice(2, 42)}` as `0x${string}`;
        console.log("Demo Safe address created:", demoSafeAddress);
        
        return {
            stealthSafeAddress: demoSafeAddress,
            stealthSafeAddresses: [demoSafeAddress]
        };
        
    } catch (error) {
        console.error("Error predicting Safe address:", error);
        throw error;
    }
}

// Function to claim funds from stealth address
async function claimFromStealthAddress(signer: any, stealthAddress: `0x${string}`) {
    try {
        console.log("Starting claimFromStealthAddress...");
        
        // Generate signature for key generation
        const signature = await signer.signMessage("Claim stealth funds");
        console.log("Claim signature generated:", signature);
        
        // For demo purposes, create a demo stealth address from the signature
        const demoStealthAddress = `0x${signature.slice(2, 42)}` as `0x${string}`;
        
        // Check if the stealth address matches (demo: always true)
        const isMatch = true; // Demo: always claimable
        
        console.log("Demo claim check - always claimable for demo");
        
        return {
            isMatch,
            stealthAddresses: [demoStealthAddress],
            canClaim: isMatch
        };
        
    } catch (error) {
        console.error("Error claiming from stealth address:", error);
        throw error;
    }
}

export { createStealthAddress, predictStealthSafeAddress, claimFromStealthAddress };