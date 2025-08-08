import { UIImage, UIWrapper } from "@package/ui";
import { Grab, Hand } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { TextEffect } from "../../component/text-effect";
import { createSectionId } from "../../utility/create-section-id";
import { useGetSkills } from "./api/use-skills";
import Download from "./component/download";
import Frameworks from "./component/frameworks";
import Globe from "./component/globe";
import Skill from "./component/skill";
import { WobbleCard } from "./component/wobble-card";

// 📝 NOTE: #262626 is card color
function About() {
  const { t } = useTranslation();
  const skillContainer = useRef<HTMLDivElement | null>(null);
  const [isContainerReady, setIsContainerReady] = useState(false);

  const { data: skills, isLoading, isError } = useGetSkills();

  // Use callback ref to ensure proper initialization after routing
  const setSkillContainer = useCallback((node: HTMLDivElement | null) => {
    skillContainer.current = node;
    setIsContainerReady(!!node);
  }, []);

  return (
    <UIWrapper tag="section" id={createSectionId(t("About"))} className="scroll-mt-16 max-w-screen-xl mx-auto p-6">
      <TextEffect as="h2" per="char" preset="fade" className="my-10 font-bold text-4xl font-LibreFranklin">
        {t("About me")}
      </TextEffect>

      <section className="grid grid-cols-1 md:grid-cols-6 md:grid-rows-3 gap-4 ">

        <WobbleCard containerClassName="min-h-80 md:col-span-3 md:row-span-2">
          <div
            className="absolute inset-0 flex h-full justify-end flex-col p-3 md:p-8 gap-3"
          >
            <UIImage src="/assets/coding-pov.png" className="absolute inset-0 w-full h-full object-contain object-center bg-no-repeat translate-x-5 -translate-y-25 scale-180 md:-translate-y-38 md:scale-200" alt="" />
            <h3 className="text-xl md:text-3xl font-bold z-10 font-LibreFranklin">
              {t("Hi, I'm Isaia")}
            </h3>
            <p className="z-10">
              {t("As software engineer my journey has been a blend of hard work and passion but I'm sure to have found my way. The road is still long, but I am excited to see where it leads me")}
            </p>
          </div>
        </WobbleCard>

        <WobbleCard containerClassName="min-h-80 relative overflow-hidden md:col-span-3" className="px-3 py-3 sm:px-3">
          <div ref={setSkillContainer} className="flex flex-col items-center justify-center h-full">
            {isLoading
              ? (
                  <div
                    className="inline-block h-20 w-20 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em]  motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                    role="status"
                  >
                    <span className="sr-only">
                      {t("Loading skills")}
                    </span>
                  </div>
                )
              : null}
            {!isLoading && (isError || !skills || !Array.isArray(skills) || skills.length === 0)
              ? (
                  <p className="text-center">
                    {t("Oops! Something went wrong while fetching the skills")}
                  </p>
                )
              : null}
            { !isLoading && skills && Array.isArray(skills) && skills.length > 0 && isContainerReady
              ? (
                  <>
                    <div className="flex justify-center items-center gap-2 opacity-65">
                      <h3 className="font-bold mt-1">{t("Skills Lab")}</h3>
                      <div className="relative w-9 h-9">
                        <Hand size={32} className="absolute inset-0 animate-grab-gesture-hand" />
                        <Grab size={32} className="absolute inset-0 animate-grab-gesture-grab" />
                      </div>
                    </div>
                    { skills.map((skill, index) => (
                      <Skill
                        key={skill.id}
                        text={skill.name}
                        containerRef={skillContainer}
                        index={index}
                        total={skills.length}
                      />
                    ))}
                  </>
                )
              : null}
          </div>
        </WobbleCard>
        <WobbleCard containerClassName="min-h-80 relative overflow-hidden md:col-span-3 bg-[#262626]/80">
          <div className="flex flex-col h-full gap-4 w-1/2 md:w-3/5">
            <h3 className="text-xl md:text-3xl font-bold font-LibreFranklin z-10">
              {t("Travelling")}
            </h3>
            <p className="z-10">
              {t("One day you'll leave this world behind. So, live a life you will remember")}
            </p>
            <Globe />
          </div>
        </WobbleCard>
        <WobbleCard containerClassName="min-h-80 md:col-span-2 bg-[#262626]/80">
          <div className="flex flex-col items-center justify-center gap-8 h-full">
            <h4 className="text-center">
              {t("Check out my curriculum vitae to learn more about my professional journey")}
            </h4>
            <Download />
          </div>
        </WobbleCard>

        <WobbleCard containerClassName="min-h-80 relative overflow-hidden md:col-span-4">
          <div className="flex flex-col h-full gap-6 w-1/2  md:w-3/5">
            <h3 className="text-xl md:text-3xl font-bold font-LibreFranklin z-10">
              {t("Tech Stack")}
            </h3>
            <p className="z-10">
              {t("I have experience with a wide range of languages, frameworks and tools")}
            </p>
            <div className="absolute inset-0 translate-x-1/2 md:scale-125">
              <Frameworks />
            </div>
          </div>
        </WobbleCard>

      </section>
    </UIWrapper>

  );
};

export default About;
