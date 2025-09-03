import { Skeleton } from "@package/shadcn";
import { UIWrapper } from "@package/ui";
import { cn } from "@package/utility/tailwind";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { createSectionId } from "../../utility/create-section-id";
import { useGetWorkExperience } from "./api/use-work-experiences";
import Timeline from "./component/timeline";

function Work() {
  const { t, i18n: { language } } = useTranslation();
  const { data: workExperienceData, isLoading, isError } = useGetWorkExperience();
  const skeletons = [1, 2, 3, 4, 5, 6];

  // Memoize filtered and sorted data to prevent recalculation
  const filteredWorkData = useMemo(() => {
    if (!workExperienceData || !Array.isArray(workExperienceData))
      return [];
    return workExperienceData
      .filter(item => item.language === language)
      .sort((a, b) => a.startDate.localeCompare(b.startDate));
  }, [workExperienceData, language]);

  // Show loading skeletons if currently loading
  // Return null only if there's an error or no data when not loading
  if (isError || (!isLoading && (!workExperienceData || !Array.isArray(workExperienceData) || workExperienceData.length === 0)))
    return null;

  return (
    <UIWrapper tag="section" id={createSectionId(t("Work"))} className={cn("scroll-mt-16 max-w-screen-xl mx-auto p-6 w-full")}>
      <h2 className="my-10 font-bold text-4xl font-LibreFranklin animate-in fade-in zoom-in duration-500">
        {t("Work Experience")}
      </h2>

      <section className="flex flex-col space-y-6 md:space-y-8 pt-10">
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
        { workExperienceData
          ? (
              <Timeline data={filteredWorkData} />
            )
          : null}
      </section>
    </UIWrapper>
  );
}

export default Work;
