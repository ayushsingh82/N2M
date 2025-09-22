import Image from "next/image";
import GradientBlinds from './components/gradientBlinkd';

export default function Home() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <GradientBlinds
        gradientColors={['#FF9FFC', '#5227FF']}
        angle={0}
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
  );
}
