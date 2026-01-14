"use client";

import React, { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import { BackgroundBeams } from '../components/ui/background-beams';
import imagesJson from './images.json';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWalletClient, useSignMessage } from 'wagmi';
import { parseEther, isAddress } from 'viem';
import { createStealthAddress } from '../../components/helper/fluid';

const images: Record<string, string> = imagesJson;

const CHAINS = [
  { label: 'Mantle', value: 'Mantle' },
];

const TOKENS = [
  { name: 'MNT', chain: 'Mantle', label: 'Mantle (MNT)' },
];

export function Fns({ showHistory, setShowHistory, showWalletModal, setShowWalletModal }: { showHistory: boolean; setShowHistory: (show: boolean) => void; showWalletModal?: boolean; setShowWalletModal?: (show: boolean) => void }) {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { signMessageAsync } = useSignMessage();
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
  
  // Batch transaction state for teams
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>([]);
  const [batchAmount, setBatchAmount] = useState('');
  const [isBatchMode, setIsBatchMode] = useState(false);
  
  // Team management state
  type TeamMemberRole = 'admin' | 'member' | 'viewer';
  interface TeamMember {
    id: string;
    address: string;
    role: TeamMemberRole;
    name: string;
  }
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberAddress, setNewMemberAddress] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<TeamMemberRole>('member');

  // Button requirements
  const canNextStep1 = !!walletType;
  const canNextStep2 = !!selectedChain && !!selectedToken;
  
  // Initialize current user as admin if team mode
  useEffect(() => {
    if (walletType === 'merchant' && address && teamMembers.length === 0) {
      setTeamMembers([{
        id: '1',
        address: address,
        role: 'admin',
        name: 'You'
      }]);
    }
  }, [walletType, address]);

  // Auto-set to pay mode for teams
  useEffect(() => {
    if (walletType === 'merchant' && step === 3) {
      setPayOrReceive('pay');
    }
  }, [walletType, step]);

  // Generate stealth address function using Fluidkey
  const generateStealthAddress = async () => {
    if (!isConnected || !address) {
      alert('Please connect your wallet first');
      return;
    }

    setIsGenerating(true);
    try {
      // Create a signer wrapper that uses useSignMessage hook
      const signer = {
        signMessage: async (params: { account: `0x${string}`; message: string }) => {
          return await signMessageAsync({ message: params.message });
        }
      };
      
      // Use Fluidkey to generate stealth address - this will request signature
      const stealthAddr = await createStealthAddress(signer, address);
      setStealthAddress(stealthAddr);
    } catch (error: any) {
      console.error('Error generating stealth address:', error);
      // Check if user rejected the signature
      if (error?.message?.includes('reject') || error?.code === 4001) {
        setStealthAddress('');
        alert('Signature request was cancelled. Please try again.');
      } else {
        setStealthAddress('Error generating address. Please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Team management functions
  const handleAddTeamMember = () => {
    if (!newMemberAddress || !isAddress(newMemberAddress)) {
      alert('Please enter a valid wallet address');
      return;
    }
    if (teamMembers.some(m => m.address.toLowerCase() === newMemberAddress.toLowerCase())) {
      alert('This wallet address is already added to the team');
      return;
    }
    const newMember: TeamMember = {
      id: Date.now().toString(),
      address: newMemberAddress,
      role: newMemberRole,
      name: newMemberName || `Member ${teamMembers.length}`
    };
    setTeamMembers([...teamMembers, newMember]);
    setNewMemberAddress('');
    setNewMemberName('');
    setNewMemberRole('member');
    setShowAddMember(false);
  };

  const handleRemoveTeamMember = (memberId: string) => {
    if (teamMembers.find(m => m.id === memberId)?.role === 'admin' && 
        teamMembers.filter(m => m.role === 'admin').length === 1) {
      alert('Cannot remove the last admin');
      return;
    }
    setTeamMembers(teamMembers.filter(m => m.id !== memberId));
  };

  const handleUpdateMemberRole = (memberId: string, newRole: TeamMemberRole) => {
    if (teamMembers.find(m => m.id === memberId)?.role === 'admin' && 
        teamMembers.filter(m => m.role === 'admin').length === 1 && newRole !== 'admin') {
      alert('Cannot remove the last admin');
      return;
    }
    setTeamMembers(teamMembers.map(m => 
      m.id === memberId ? { ...m, role: newRole } : m
    ));
  };

  // Handle batch transaction for teams
  const handleBatchTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !walletClient || !address) {
      setTransactionStatus('Please connect your wallet first');
      return;
    }
    if (selectedTeamMembers.length === 0 || !batchAmount) {
      setTransactionStatus('Please select at least one team member and enter amount');
      return;
    }
    try {
      setIsSendingTransaction(true);
      setTransactionStatus('Validating batch transaction...');
      const amountNum = parseFloat(batchAmount);
      if (isNaN(amountNum) || amountNum <= 0) {
        throw new Error('Invalid amount');
      }
      const value = parseEther(batchAmount);
      const totalValue = value * BigInt(selectedTeamMembers.length);
      setTransactionStatus(`Sending ${selectedTeamMembers.length} transaction(s)... Please confirm in your wallet`);
      const hashes: string[] = [];
      for (const memberAddress of selectedTeamMembers) {
        const hash = await walletClient.sendTransaction({
          account: address,
          to: memberAddress as `0x${string}`,
          value
        });
        hashes.push(hash);
      }
      setTransactionHash(hashes[0]);
      setTransactionStatus(`✅ Batch transaction sent! ${selectedTeamMembers.length} transaction(s) completed. Hash: ${hashes[0]}`);
      setSelectedTeamMembers([]);
      setBatchAmount('');
    } catch (error) {
      console.error('Batch transaction error:', error);
      setTransactionStatus(`❌ Batch transaction failed: ${(error as Error).message}`);
    } finally {
      setIsSendingTransaction(false);
    }
  };

  const toggleTeamMemberSelection = (memberAddress: string) => {
    if (selectedTeamMembers.includes(memberAddress)) {
      setSelectedTeamMembers(selectedTeamMembers.filter(addr => addr !== memberAddress));
    } else {
      setSelectedTeamMembers([...selectedTeamMembers, memberAddress]);
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
    <div className="w-full flex flex-col items-center">
      {/* History Screen */}
      {showHistory ? (
        <div className="w-full max-w-md bg-black border-2 border-white border-r-8 border-b-8 rounded-3xl p-10 mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Transaction History</h2>
            <button
              onClick={() => setShowHistory(false)}
              className="bg-black border-2 border-white shadow-[4px_4px_0_0_rgba(255,255,255,1)] px-4 py-2 rounded-lg cursor-pointer text-base font-bold text-white hover:bg-[#ff6b35] hover:shadow-[2px_2px_0_0_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200"
            >
              Back
            </button>
          </div>
          {isConnected && address && (
            <div className="mb-6 p-4 bg-[#ff6b35]/10 rounded-lg border-2 border-white">
              <div className="text-sm font-semibold text-white mb-2">Connected Wallet</div>
              <div className="text-xs text-gray-300 font-mono mb-2">{address}</div>
              <a 
                href={`https://explorer.sepolia.mantle.xyz/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:text-blue-200 underline"
              >
                View on Explorer →
              </a>
            </div>
          )}
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            <div className="flex items-center justify-between p-3 bg-[#ff6b35]/10 rounded-lg border-2 border-white">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 bg-green-900 rounded-full flex items-center justify-center">
                  <span className="text-green-300 font-bold">↓</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white">Received</div>
                  <div className="text-xs text-gray-300 font-mono">0x742d...d8b2</div>
                  <div className="text-xs text-gray-400">2 hours ago</div>
                </div>
              </div>
              <div className="text-right ml-2">
                <div className="text-sm font-bold text-green-300">+100 USDC</div>
                <div className="text-xs text-gray-400">Private</div>
                <a 
                  href={`https://explorer.sepolia.mantle.xyz/address/0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b2`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:text-blue-200 underline mt-1 block"
                >
                  View on Explorer
                </a>
              </div>
            </div>
            <div className="text-center py-4 text-gray-400 text-sm">
              No more transactions to display
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Heading and subtitle OUTSIDE the box */}
          {step === 1 && (
            <div className="mb-6 text-center">
              <h2 className="text-3xl font-extrabold mb-2 mt-6 text-white tracking-tight">Create Account</h2>
              <p className="text-base text-white">Set up your wallet to get started</p>
            </div>
          )}

          {step === 4 && walletType === 'merchant' && (
            <div className="mb-6 text-center">
              <h2 className="text-3xl font-extrabold mb-2 mt-6 text-white tracking-tight">Team Setup</h2>
              <p className="text-base text-white">Add team members and manage access levels</p>
            </div>
          )}

          {step === 2 ? (
            <div className="w-full min-h-[60vh] flex flex-col justify-center items-center mt-8">
              <div className="w-full max-w-md bg-black border-2 border-white border-r-8 border-b-8 rounded-3xl p-10">
                <div className="mb-6">
                  <label className="block mb-2 font-semibold text-white">Chain</label>
                  <select
                    className="w-full p-3 border-2 border-white rounded-xl text-lg bg-black text-white font-semibold focus:ring-2 focus:ring-white focus:border-white hover:border-white transition appearance-none shadow-md outline-none"
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
                    className="w-full p-3 border-2 border-white rounded-xl text-lg bg-black text-white font-semibold focus:ring-2 focus:ring-white focus:border-white hover:border-white transition appearance-none shadow-md outline-none"
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
                  <>
                    <div className="text-white font-bold text-lg mb-1 mt-4">Selected</div>
                    <div className="p-4 border-2 border-white bg-[#ff6b35]/10 flex flex-col items-center rounded-none shadow-sm">
                      <div className="flex gap-4 items-center">
                        <span className="flex items-center px-3 py-1 rounded-none bg-white text-black text-sm font-semibold border border-gray-300">
                          {CHAINS.find(c => c.value === selectedChain)?.label}
                        </span>
                        <span className="flex items-center px-3 py-1 rounded-none bg-[#ff6b35] text-white text-sm font-semibold border border-gray-300">
                          {TOKENS.find(t => t.name === selectedToken && t.chain === selectedChain)?.label}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : step === 3 ? (
            <div className="w-full min-h-[60vh] flex flex-col justify-center items-center mt-8">
              <div className="w-full max-w-md bg-black border-2 border-white border-r-8 border-b-8 rounded-3xl p-10">
                <div className="mb-4 w-full flex justify-center">
                  <ConnectButton />
                </div>
                <div className="text-white font-bold text-lg mb-1 mt-2">Selected</div>
                <div className="p-4 border-2 border-white bg-[#ff6b35]/10 flex flex-col items-center rounded-none shadow-sm mb-6">
                  <div className="flex gap-4 items-center">
                    <span className="flex items-center px-3 py-1 rounded-none bg-white text-black text-sm font-semibold border border-gray-300">
                      {CHAINS.find(c => c.value === selectedChain)?.label}
                    </span>
                    <span className="flex items-center px-3 py-1 rounded-none bg-[#ff6b35] text-white text-sm font-semibold border border-gray-300">
                      {TOKENS.find(t => t.name === selectedToken && t.chain === selectedChain)?.label}
                    </span>
                  </div>
                </div>

                {walletType === 'merchant' ? (
                  <div className="mt-4 w-full">
                    <div className="text-white font-bold text-lg mb-4">Send to Team Members</div>
                    <div className="mb-4 flex gap-2">
                      <button
                        onClick={() => setIsBatchMode(!isBatchMode)}
                        className={`px-4 py-2 rounded-lg border-2 border-white font-semibold text-sm ${
                          isBatchMode ? 'bg-[#ff6b35] text-white' : 'bg-black text-white hover:bg-gray-800'
                        }`}
                      >
                        {isBatchMode ? 'Single Transaction' : 'Batch Transaction'}
                      </button>
                    </div>
                    {isBatchMode ? (
                      <form onSubmit={handleBatchTransaction} className="flex flex-col gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200 max-h-[200px] overflow-y-auto">
                          <div className="text-sm font-semibold text-black mb-3">Select Team Members:</div>
                          {teamMembers.filter(m => m.address.toLowerCase() !== address?.toLowerCase()).map((member) => (
                            <label key={member.id} className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedTeamMembers.includes(member.address)}
                                onChange={() => toggleTeamMemberSelection(member.address)}
                                className="w-4 h-4 border-2 border-black rounded"
                              />
                              <div className="flex-1">
                                <div className="text-sm font-semibold text-black">{member.name}</div>
                                <div className="text-xs text-gray-600 font-mono">{member.address.slice(0, 6)}...{member.address.slice(-4)}</div>
                              </div>
                            </label>
                          ))}
                          {teamMembers.filter(m => m.address.toLowerCase() !== address?.toLowerCase()).length === 0 && (
                            <div className="text-sm text-gray-500 text-center py-4">No team members to send to. Add members in team setup.</div>
                          )}
                        </div>
                        <input
                          type="number"
                          placeholder="Amount per member (MNT)"
                          step="any"
                          value={batchAmount}
                          onChange={(e) => setBatchAmount(e.target.value)}
                          className="w-full p-3 border-2 border-white rounded-xl text-lg bg-black text-white font-semibold focus:ring-2 focus:ring-white focus:border-white outline-none"
                          disabled={isSendingTransaction}
                        />
                        {selectedTeamMembers.length > 0 && batchAmount && (
                          <div className="text-sm text-gray-300 p-2 bg-gray-800 rounded border-2 border-gray-600">
                            Total: {selectedTeamMembers.length} × {batchAmount} MNT = {(parseFloat(batchAmount || '0') * selectedTeamMembers.length).toFixed(4)} MNT
                          </div>
                        )}
                        <button
                          type="submit"
                          disabled={isSendingTransaction || selectedTeamMembers.length === 0 || !batchAmount}
                          className="w-full px-6 py-3 rounded-xl border-2 border-white font-bold text-lg bg-[#ff6b35] text-white hover:bg-[#ff6b35]/80 transition disabled:opacity-50 shadow-md flex items-center justify-center gap-2"
                        >
                          {isSendingTransaction ? (
                            <>
                              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                              Sending Batch Transaction...
                            </>
                          ) : (
                            `Send to ${selectedTeamMembers.length} Member(s)`
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
                    ) : (
                      <form onSubmit={handleSendTransaction} className="flex flex-col gap-4">
                        <div className="mb-2">
                          <label className="block mb-2 text-sm font-semibold text-white">Select Team Member:</label>
                          <select
                            value={recipientAddress}
                            onChange={(e) => setRecipientAddress(e.target.value)}
                            className="w-full p-3 border-2 border-white rounded-xl text-lg bg-black text-white font-semibold focus:ring-2 focus:ring-white focus:border-white outline-none"
                            disabled={isSendingTransaction}
                          >
                            <option value="">Select a team member</option>
                            {teamMembers.filter(m => m.address.toLowerCase() !== address?.toLowerCase()).map((member) => (
                              <option key={member.id} value={member.address}>
                                {member.name} ({member.address.slice(0, 6)}...{member.address.slice(-4)})
                              </option>
                            ))}
                          </select>
                        </div>
                        <input
                          type="number"
                          placeholder="Amount (MNT)"
                          step="any"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-full p-3 border-2 border-white rounded-xl text-lg bg-black text-white font-semibold focus:ring-2 focus:ring-white focus:border-white outline-none"
                          disabled={isSendingTransaction}
                        />
                        <button
                          type="submit"
                          disabled={isSendingTransaction || !recipientAddress || !amount}
                          className="w-full px-6 py-3 rounded-xl border-2 border-white font-bold text-lg bg-[#ff6b35] text-white hover:bg-[#ff6b35]/80 transition disabled:opacity-50 shadow-md flex items-center justify-center gap-2"
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
                  </div>
                ) : (
                  <div>
                    <div className="text-white font-bold text-lg mb-4">Do you want to Pay or Receive?</div>
                    <div className="flex gap-8 justify-center mb-4">
                      <button
                        className={`px-8 py-3 rounded-xl border-2 border-white font-bold text-lg bg-[#ff6b35] text-white hover:bg-[#ff6b35]/80 transition`}
                        onClick={() => setPayOrReceive('pay')}
                      >
                        Pay
                      </button>
                      <button
                        className={`px-8 py-3 rounded-xl border-2 border-white font-bold text-lg bg-black text-white hover:bg-gray-800 transition`}
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
                          className="w-full px-6 py-3 rounded-xl border-2 border-white font-bold text-lg bg-[#ff6b35] text-white hover:bg-[#ff6b35]/80 transition disabled:opacity-50 shadow-md flex items-center justify-center gap-2"
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
                          className="w-full px-6 py-3 rounded-xl border-2 border-white font-bold text-lg bg-[#ff6b35] text-white hover:bg-[#ff6b35]/80 transition disabled:opacity-50 shadow-md flex items-center justify-center gap-2"
                        >
                          {isGenerating ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Generating Private Address...
                            </>
                          ) : (
                            <>
                              🔒 Generate Stealth Address
                            </>
                          )}
                        </button>
                        {stealthAddress && (
                          <div className="mt-4 p-4 bg-gradient-to-r from-[#ff6b35]/10 to-orange-900/20 border-2 border-[#ff6b35] rounded-xl">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <div className="text-sm font-bold text-green-300">Stealth Address Generated</div>
                            </div>
                            <div className="text-xs font-semibold text-gray-300 mb-2">Your Private Receiving Address:</div>
                            <div className="text-xs font-mono text-white break-all bg-black p-3 rounded-lg border-2 border-gray-700 shadow-sm">
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
                            <div className="mt-3 text-xs text-gray-300 bg-blue-900 p-2 rounded border-l-4 border-blue-700">
                              <strong>ℹ️ Privacy Note:</strong> This address is unique to this transaction and cannot be linked to your main wallet.
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : step === 4 && walletType === 'merchant' ? (
            <div className="w-full min-h-[60vh] flex flex-col justify-center items-center mt-8">
              <div className="w-full max-w-md bg-black border-2 border-white border-r-8 border-b-8 rounded-3xl p-10">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Team Management</h2>
                  <p className="text-sm text-gray-300">Manage your team members and their access levels</p>
                </div>
                <div className="space-y-3 mb-6 max-h-[400px] overflow-y-auto">
                  {teamMembers.map((member) => (
                    <div key={member.id} className={`p-4 rounded-lg border-2 border-white ${member.name === 'You' ? 'bg-[#ff6b35]/10' : 'bg-gray-900'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex-1">
                          <div className="font-semibold text-white">{member.name}</div>
                          <div className="text-xs text-gray-300 font-mono">{member.address.slice(0, 6)}...{member.address.slice(-4)}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={member.role}
                            onChange={(e) => handleUpdateMemberRole(member.id, e.target.value as TeamMemberRole)}
                            className="px-3 py-1 text-xs border-2 border-white rounded-lg bg-black text-white font-semibold"
                            disabled={member.role === 'admin' && teamMembers.filter(m => m.role === 'admin').length === 1}
                          >
                            <option value="admin">Admin</option>
                            <option value="member">Member</option>
                            <option value="viewer">Viewer</option>
                          </select>
                          {!(member.role === 'admin' && teamMembers.filter(m => m.role === 'admin').length === 1) && (
                            <button
                              onClick={() => handleRemoveTeamMember(member.id)}
                              className="px-3 py-1 text-xs bg-red-700 text-white rounded-lg hover:bg-red-800 transition font-semibold"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-1 text-xs rounded font-semibold ${
                          member.role === 'admin' ? 'bg-purple-900 text-purple-300' :
                          member.role === 'member' ? 'bg-blue-900 text-blue-300' :
                          'bg-gray-900 text-white'
                        }`}>
                          {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                        </span>
                        <a
                          href={`https://explorer.sepolia.mantle.xyz/address/${member.address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-400 hover:text-blue-200 underline"
                        >
                          View on Explorer →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
                {showAddMember ? (
                  <div className="p-4 bg-[#ff6b35]/10 border-2 border-[#ff6b35] rounded-xl mb-4">
                    <div className="mb-4">
                      <label className="block mb-2 text-sm font-semibold text-white">Member Name</label>
                      <input
                        type="text"
                        placeholder="Enter member name"
                        value={newMemberName}
                        onChange={(e) => setNewMemberName(e.target.value)}
                        className="w-full p-2 border-2 border-white rounded-lg text-sm bg-black text-white font-semibold focus:ring-2 focus:ring-white focus:border-white outline-none"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block mb-2 text-sm font-semibold text-white">Wallet Address</label>
                      <input
                        type="text"
                        placeholder="0x..."
                        value={newMemberAddress}
                        onChange={(e) => setNewMemberAddress(e.target.value)}
                        className="w-full p-2 border-2 border-white rounded-lg text-sm bg-black text-white font-mono font-semibold focus:ring-2 focus:ring-white focus:border-white outline-none"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block mb-2 text-sm font-semibold text-white">Role</label>
                      <select
                        value={newMemberRole}
                        onChange={(e) => setNewMemberRole(e.target.value as TeamMemberRole)}
                        className="w-full p-2 border-2 border-white rounded-lg text-sm bg-black text-white font-semibold focus:ring-2 focus:ring-white focus:border-white outline-none"
                      >
                        <option value="admin">Admin</option>
                        <option value="member">Member</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddTeamMember}
                        className="flex-1 px-4 py-2 bg-[#ff6b35] text-white rounded-lg border-2 border-white font-bold hover:bg-black hover:text-[#ff6b35] transition"
                      >
                        Add Member
                      </button>
                      <button
                        onClick={() => {
                          setShowAddMember(false);
                          setNewMemberAddress('');
                          setNewMemberName('');
                          setNewMemberRole('member');
                        }}
                        className="px-4 py-2 bg-white text-black rounded-lg border-2 border-white font-bold hover:bg-gray-100 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddMember(true)}
                    className="w-full px-6 py-3 rounded-xl border-2 border-white font-bold text-lg bg-[#ff6b35] text-white hover:bg-black hover:text-[#ff6b35] transition shadow-md"
                  >
                    + Add Team Member
                  </button>
                )}
                <div className="mt-6 p-4 bg-[#ff6b35]/10 border-2 border-white rounded-lg">
                  <div className="text-sm font-semibold text-white mb-2">Role Permissions:</div>
                  <div className="text-xs text-gray-300 space-y-1">
                    <div><strong>Admin:</strong> Full access - can add/remove members, send transactions, manage settings</div>
                    <div><strong>Member:</strong> Can send transactions and view team activity</div>
                    <div><strong>Viewer:</strong> Read-only access - can view transactions and team activity</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-md bg-black border-2 border-white border-r-8 border-b-8 rounded-3xl p-10 mt-0 md:mt-4">
              {step === 1 && (
                <>
                  <div className="mb-2 text-lg font-semibold text-white">Wallet Type</div>
                  <div className="flex flex-col gap-4 mb-8">
                    <button
                      className={`py-3 px-6 border-4 border-white rounded-none font-semibold text-lg text-left transition shadow-md hover:shadow-xl focus:outline-none ${walletType === 'personal' ? 'bg-[#ff6b35] text-white' : 'bg-black text-white hover:bg-gray-800 border-white'}`}
                      onClick={() => setWalletType('personal')}
                    >
                      <div className="font-bold text-xl mb-1">Personal</div>
                      <div className={`text-base ${walletType === 'personal' ? 'text-white' : 'text-gray-300'}`}>For personal use</div>
                    </button>
                    <button
                      className={`py-3 px-6 border-4 border-white rounded-none font-semibold text-lg text-left transition shadow-md hover:shadow-xl focus:outline-none ${walletType === 'merchant' ? 'bg-[#ff6b35] text-white' : 'bg-black text-white hover:bg-gray-800 border-white'}`}
                      onClick={() => setWalletType('merchant')}
                    >
                      <div className="font-bold text-xl mb-1">Team</div>
                      <div className={`text-base ${walletType === 'merchant' ? 'text-white' : 'text-gray-300'}`}>need pro access</div>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Navigation Buttons OUTSIDE the box, centered - only show when not in history */}
          {!showHistory && (
            <div className="flex gap-6 mt-8 w-full max-w-md justify-center">
              <button
                className="px-8 py-3 rounded-xl border-2 border-white font-bold text-lg bg-black text-white hover:bg-gray-800 transition disabled:opacity-50 shadow-md"
                disabled={step === 1}
                onClick={() => setStep(step - 1)}
              >
                Back
              </button>
              <button
                className="px-8 py-3 rounded-xl border-2 border-white font-bold text-lg bg-[#ff6b35] text-white hover:bg-[#ff6b35]/80 transition disabled:opacity-50 shadow-md"
                disabled={step === 1 ? !canNextStep1 : step === 2 ? !canNextStep2 : step === 4 ? teamMembers.length === 0 : false}
                onClick={() => {
                  if (step === 1 && canNextStep1) setStep(2);
                  else if (step === 2 && canNextStep2) {
                    if (walletType === 'merchant') {
                      setStep(4);
                    } else {
                      setStep(3);
                    }
                  } else if (step === 4 && walletType === 'merchant') {
                    setStep(3);
                  }
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function BackgroundBeamsDemo() {
  return (
    <div className="h-[40rem] w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="relative z-10 text-lg md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-yellow-200 to-yellow-600  text-center font-sans font-bold">
          Private. Anonymous. Unlinkable.
        </h1>
        <p></p>
        <p className="text-white max-w-lg mx-auto my-2 text-md text-center relative z-10">
          Welcome to the world of private transaction . Everything you need is privacy and we are here to help you with this
        </p>
      </div>
      <BackgroundBeams />
    </div>
  );
}

export { motion };

