import { UIWrapper } from "@package/ui";
import { PACKAGE_UTILITY } from "@package/utility/constant";
import { Float } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";

import { createSectionId } from "../../utility/create-section-id";
import { Alien } from "./component/alien";
import HeroBackground from "./component/hero-background";
import HeroText from "./component/hero-text";

function useWebGLSupported() {
  return useMemo(() => {
    try {
      const canvas = document.createElement("canvas");
      return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
    }
    catch {
      return false;
    }
  }, []);
}

// 📝 NOTE: 16 (4rem) is Navbar height
function Hero() {
  // Translation hook for internationalization
  const { t } = useTranslation();

  // Check if screen is larger than large breakpoint for responsive design
  const isBiggerThanLarge = useMediaQuery({
    minWidth: PACKAGE_UTILITY.MEDIA_QUERY.LG,
  });

  const webGLSupported = useWebGLSupported();

  return (
    <UIWrapper tag="section" className="grow relative h-svh overflow-hidden" variant="primary" id={createSectionId(t("Home"))}>
      {/* Text content overlay */}
      <HeroText />

      {/* Background visual elements */}
      <HeroBackground />

      {/* 3D scene container — only renders when WebGL is available */}
      {webGLSupported && (
        <figure className="absolute inset-0">
          <Canvas>
            {/* Lighting setup for 3D scene */}
            <ambientLight intensity={1.5} />
            <directionalLight position={[5, 10, 7.5]} />

            {/* 3D model with loading fallback */}
            <Suspense fallback={null}>
              <Float>
                <Alien
                  scale={isBiggerThanLarge ? [2, 2, 2] : [1.6, 1.6, 1.6]}
                  position={isBiggerThanLarge ? [1.9, -0.1, 0.3] : [0, -1.1, 0]}
                  rotation={[0, 0, -Math.PI / 8]}
                />
              </Float>
            </Suspense>
          </Canvas>
        </figure>
      )}
    </UIWrapper>
  );
}

export default Hero;
