import { UIWrapper } from "@package/ui";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

import Download from "./component/download";
import Frameworks from "./component/frameworks";
import Globe from "./component/globe";
import Skill from "./component/skill";

function About() {
  const { t } = useTranslation();
  const skillContainer = useRef<HTMLDivElement | null>(null);

  // https://ui.aceternity.com/components/wobble-card
  return (
    <UIWrapper tag="section" id={t("about")} className="scroll-mt-16 max-w-screen-xl mx-auto p-6">
      <h2 className="font-bold text-3xl">About</h2>
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-4">

        <div className="bg-secondary rounded-lg text-secondary-foreground p-2">
          ciao dwqwjkcv qiwhcvwicvqw cviwe uicv weuihj wev  qei iv 4w vwi vqwiv 4ei qwihv qwiv  qwivi
          ciao dwqwjkcv qiwhcvwicvqw cviwe uicv weuihj wev  qei iv 4w vwi vqwiv 4ei qwihv qwiv  qwivi
          ciao dwqwjkcv qiwhcvwicvqw cviwe uicv weuihj wev  qei iv 4w vwi vqwiv 4ei qwihv qwiv   qwivi
          ciao dwqwjkcv qiwhcvwicvqw cviwe uicv weuihj wev  qei iv 4w vwi vqwiv 4ei qwihv qwiv  qwivi

        </div>
        <div className="bg-secondary rounded-lg text-secondary-foreground p-2 relative   overflow-hidden h-80" ref={skillContainer}>
          <Skill
            style={{ rotate: "0deg", top: "0%", left: "0%" }}
            text="SOLID"
            containerRef={skillContainer}
          />
          <Skill
            style={{ rotate: "75deg", top: "0%", left: "0%" }}
            text="Design Patterns"
            containerRef={skillContainer}
          />
        </div>

        <div className="bg-secondary rounded-lg text-secondary-foreground p-2 relative   overflow-hidden h-80">
          One you leave this world behind so live a life you will remember
          <Globe />
        </div>
        <div className="bg-secondary rounded-lg text-secondary-foreground p-2 relative   overflow-hidden h-80">
          <Download />
        </div>

        <div className="bg-secondary rounded-lg text-secondary-foreground p-2 relative   overflow-hidden h-80">
          <div className="z-10 w-[50%]">
            <p className="headText">Teck Stack</p>
            <p className="subtext">
              I specialize in a variety of languages, frameworks, and tools taht
              allow me to build robust and scalable applications
            </p>
          </div>
          <div className="absolute inset-y-0 md:inset-y-9 w-full h-full start-[50%] md:scale-125">
            <Frameworks />
          </div>
        </div>

      </section>

    </UIWrapper>
  );
};

export default About;
