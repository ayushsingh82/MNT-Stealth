"use client";

import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Fns } from './screens';
import Link from 'next/link';
import Plasma from '../components/Plasma';

const WidgetPage = () => {
  const { isConnected } = useAccount();
  const [showHistory, setShowHistory] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);

  const handleHistoryClick = () => {
    if (!isConnected) {
      setShowWalletModal(true);
    } else {
      setShowHistory(!showHistory);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-black">
      {/* Left: Mnt-Stealth header and Fns stepper */}
      <div className="w-full md:w-1/2 flex flex-col items-center md:items-start px-0 md:px-12 py-0 md:py-16 relative z-10 bg-black border-r border-[#ff6b35]">
        <div className="w-full flex justify-between items-center px-4 md:px-0 pt-2 md:pt-2 gap-4 mb-8">
          <Link href="/" className="focus:outline-none">
            <div className="bg-[#ff6b35] border-2 border-white shadow-[6px_6px_0_0_rgba(255,255,255,1)] px-6 py-3 rounded-lg cursor-pointer text-2xl font-black text-white">
              <a href="/">Mnt-Stealth</a>
            </div>
          </Link>
          <button
            onClick={handleHistoryClick}
            className="bg-black border-2 border-white shadow-[4px_4px_0_0_rgba(255,255,255,1)] px-5 py-3 rounded-lg cursor-pointer text-lg font-bold text-white hover:bg-[#ff6b35] hover:shadow-[2px_2px_0_0_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 whitespace-nowrap"
          >
            History
          </button>
        </div>
        <div className="flex-1 w-full flex flex-col items-center">
          <Fns showHistory={showHistory} setShowHistory={setShowHistory} showWalletModal={showWalletModal} setShowWalletModal={setShowWalletModal} />
        </div>
      </div>

      {/* Right: Full black background, Plasma effect centered */}
      <div className="w-full md:w-1/2 min-h-screen bg-black relative overflow-hidden">
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
      
      {/* Wallet Not Connected Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-black border-r-8 border-b-8 rounded-3xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-black mb-2">Wallet Not Connected</h2>
              <p className="text-gray-700">Please connect your wallet to view transaction history.</p>
            </div>
            <div className="flex justify-center mb-4">
              <ConnectButton />
            </div>
            <button
              onClick={() => setShowWalletModal(false)}
              className="w-full px-6 py-3 rounded-xl border-2 border-black font-bold text-lg bg-black text-white hover:bg-[#FCD119] hover:text-black transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WidgetPage;

