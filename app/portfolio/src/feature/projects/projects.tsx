import { Skeleton } from "@package/shadcn";
import { UIWrapper } from "@package/ui";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { createSectionId } from "../../utility/create-section-id";
import { useGetProjects } from "./api/use-projects";
import ProjectsList from "./component/projects-list";
import ProjectsPreview from "./component/projects-preview";
import { useMousePosition } from "./hooks/use-mouse-position";

export default function Projects() {
  const { t, i18n: { language } } = useTranslation();
  const [preview, setPreview] = useState<string | null>(null);
  const { data: projectsData, isLoading, isError } = useGetProjects();
  const { mousePosition, handleMouseMove } = useMousePosition();
  const skeletons = [1, 2, 3];

  // Memoize filtered data to prevent recalculation
  const filteredProjects = useMemo(() => {
    if (!projectsData || !Array.isArray(projectsData))
      return [];
    return projectsData.filter(item => item.language === language);
  }, [projectsData, language]);

  // Throttled scroll handler
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking && preview) {
        requestAnimationFrame(() => {
          setPreview(null);
          ticking = false;
        });
        ticking = true;
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
    <>
      <UIWrapper tag="section" id={createSectionId(t("Projects"))} className="scroll-mt-16 max-w-screen-xl mx-auto p-6 w-full">
        <h2 className="my-10 font-bold text-4xl font-LibreFranklin animate-in fade-in zoom-in duration-500">
          {t("Projects")}
        </h2>
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
          {projectsData && (
            <ProjectsList projects={filteredProjects} setPreview={setPreview} />
          )}
        </section>
      </UIWrapper>

      {/* Preview component - isolated to prevent parent re-renders */}
      <ProjectsPreview
        preview={preview}
        mousePosition={mousePosition}
      />
    </>
  );
}
