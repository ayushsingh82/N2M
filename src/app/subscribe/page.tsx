'use client';

import SubscriptionForm from '../components/SubscriptionForm';
import GradientBlinds from '../components/gradientBlinkd';

export default function SubscribePage() {
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Gradient Background */}
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

      {/* Back Button */}
      <button 
        onClick={() => window.history.back()}
        className="absolute top-6 left-6 z-20 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 hover:bg-white/20 hover:border-white/40 hover:scale-105 shadow-xl"
      >
        ← Back
      </button>

      {/* Dashboard Button */}
      <a 
        href="/dashboard"
        className="absolute top-6 right-6 z-20 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 hover:bg-white/20 hover:border-white/40 hover:scale-105 shadow-xl"
      >
        Dashboard
      </a>

      {/* Subscription Form */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="bg-black/40 backdrop-blur-lg border border-white/30 rounded-2xl p-8 shadow-2xl">
          <SubscriptionForm />
        </div>
      </div>
    </div>
  );
}