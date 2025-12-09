'use client';

import { useState } from "react";
import Navbar from "../components/navbar/Navbar";
import Lightning from "../components/Lightning";

export default function GetStarted() {
  const [walletType, setWalletType] = useState<'personal' | 'merchant' | null>(null);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Left section - 3/5 width with black background */}
      <div className="flex h-screen flex-col font-sans overflow-hidden relative w-3/5 bg-black">
        <div className="relative z-10">
          <Navbar />
        </div>
        
        <header className="flex flex-1 items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="w-full max-w-md">
            {/* Heading and subtitle */}
            <div className="mb-6 text-center">
              <h2 className="text-3xl font-extrabold mb-2 text-white tracking-tight">Create Account</h2>
              <p className="text-base text-gray-300">Set up your wallet to get started</p>
            </div>

            {/* Wallet Type Selection */}
            <div className="bg-black border-2 border-white border-r-8 border-b-8 rounded-3xl p-10">
              <div className="mb-2 text-lg font-semibold text-white">Wallet Type</div>
              
              <div className="flex flex-col gap-4">
                <button
                  className={`py-3 px-6 border-4 border-white rounded-none font-semibold text-lg text-left transition shadow-md hover:shadow-xl focus:outline-none ${
                    walletType === 'personal' 
                      ? 'bg-white text-black' 
                      : 'bg-gray-900 text-white hover:bg-gray-800'
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
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                  onClick={() => setWalletType('merchant')}
                >
                  <div className="font-bold text-xl mb-1">Team</div>
                  <div className={`text-base ${walletType === 'merchant' ? 'text-black' : 'text-gray-300'}`}>need pro access</div>
                </button>
              </div>
              
            </div>
          </div>
        </header>
      </div>

      {/* Right section with Lightning component - 2/5 width */}
      <div className="w-2/5 h-screen relative">
        <Lightning
          hue={220}
          xOffset={0}
          speed={1}
          intensity={1}
          size={1}
        />
        {/* Text overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6">
          <div className="text-center space-y-4">
            <div>
              <h2 
                className="text-5xl sm:text-4xl font-bold text-white block"
                style={{
                  textShadow: `
                    0 0 10px rgba(100, 150, 255, 0.8),
                    0 0 20px rgba(100, 150, 255, 0.6),
                    0 0 30px rgba(100, 150, 255, 0.4),
                    0 0 40px rgba(100, 150, 255, 0.3),
                    0 0 70px rgba(100, 150, 255, 0.2),
                    0 0 80px rgba(100, 150, 255, 0.1),
                    2px 2px 4px rgba(0, 0, 0, 0.5)
                  `,
                  animation: 'pulse-glow 2s ease-in-out infinite alternate'
                }}
              >
                Private.
              </h2>
              <h2 
                className="text-5xl sm:text-4xl font-bold text-white block"
                style={{
                  textShadow: `
                    0 0 10px rgba(100, 150, 255, 0.8),
                    0 0 20px rgba(100, 150, 255, 0.6),
                    0 0 30px rgba(100, 150, 255, 0.4),
                    0 0 40px rgba(100, 150, 255, 0.3),
                    0 0 70px rgba(100, 150, 255, 0.2),
                    0 0 80px rgba(100, 150, 255, 0.1),
                    2px 2px 4px rgba(0, 0, 0, 0.5)
                  `,
                  animation: 'pulse-glow 2s ease-in-out infinite alternate'
                }}
              >
                Anonymous.
              </h2>
              <h2 
                className="text-5xl sm:text-4xl font-bold text-white block"
                style={{
                  textShadow: `
                    0 0 10px rgba(100, 150, 255, 0.8),
                    0 0 20px rgba(100, 150, 255, 0.6),
                    0 0 30px rgba(100, 150, 255, 0.4),
                    0 0 40px rgba(100, 150, 255, 0.3),
                    0 0 70px rgba(100, 150, 255, 0.2),
                    0 0 80px rgba(100, 150, 255, 0.1),
                    2px 2px 4px rgba(0, 0, 0, 0.5)
                  `,
                  animation: 'pulse-glow 2s ease-in-out infinite alternate'
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
