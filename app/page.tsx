import Navbar from "./components/navbar/Navbar";

export default function Home() {
  return (
    <div 
      className="flex h-screen flex-col font-sans overflow-hidden relative"
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
  );
}
