import { UIWrapper } from "@package/ui";
// import { Float, OrbitControls } from "@react-three/drei";
// import { Canvas, useFrame } from "@react-three/fiber";
// import { Suspense } from "react";

// import { Alien } from "./component/alien";
import HeroBackground from "./component/hero-background";
import HeroText from "./component/hero-text";

// 📝 NOTE: 16 (4rem) is Navbar height
function Hero() {
  return (
    <UIWrapper tag="section" className="grow relative  mt-16 min-h-[calc(100dvh-4rem)]" variant="primary">

      <HeroText />
      <HeroBackground />
      {/* <figure className="absolute inset-0">
        <Canvas>
          <ambientLight intensity={1.5} />
          <directionalLight position={[5, 10, 7.5]} />
          <Suspense fallback={null}>
            <Float>
              <Alien />
              <OrbitControls />
            </Float>
          </Suspense>
        </Canvas>
      </figure> */}

    </UIWrapper>

  );
}

// function Rig() {
//   return useFrame((state, delta) => {
//     easing.damp3(
//       state.camera.position,
//       [state.mouse.x / 10, 1 + state.mouse.y / 10, 3],
//       0.5,
//       delta
//     );
//   });
// }

export default Hero;
