import { UIWrapper } from "@package/ui";
import { useTranslation } from "react-i18next";

import { TextEffect } from "../../component/text-effect";

function Projects() {
  const { t } = useTranslation();

  return (
    <UIWrapper tag="section" id={t("Projects")} className="scroll-mt-16 max-w-screen-xl mx-auto p-6 w-full">
      <TextEffect as="h2" per="char" preset="fade" className="my-10 font-bold text-4xl font-LibreFranklin">
        {t("Projects")}
      </TextEffect>

      <section className="flex flex-col mb-20 pt-10">

      </section>
    </UIWrapper>
  );
}

export default Projects;
