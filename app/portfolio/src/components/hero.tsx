import { Float, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

import { Alien } from "./alien";
import HeroBackground from "./hero-background";
import HeroText from "./hero-text";

function Hero() {
  return (
    <>
      <HeroText />
      <HeroBackground />
      <figure className="absolute inset-0">
        <Canvas>
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 10, 7.5]} />
          <Suspense fallback={null}>
            <Float>

              <Alien />
              <OrbitControls />
            </Float>
          </Suspense>
        </Canvas>
      </figure>

    </>
  );
}

export default Hero;
