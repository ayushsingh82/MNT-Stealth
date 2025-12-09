export default function Navbar() {
  return (
    <nav className="w-full relative z-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12 sm:h-14">
          <a 
            href="#docs" 
            className="text-sm sm:text-base font-medium text-white hover:text-zinc-200 transition-colors"
          >
            Docs
          </a>
          <h1 className="text-lg sm:text-xl font-bold text-white">
            x402
          </h1>
          <a 
            href="#product" 
            className="text-sm sm:text-base font-medium text-white hover:text-zinc-200 transition-colors"
          >
            Product
          </a>
        </div>
      </div>
    </nav>
  );
}

