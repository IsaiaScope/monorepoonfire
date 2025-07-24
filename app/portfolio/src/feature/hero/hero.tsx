import { UIWrapper } from "@package/ui";
import { PACKAGE_UTILITY } from "@package/utility/constant";
import { Float } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";

import { Alien } from "./component/alien";
import HeroBackground from "./component/hero-background";
import HeroText from "./component/hero-text";

// 📝 NOTE: 16 (4rem) is Navbar height
function Hero() {
  const { t } = useTranslation();
  const isBiggerThanLarge = useMediaQuery({
    minWidth: PACKAGE_UTILITY.MEDIA_QUERY.LG,
  });
  return (
    <UIWrapper tag="section" className="grow relative  min-h-[100dvh] overflow-hidden" variant="primary" id={t("Home")}>

      <HeroText />
      <HeroBackground />
      <figure className="absolute inset-0">
        <Canvas>
          <ambientLight intensity={1.5} />
          <directionalLight position={[5, 10, 7.5]} />
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

    </UIWrapper>

  );
}

export default Hero;
