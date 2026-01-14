# MNT-Stealth – Private Transactions on Mantle

Experience the next evolution of blockchain privacy on the Mantle Sepolia Testnet with stealth addresses and cutting-edge cryptographic technology.

MNT-Stealth enables private fund reception on-chain, with unlinkable payment addresses, one-time use keys, and cryptographic guarantees — paving the way for true privacy in decentralized finance.

---

## What Are Stealth Addresses?

Stealth addresses are special cryptographic addresses that allow users to receive funds privately.  
They hide the receiver's identity on public block explorers while maintaining compatibility with the blockchain's rules.

### Benefits

- **No direct link** between your public wallet and payments you receive
- **Resistant to address clustering** and analysis  
- **Anonymous fund reception** without sacrificing security

---

## How MNT-Stealth Works

1. **Generate a Stealth Address** — A unique address is derived from your public key, only usable for one transaction
2. **Sender Encrypts Transaction Data** — Using elliptic curve Diffie-Hellman (ECDH), the sender generates a one-time address for you
3. **Funds Sent Privately** — The payment appears on-chain, but your real wallet address remains hidden
4. **Receiver Scans for Payments** — Using a view tag and ephemeral keys, the receiver can detect and claim incoming funds

> **Note**: Currently, stealth addresses provide privacy only for the receiver. Sender addresses still appear on-chain when sending funds. See Future Scope below for planned improvements.

---

## Features

- **Stealth Address Generation** — Instantly create unlinkable addresses
- **One-time Use Addresses** — Maximum unlinkability per transaction
- **View Tags** — Efficient fund scanning for receivers
- **Ephemeral Keys** — Temporary cryptographic keys for every payment
- **SECP256k1 Cryptography** — Proven, secure, and widely adopted standard
- **Mantle Sepolia Testnet Integration** — Full EVM compatibility on chain ID 5003

---

## Network Info

- **Chain**: Mantle Sepolia Testnet
- **Chain ID**: `5003`
- **RPC URL**: `https://mantle-sepolia.drpc.org`
- **Block Explorer**: `https://explorer.sepolia.mantle.xyz`
- **Standard**: ERC-5564 Stealth Addresses
- **Tech Stack**: FluidKey Account Kit + Cryptographic Infrastructure

---

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## Future Scope

We're just getting started — upcoming milestones will push privacy even further:

- **Full Sender & Receiver Privacy**  
  Both sending and receiving addresses will be shielded from public view using advanced cryptographic techniques

- **Private Token Standard on Mantle**  
  Launching a privacy-enabled MNT token that can be transferred without revealing balances or participant addresses

- **Private DEX Trades**  
  Enable swap transactions where trade details and wallet addresses remain confidential

- **Encrypted Metadata Support**  
  Allow private transaction notes and memos viewable only by the intended recipient

- **Cross-Chain Private Transfers**  
  Integrate with privacy-friendly bridges to move assets across chains without compromising anonymity

---

## Built With

- **FluidKey Account Kit** — ERC-5564 stealth address generation
- **Mantle EVM** — Privacy-friendly smart contract execution  
- **SECP256k1 Cryptography** — Secure elliptic curve encryption
- **Next.js** — React framework for production
- **Wagmi & RainbowKit** — Ethereum wallet connection
- **Viem** — TypeScript Ethereum library

---

## License

This project is licensed under the MIT License — free to use, modify, and distribute.

---

> **MNT-Stealth is a stepping stone toward complete transactional privacy on Mantle** — ensuring confidentiality, unlinkability, and censorship resistance in the decentralized era.
