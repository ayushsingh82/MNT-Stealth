'use client';

import Link from 'next/link';
import React from 'react';
import Plasma from './components/Plasma';

export default function Home() {
  return (
    <div className="h-screen bg-black font-sans tracking-tight relative overflow-hidden">
      {/* Full-screen Plasma effect */}
      <div className="fixed inset-0 w-screen h-screen z-0" style={{ width: '100vw', height: '100vh' }}>
        <Plasma 
          color="#ff6b35"
          speed={0.6}
          direction="forward"
          scale={1.1}
          opacity={0.8}
          mouseInteractive={true}
        />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 h-full flex flex-col">
        {/* HEADER */}
        <div className="absolute top-6 left-6 z-10">
          <Link href="/" className="focus:outline-none">
            <div className="bg-white border-2 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] px-6 py-3 rounded-lg cursor-pointer">
              <h1 className="text-2xl font-black text-black">Mnt-Stealth</h1>
            </div>
          </Link>
        </div>

        {/* Main Content - Two Column Layout */}
        <main className="flex-1 flex items-center justify-center px-4 sm:px-8 py-8 sm:py-12">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left Side - Text Content */}
              <div className="space-y-6 sm:space-y-8">
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white font-serif leading-tight">
                  Private Transactions <span className="text-[#ff6b35]">on Mantle</span>
                </h2>
                <p className="text-base sm:text-lg lg:text-xl text-white leading-relaxed font-sans">
                  Build the next generation of private, anonymous, and unlinkable transactions.
                  <br/> Shape the future of privacy-powered payments on-chain.
                </p>
                <Link href="/widget">
                  <button className="px-6 py-3 sm:px-8 sm:py-4 bg-[#ff6b35] border-2 border-white shadow-[6px_6px_0_0_rgba(255,255,255,1)] text-white rounded-lg font-bold hover:bg-[#ff6b35]/90 hover:shadow-[4px_4px_0_0_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 text-sm sm:text-base">
                    Get Started
                  </button>
                </Link>
              </div>

              {/* Right Side - Mantle Logo */}
              <div className="hidden lg:flex items-center justify-center">
                <img 
                  src="https://cryptologos.cc/logos/mantle-mnt-logo.png" 
                  alt="Mantle MNT Logo" 
                  className="w-full max-w-md h-auto"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
