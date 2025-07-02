import { UIWrapper } from "@package/ui";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

import Globe from "./component/globe";
import Skill from "./component/skill";

function About() {
  const { t } = useTranslation();
  const skillContainer = useRef<HTMLDivElement | null>(null);

  return (
    <UIWrapper tag="section" id={t("about")} className="scroll-mt-16 max-w-screen-xl mx-auto">
      <h2 className="">About</h2>
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">

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

        <div className="bg-secondary rounded-lg text-secondary-foreground p-2 relative   overflow-hidden h-80" ref={skillContainer}>
          <Globe />
        </div>

      </section>

    </UIWrapper>
  );
};

export default About;
