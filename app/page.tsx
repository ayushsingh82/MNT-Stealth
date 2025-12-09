import Navbar from "./components/navbar/Navbar";
import Lightning from "./components/Lightning";

export default function Home() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Left section with background image - 2/3 width */}
      <div 
        className="flex h-screen flex-col font-sans overflow-hidden relative w-2/3"
        style={{
          backgroundImage: 'url(https://wallpapers.com/images/hd/neon-galaxy-with-black-background-7xf3vcagh2c5cj4e.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30"></div>
        
        <div className="relative z-10">
          <Navbar />
        </div>
        
        <header className="flex flex-1 items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center max-w-3xl gap-6 px-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white drop-shadow-lg">
              Welcome to Your Journey
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl leading-relaxed text-zinc-200 max-w-2xl drop-shadow-md">
              Discover amazing possibilities and unlock your potential. Start your adventure today and experience something extraordinary.
            </p>
            <button className="mt-4 px-8 py-4 text-lg font-semibold rounded-full bg-white text-black transition-all hover:bg-zinc-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl">
              Get Started
            </button>
          </div>
        </header>
      </div>

      {/* Right section with Lightning component - 1/3 width */}
      <div className="w-1/3 h-screen relative">
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
            <h2 
              className="text-3xl sm:text-4xl font-bold text-white"
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
             Privacy via x402 
            </h2>
            <p className="text-md sm:text-md text-gray-200 drop-shadow-md max-w-xs">
            PRIVACY AND VERIFICATION POWERED BY EIGENLABS
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
