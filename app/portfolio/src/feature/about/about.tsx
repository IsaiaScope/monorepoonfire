import { UIWrapper } from "@package/ui";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

import { TextEffect } from "../../component/text-effect";
import { useGetSkills } from "./api/use-skills";
import Download from "./component/download";
import Frameworks from "./component/frameworks";
import Globe from "./component/globe";
import Skill from "./component/skill";

function About() {
  const { t } = useTranslation();
  const skillContainer = useRef<HTMLDivElement | null>(null);

  const { data: skills } = useGetSkills();
  console.warn(`🧊 ~ skills: `, skills);

  return (
    <UIWrapper tag="section" id={t("about")} className="scroll-mt-16 max-w-screen-xl mx-auto p-6">
      <TextEffect per="char" preset="fade" className="text-shadow-sm/20 text-shadow-primary font-bold text-3xl">
        {t("about me")}
      </TextEffect>

      <section className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-10 auto-rows-fr">

        <div className="bg-gradient-to-t from-primary/70 to-primary/80 shadow-foreground/40 shadow-sm ring-1 rounded-lg text-secondary-foreground ring-primary/60 p-2 min-h-80 col-span-1">
          As software engineer my journey has been a blend of hard work and passion but I'm sure to have found my way. The road is still long, but I am excited to see where it leads me.
        </div>
        <div className="bg-gradient-to-t from-primary/70 to-primary/80 shadow-foreground/40 shadow-sm ring-1 rounded-lg text-secondary-foreground ring-primary/60 p-2 min-h-80 relative overflow-hidden col-span-2" ref={skillContainer}>
          <p>
            Play around with my skills
          </p>
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
        <div className="bg-gradient-to-t from-primary/70 to-primary/80 shadow-foreground/40 shadow-sm ring-1 rounded-lg text-secondary-foreground ring-primary/60 p-2 min-h-80 col-span-1">
          <p>
            Check out my CV to learn more about my professional journey, skills, and accomplishments.
          </p>
          <Download />
        </div>

        <div className="bg-gradient-to-t from-primary/70 to-primary/80 shadow-foreground/40 shadow-sm ring-1 rounded-lg text-secondary-foreground ring-primary/60 p-2 min-h-80 relative overflow-hidden col-span-2">
          <p>
            One you leave this world behind
            <br />
            so live a life you will remember
          </p>
          <Globe />
        </div>
        <div className="bg-gradient-to-t from-primary/70 to-primary/80 shadow-foreground/40 shadow-sm ring-1 rounded-lg text-secondary-foreground ring-primary/60 p-2 min-h-80 relative overflow-hidden col-span-2">
          <p className="">
            A bit of Teck Stack that I use in my projects
          </p>
          <div className="absolute inset-0 translate-x-1/2 lg:scale-125">
            <Frameworks />
          </div>
        </div>

      </section>

    </UIWrapper>
  );
};

export default About;
