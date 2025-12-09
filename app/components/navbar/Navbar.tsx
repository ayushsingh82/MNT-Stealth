'use client';

import Link from "next/link";
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Navbar() {
  return (
    <nav className="w-full relative z-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12 sm:h-14">
          <Link 
            href="/"
            className="text-lg sm:text-xl font-bold text-white hover:text-zinc-200 transition-colors"
          >
            MNT-Stealth
          </Link>
          <div className="flex-1 flex justify-center">
            <ConnectButton />
          </div>
          <div className="w-0"></div>
        </div>
      </div>
    </nav>
  );
}

