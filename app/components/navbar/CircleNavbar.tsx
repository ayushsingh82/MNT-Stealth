import Link from "next/link";

export default function CircleNavbar() {
  return (
    <nav className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex items-center justify-center">
        <Link 
          href="/"
          className="text-2xl font-bold text-white hover:text-zinc-200 transition-colors"
        >
          MNT-Stealth
        </Link>
      </div>
    </nav>
  );
}
