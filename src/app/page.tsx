import Image from "next/image";
import GradientBlinds from './components/gradientBlinkd';

export default function Home() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Subscribe Button - Top Right */}
      <a 
        href="/subscribe"
        className="absolute top-6 right-6 z-20 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 hover:bg-white/20 hover:border-white/40 hover:scale-105 shadow-xl"
      >
        Subscribe
      </a>
      
      {/* Gradient Background - Full Screen for Mouse Events */}
      <div className="absolute inset-0 z-0">
        <GradientBlinds
          gradientColors={['#FF9FFC', '#5227FF']}
          angle={45}
          noise={0.3}
          blindCount={12}
          blindMinWidth={50}
          spotlightRadius={0.5}
          spotlightSoftness={1}
          spotlightOpacity={1}
          mouseDampening={0.15}
          distortAmount={0}
          shineDirection="left"
          mixBlendMode="lighten"
        />
      </div>
      
      {/* Bottom Section - Non-interactive overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-black/20 to-transparent z-10 pointer-events-none"></div>
      
      {/* N2M Loops Text - Center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
        <h1 className="text-7xl md:text-9xl font-black text-white text-center drop-shadow-2xl tracking-wider mb-6">
          N2M Loops
        </h1>
        <p className="text-xl md:text-2xl text-white/90 text-center drop-shadow-lg max-w-2xl px-4">
          NEAR intent helps you subscribe multichain
        </p>
      </div>
    </div>
  );
}
