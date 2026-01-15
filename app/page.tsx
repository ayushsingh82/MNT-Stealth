'use client';

import Link from 'next/link';
import React from 'react';
import Plasma from './components/Plasma';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-black">
      {/* Left: Text Content */}
      <div className="w-full md:w-1/2 flex flex-col items-center md:items-start px-4 md:px-12 py-8 md:py-16 relative z-10 bg-black border-r border-[#ff6b35]">
        {/* HEADER */}
        <div className="w-full mb-8">
          <Link href="/" className="focus:outline-none">
            <div className="bg-white border-2 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] px-6 py-3 rounded-lg cursor-pointer inline-block">
              <h1 className="text-2xl font-black text-black">Mnt-Stealth</h1>
            </div>
          </Link>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center w-full max-w-md">
          <div className="space-y-6 sm:space-y-8">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white font-serif leading-tight">
              Private Transactions <span className="text-[#ff6b35]">on Mantle</span>
            </h2>
           
            <Link href="/widget">
              <button className="px-6 py-3 sm:px-8 sm:py-4 bg-[#ff6b35] border-2 border-white shadow-[6px_6px_0_0_rgba(255,255,255,1)] text-white rounded-lg font-bold hover:bg-[#ff6b35]/90 hover:shadow-[4px_4px_0_0_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 text-sm sm:text-base">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Right: Plasma effect with text overlay */}
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
    </div>
  );
}
