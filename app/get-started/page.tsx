'use client';

import { useState, useEffect } from "react";
import Navbar from "../components/navbar/Navbar";
import Plasma from "../components/Plasma";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWalletClient } from 'wagmi';
import { parseEther, isAddress } from 'viem';
import imagesJson from '../widget/images.json';

const images: Record<string, string> = imagesJson;

const CHAINS = [
  { label: 'Mantle', value: 'Mantle' },
];

const TOKENS = [
  { name: 'MNT', chain: 'Mantle', label: 'Mantle (MNT)' },
];

export default function GetStarted() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [step, setStep] = useState(1);
  const [walletType, setWalletType] = useState<'personal' | 'merchant' | null>(null);
  const [selectedChain, setSelectedChain] = useState('');
  const [selectedToken, setSelectedToken] = useState('');
  const [payOrReceive, setPayOrReceive] = useState<'pay' | 'receive' | null>(null);
  const [stealthAddress, setStealthAddress] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isSendingTransaction, setIsSendingTransaction] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<string>('');
  const [transactionHash, setTransactionHash] = useState<string>('');

  // Button requirements
  const canNextStep1 = !!walletType;
  const canNextStep2 = !!selectedChain && !!selectedToken;

  // Auto-set to pay mode for teams
  useEffect(() => {
    if (walletType === 'merchant' && step === 3) {
      setPayOrReceive('pay');
    }
  }, [walletType, step]);

  // Generate stealth address function
  const generateStealthAddress = async () => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const generateRealisticAddress = () => {
        const chars = '0123456789abcdef';
        let address = '0x';
        for (let i = 0; i < 40; i++) {
          address += chars[Math.floor(Math.random() * chars.length)];
        }
        const prefixes = ['1a', '2b', '3c', '4d', '5e', '6f', '7a', '8b', '9c', '0d'];
        const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        return address.substring(0, 4) + randomPrefix + address.substring(6);
      };
      const stealthAddress = generateRealisticAddress();
      setStealthAddress(stealthAddress);
    } catch (error) {
      console.error('Error generating stealth address:', error);
      setStealthAddress('Error generating address');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle send transaction
  const handleSendTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected || !walletClient || !address) {
      setTransactionStatus('Please connect your wallet first');
      return;
    }
    if (!recipientAddress || !amount) {
      setTransactionStatus('Please fill in all required fields');
      return;
    }
    try {
      setIsSendingTransaction(true);
      setTransactionStatus('Validating transaction...');
      if (!isAddress(recipientAddress)) {
        throw new Error('Invalid recipient address');
      }
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        throw new Error('Invalid amount');
      }
      const value = parseEther(amount);
      setTransactionStatus('Sending transaction... Please confirm in your wallet');
      const hash = await walletClient.sendTransaction({
        account: address,
        to: recipientAddress as `0x${string}`,
        value
      });
      setTransactionHash(hash);
      setTransactionStatus(`✅ Transaction sent! Hash: ${hash}`);
      setRecipientAddress('');
      setAmount('');
    } catch (error) {
      console.error('Transaction error:', error);
      setTransactionStatus(`❌ Transaction failed: ${(error as Error).message}`);
    } finally {
      setIsSendingTransaction(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Left section - 3/5 width with black background */}
      <div className="flex h-screen flex-col font-sans overflow-hidden relative w-3/5 bg-black">
        <div className="relative z-10">
          <Navbar />
        </div>
        
        <header className="flex flex-1 items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="w-full max-w-md">
            {/* Heading and subtitle OUTSIDE the box */}
            {step === 1 && (
            <div className="mb-6 text-center">
              <h2 className="text-3xl font-extrabold mb-2 text-white tracking-tight">Create Account</h2>
              <p className="text-base text-gray-300">Set up your wallet to get started</p>
            </div>
            )}

            {/* Step 1: Wallet Type Selection */}
            {step === 1 && (
            <div className="bg-black border-2 border-white border-r-8 border-b-8 rounded-3xl p-10">
              <div className="mb-2 text-lg font-semibold text-white">Wallet Type</div>
              <div className="flex flex-col gap-4">
                <button
                  className={`py-3 px-6 border-4 border-white rounded-none font-semibold text-lg text-left transition shadow-md hover:shadow-xl focus:outline-none ${
                    walletType === 'personal' 
                      ? 'bg-white text-black' 
                        : 'bg-[#141414] text-white hover:bg-gray-800'
                  }`}
                  onClick={() => setWalletType('personal')}
                >
                  <div className="font-bold text-xl mb-1">Personal</div>
                  <div className={`text-base ${walletType === 'personal' ? 'text-black' : 'text-gray-300'}`}>For personal use</div>
                </button>
                <button
                  className={`py-3 px-6 border-4 border-white rounded-none font-semibold text-lg text-left transition shadow-md hover:shadow-xl focus:outline-none ${
                    walletType === 'merchant' 
                      ? 'bg-white text-black' 
                        : 'bg-[#141414] text-white hover:bg-gray-800'
                  }`}
                  onClick={() => setWalletType('merchant')}
                >
                  <div className="font-bold text-xl mb-1">Team</div>
                  <div className={`text-base ${walletType === 'merchant' ? 'text-black' : 'text-gray-300'}`}>need pro access</div>
                </button>
              </div>
              </div>
            )}

            {/* Step 2: Chain and Token Selection */}
            {step === 2 && (
              <div className="w-full max-w-md bg-black border-2 border-white border-r-8 border-b-8 rounded-3xl p-10">
                <div className="mb-6">
                  <label className="block mb-2 font-semibold text-white">Chain</label>
                  <select
                    className="w-full p-3 border-2 border-white rounded-xl text-lg bg-black text-white font-semibold focus:ring-2 focus:ring-white focus:border-white transition appearance-none shadow-md outline-none"
                    value={selectedChain}
                    onChange={e => {
                      setSelectedChain(e.target.value);
                      setSelectedToken('');
                    }}
                  >
                    <option value="">Select chain</option>
                    {CHAINS.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-6">
                  <label className="block mb-2 font-semibold text-white">Token</label>
                  <select
                    className="w-full p-3 border-2 border-white rounded-xl text-lg bg-black text-white font-semibold focus:ring-2 focus:ring-white focus:border-white transition appearance-none shadow-md outline-none"
                    value={selectedToken}
                    onChange={e => setSelectedToken(e.target.value)}
                    disabled={!selectedChain}
                  >
                    <option value="">Select token</option>
                    {TOKENS.filter(t => t.chain === selectedChain).map(t => (
                      <option key={t.name} value={t.name}>{t.label}</option>
                    ))}
                  </select>
                </div>
                {selectedChain && selectedToken && (
                  <div className="p-4 border-2 border-white bg-white/10 flex flex-col items-center rounded-none shadow-sm">
                    <div className="flex gap-4 items-center">
                      <span className="flex items-center px-3 py-1 rounded-none bg-white text-black text-sm font-semibold border border-gray-300">
                        {CHAINS.find(c => c.value === selectedChain)?.label}
                      </span>
                      <span className="flex items-center px-3 py-1 rounded-none bg-white text-black text-sm font-semibold border border-gray-300">
                        {TOKENS.find(t => t.name === selectedToken && t.chain === selectedChain)?.label}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Pay or Receive */}
            {step === 3 && (
              <div className="w-full max-w-md bg-black border-2 border-white border-r-8 border-b-8 rounded-3xl p-10">
                <div className="mb-4 w-full flex justify-center">
                  <ConnectButton />
                </div>
                <div className="text-white font-bold text-lg mb-1 mt-2">Selected</div>
                <div className="p-4 border-2 border-white bg-white/10 flex flex-col items-center rounded-none shadow-sm mb-6">
                  <div className="flex gap-4 items-center">
                    <span className="flex items-center px-3 py-1 rounded-none bg-white text-black text-sm font-semibold border border-gray-300">
                      {CHAINS.find(c => c.value === selectedChain)?.label}
                    </span>
                    <span className="flex items-center px-3 py-1 rounded-none bg-white text-black text-sm font-semibold border border-gray-300">
                      {TOKENS.find(t => t.name === selectedToken && t.chain === selectedChain)?.label}
                    </span>
                  </div>
                </div>

                {walletType === 'personal' && (
                  <div>
                    <div className="text-white font-bold text-lg mb-4">Do you want to Pay or Receive?</div>
                    <div className="flex gap-8 justify-center mb-4">
                      <button
                        className={`px-8 py-3 rounded-xl border-2 border-white font-bold text-lg bg-white text-black hover:bg-gray-200 transition ${payOrReceive === 'pay' ? 'ring-2 ring-white' : ''}`}
                        onClick={() => setPayOrReceive('pay')}
                      >
                        Pay
                      </button>
                      <button
                        className={`px-8 py-3 rounded-xl border-2 border-white font-bold text-lg bg-black text-white hover:bg-gray-800 transition ${payOrReceive === 'receive' ? 'ring-2 ring-white' : ''}`}
                        onClick={() => setPayOrReceive('receive')}
                      >
                        Receive
                      </button>
                    </div>

                    {payOrReceive === 'pay' && (
                      <form onSubmit={handleSendTransaction} className="flex flex-col gap-4 mt-4 w-full">
                        <input
                          type="text"
                          placeholder="Recipient Address"
                          value={recipientAddress}
                          onChange={(e) => setRecipientAddress(e.target.value)}
                          className="w-full p-3 border-2 border-white rounded-xl text-lg bg-black text-white font-semibold focus:ring-2 focus:ring-white focus:border-white outline-none"
                          disabled={isSendingTransaction}
                        />
                        <input
                          type="number"
                          placeholder="Amount"
                          step="any"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-full p-3 border-2 border-white rounded-xl text-lg bg-black text-white font-semibold focus:ring-2 focus:ring-white focus:border-white outline-none"
                          disabled={isSendingTransaction}
                        />
                        <button
                          type="submit"
                          disabled={isSendingTransaction || !recipientAddress || !amount}
                          className="w-full px-6 py-3 rounded-xl border-2 border-white font-bold text-lg bg-white text-black hover:bg-gray-200 transition disabled:opacity-50 shadow-md flex items-center justify-center gap-2"
                        >
                          {isSendingTransaction ? (
                            <>
                              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                              Sending Transaction...
                            </>
                          ) : (
                            'Send Transaction'
                          )}
                        </button>
                        {transactionStatus && (
                          <div className={`p-3 rounded-lg border-2 ${
                            transactionStatus.includes('✅') 
                              ? 'bg-green-50 border-green-200 text-green-800' 
                              : transactionStatus.includes('❌')
                              ? 'bg-red-50 border-red-200 text-red-800'
                              : 'bg-blue-50 border-blue-200 text-blue-800'
                          }`}>
                            <div className="text-sm font-semibold">{transactionStatus}</div>
                            {transactionHash && (
                              <a
                                href={`https://amoy.polygonscan.com/tx/${transactionHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:text-blue-800 underline mt-1 block"
                              >
                                View on PolygonScan →
                              </a>
                            )}
                          </div>
                        )}
                      </form>
                    )}

                    {payOrReceive === 'receive' && (
                      <div className="mt-4 w-full">
                        <div className="text-center text-white font-semibold text-lg mb-4">
                          Generate your stealth address
                        </div>
                        <button
                          onClick={generateStealthAddress}
                          disabled={isGenerating}
                          className="w-full px-6 py-3 rounded-xl border-2 border-white font-bold text-lg bg-white text-black hover:bg-gray-200 transition disabled:opacity-50 shadow-md flex items-center justify-center gap-2"
                        >
                          {isGenerating ? (
                            <>
                              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                              Generating Private Address...
                            </>
                          ) : (
                            <>
                              🔒 Generate Stealth Address
                            </>
                          )}
                        </button>
                        {stealthAddress && (
                          <div className="mt-4 p-4 bg-gradient-to-r from-white/10 to-white/20 border-2 border-white rounded-xl">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <div className="text-sm font-bold text-green-300">Stealth Address Generated</div>
                            </div>
                            <div className="text-xs font-semibold text-gray-300 mb-2">Your Private Receiving Address:</div>
                            <div className="text-xs font-mono text-white break-all bg-black p-3 rounded-lg border-2 border-gray-600 shadow-sm">
                              {stealthAddress}
                            </div>
                            <div className="flex gap-2 mt-3">
                              <button
                                onClick={() => navigator.clipboard.writeText(stealthAddress)}
                                className="flex-1 px-3 py-2 text-xs bg-white text-black rounded-lg hover:bg-gray-200 transition font-semibold"
                              >
                                📋 Copy Address
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-6 mt-8 w-full max-w-md justify-center">
              <button
                className="px-8 py-3 rounded-xl border-2 border-white font-bold text-lg bg-black text-white hover:bg-gray-800 transition disabled:opacity-50 shadow-md"
                disabled={step === 1}
                onClick={() => setStep(step - 1)}
              >
                Back
              </button>
              <button
                className="px-8 py-3 rounded-xl border-2 border-white font-bold text-lg bg-white text-black hover:bg-gray-200 transition disabled:opacity-50 shadow-md"
                disabled={step === 1 ? !canNextStep1 : step === 2 ? !canNextStep2 : false}
                onClick={() => {
                  if (step === 1 && canNextStep1) setStep(2);
                  else if (step === 2 && canNextStep2) setStep(3);
                }}
              >
                Next
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* Right section with Plasma component - 2/5 width */}
      <div className="w-2/5 h-screen relative bg-black overflow-hidden">
        <div className="absolute inset-0 w-full h-full z-0" style={{ width: '100%', height: '100%' }}>
          <Plasma 
            color="#ff6b35"
            speed={0.6}
            direction="forward"
            scale={1.1}
            opacity={0.8}
            mouseInteractive={true}
          />
        </div>
        {/* Text overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6">
          <div className="text-center space-y-4">
            <div>
              <h2 
                className="text-5xl sm:text-4xl font-bold block"
                style={{
                  color: '#ff6b35'
                }}
              >
                Private.
              </h2>
              <h2 
                className="text-5xl sm:text-4xl font-bold block"
                style={{
                  color: '#ff6b35'
                }}
              >
                Anonymous.
              </h2>
              <h2 
                className="text-5xl sm:text-4xl font-bold block"
                style={{
                  color: '#ff6b35'
                }}
              >
                Unlinkable.
              </h2>
            </div>
            <p className="text-md sm:text-md text-gray-200 drop-shadow-md max-w-xs mx-auto">
            Welcome to the world of private transaction . Everything you need is privacy and we are here to help you with this
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
