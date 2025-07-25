import { UIWrapper } from "@package/ui";
import { useTranslation } from "react-i18next";

import { TextEffect } from "../../component/text-effect";
import { useGetWorkExperience } from "./api/use-work-experiences";
import Timeline from "./component/timeline";

function Work() {
  const { t } = useTranslation();
  const { data: workExperienceData } = useGetWorkExperience();

  return (
    <UIWrapper tag="section" id={t("Work")} className="scroll-mt-16 max-w-screen-xl mx-auto p-6   w-full">
      <TextEffect as="h2" per="char" preset="fade" className="my-10 font-bold text-4xl font-LibreFranklin">
        {t("Work Experience")}
      </TextEffect>

      <section className="flex flex-col">
        { workExperienceData
          ? (
              <Timeline
                data={workExperienceData}
              />
            )
          : null}
      </section>
    </UIWrapper>
  );
}

export default Work;
