import { Skeleton } from "@package/shadcn";
import { UIWrapper } from "@package/ui";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { TextEffect } from "../../component/text-effect";
import { createSectionId } from "../../utility/create-section-id";
import { useGetProjects } from "./api/use-projects";
import Project from "./component/project";

export default function Projects() {
  const { t, i18n: { language } } = useTranslation();
  const [preview, setPreview] = useState<string | null>(null);
  const { data: projectsData, isLoading, isError } = useGetProjects();
  const skeletons = [1, 2, 3];

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 10, stiffness: 50 });
  const springY = useSpring(y, { damping: 10, stiffness: 50 });

  const handleMouseMove = (e: React.MouseEvent) => {
    x.set(e.clientX + 20);
    y.set(e.clientY + 20);
  };

  // Clear preview when scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (preview) {
        setPreview(null);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [preview]);

  // Show loading skeletons if currently loading
  // Return null only if there's an error or no data when not loading
  if (isError || (!isLoading && (!projectsData || !Array.isArray(projectsData) || projectsData.length === 0)))
    return null;

  return (
    <UIWrapper tag="section" id={createSectionId(t("Projects"))} className="scroll-mt-16 max-w-screen-xl mx-auto p-6 w-full">
      <TextEffect as="h2" per="char" preset="fade" className="my-10 font-bold text-4xl font-LibreFranklin">
        {t("Projects")}
      </TextEffect>

      <section
        className="flex flex-col relative space-y-6 md:space-y-8 pt-10"
        onMouseMove={handleMouseMove}
      >
        {isLoading
          ? skeletons.map((_, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <div className="flex gap-4 items-center" key={index}>
                <div className="flex-shrink-0">
                  <Skeleton className="h-20 w-20 md:h-24 md:w-24 rounded-full" />
                </div>
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 md:h-8 w-3/4" />
                  <Skeleton className="h-6 md:h-8 w-1/2" />
                  <Skeleton className="h-4 md:h-6 w-full" />
                </div>
              </div>
            ))
          : null}
        { projectsData
          ? (
              <>
                {projectsData.filter(item => item.language === language).map((project, index) => (
                  <Project key={project.id} {...project} setPreview={setPreview} index={index} />
                ))}
                <motion.img
                  className="fixed top-0 left-0 z-50 object-cover h-56 rounded-lg shadow-lg pointer-events-none w-80"
                  loading="lazy"
                  src={preview || undefined}
                  style={{
                    x: springX,
                    y: springY,
                    opacity: preview ? 1 : 0,
                    visibility: preview ? "visible" : "hidden",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: preview ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                />
              </>
            )
          : null}

      </section>
    </UIWrapper>
  );
}
