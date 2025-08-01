import { Skeleton } from "@package/shadcn";
import { UIWrapper } from "@package/ui";
import { cn } from "@package/utility/tailwind";
import { useTranslation } from "react-i18next";

import { TextEffect } from "../../component/text-effect";
import { useGetWorkExperience } from "./api/use-work-experiences";
import Timeline from "./component/timeline";

function Work() {
  const { t, i18n: { language } } = useTranslation();
  const { data: workExperienceData, isLoading, isError } = useGetWorkExperience();
  const skeletons = [1, 2, 3, 4, 5, 6];

  if (isError || workExperienceData?.length === 0)
    return null;

  return (
    <UIWrapper tag="section" id={t("Work")} className={cn("scroll-mt-16 max-w-screen-xl mx-auto p-6 w-full")}>
      <TextEffect as="h2" per="char" preset="fade" className="my-10 font-bold text-4xl font-LibreFranklin">
        {t("Work Experience")}
      </TextEffect>

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
              <Timeline
                data={workExperienceData.filter(item => item.language === language)}
              />
            )
          : null}
      </section>
    </UIWrapper>
  );
}

export default Work;
