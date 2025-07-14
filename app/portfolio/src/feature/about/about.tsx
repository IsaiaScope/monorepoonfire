import { UIImage, UIWrapper } from "@package/ui";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

import { TextEffect } from "../../component/text-effect";
import { useGetSkills } from "./api/use-skills";
import Download from "./component/download";
import Frameworks from "./component/frameworks";
import Globe from "./component/globe";
import Skill from "./component/skill";
import { WobbleCard } from "./component/wobble-card";

function About() {
  const { t } = useTranslation();
  const skillContainer = useRef<HTMLDivElement | null>(null);

  const { data: skills, isFetching, isError } = useGetSkills();

  return (
    <UIWrapper tag="section" id={t("about")} className="scroll-mt-16 max-w-screen-xl mx-auto p-6">
      <TextEffect as="h2" per="char" preset="fade" className="my-12 font-bold text-4xl font-LibreFranklin">
        {t("about me")}
      </TextEffect>

      <section className="grid grid-cols-1 md:grid-cols-6 md:grid-rows-3 gap-4 ">

        <WobbleCard containerClassName="min-h-80 md:col-span-3 md:row-span-2">
          <div
            className="absolute inset-0 flex h-full items-center justify-end flex-col"
          >
            <UIImage src="/assets/coding-pov.png" className="absolute inset-0 w-full h-full object-contain object-center bg-no-repeat translate-x-5 -translate-y-25 scale-180 md:-translate-y-38 md:scale-200" alt="" />
            <p className="p-3 md:p-8 relative z-10">
              As software engineer my journey has been a blend of hard work and passion but I'm sure to have found my way. The road is still long, but I am excited to see where it leads me.
            </p>
          </div>
        </WobbleCard>

        <WobbleCard containerClassName="min-h-80 relative overflow-hidden md:col-span-3">
          <div ref={skillContainer} className="flex flex-col items-center justify-center h-full">
            {isFetching
              ? (
                  <div
                    className="inline-block h-20 w-20 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em]  motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                    role="status"
                  >
                    <span className="sr-only">
                      Loading...
                    </span>
                  </div>
                )
              : null}
            {isError
              ? (
                  <p>
                    Oops! Something went wrong while fetching the skills.
                  </p>
                )
              : null}
            { skills
              ? (
                  <>
                    <p>
                      Play around with my skills
                    </p>
                    { skills?.map(skill => (
                      <Skill
                        key={skill.id}
                        style={{ rotate: "0deg", top: "0%", left: "0%" }}
                        text="SOLID"
                        containerRef={skillContainer}
                      />
                    ))}

                  </>
                )
              : null}
          </div>
        </WobbleCard>
        <WobbleCard containerClassName="min-h-80 relative overflow-hidden md:col-span-3">
          <p>
            One you leave this world behind
            <br />
            so live a life you will remember
          </p>
          <Globe />
        </WobbleCard>
        <WobbleCard containerClassName="min-h-80 md:col-span-2">
          <div className="flex flex-col items-center justify-center gap-8 h-full">

            <p>
              Check out my curriculum vitae to learn more about my professional journey
            </p>
            <Download />
          </div>

        </WobbleCard>

        <WobbleCard containerClassName="min-h-80 relative overflow-hidden md:col-span-4">

          <p>
            A bit of Teck Stack that I use in my projects
          </p>
          <div className="absolute inset-0 translate-x-1/2 md:scale-125">
            <Frameworks />
          </div>
        </WobbleCard>

      </section>
    </UIWrapper>
  );
};

export default About;
