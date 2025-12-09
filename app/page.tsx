import CircleNavbar from "./components/navbar/CircleNavbar";
import Lightning from "./components/Lightning";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Left black section with Lightning - 12.5% width */}
      <div className="w-[12.5%] h-screen bg-black relative">
        <Lightning
          hue={220}
          xOffset={0}
          speed={1}
          intensity={1}
          size={1}
        />
      </div>

      {/* Middle section with background image - 75% width */}
      <div 
        className="flex h-screen flex-col font-sans overflow-hidden relative w-3/4"
        style={{
          backgroundImage: 'url(https://wallpapers.com/images/hd/neon-galaxy-with-black-background-7xf3vcagh2c5cj4e.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30"></div>
        
        {/* Circle Navbar */}
        <CircleNavbar />
        
        <header className="flex flex-1 items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center max-w-3xl gap-6 px-4">
            <p className="text-md font-black mb-2 text-white bg-black px-3 py-2 rounded-lg inline-block">Experience the Future of</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white drop-shadow-lg italic">
              PRIVATE Transaction
            </h1>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 text-white bg-black px-3 py-2 rounded-lg inline-block italic">on Mantle</h2>
            <Link 
              href="/get-started"
              className="mt-4 px-8 py-4 text-lg font-semibold rounded-full bg-white text-black transition-all hover:bg-zinc-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl inline-block"
            >
              Get Started
            </Link>
          </div>
        </header>
      </div>

      {/* Right black section with Lightning - 12.5% width */}
      <div className="w-[12.5%] h-screen bg-black relative">
        <Lightning
          hue={220}
          xOffset={0}
          speed={1}
          intensity={1}
          size={1}
        />
      </div>
    </div>
  );
}
