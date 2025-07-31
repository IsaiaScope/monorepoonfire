import { UIWrapper } from "@package/ui";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { TextEffect } from "../../component/text-effect";
import Project from "./component/project";
import { myProjects } from "./constant/projects";

export default function Projects() {
  const { t } = useTranslation();
  const [preview, setPreview] = useState<string | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 10, stiffness: 50 });
  const springY = useSpring(y, { damping: 10, stiffness: 50 });

  const handleMouseMove = (e: React.MouseEvent) => {
    x.set(e.clientX + 20);
    y.set(e.clientY + 20);
  };

  return (
    <UIWrapper tag="section" id={t("Projects")} className="scroll-mt-16 max-w-screen-xl mx-auto p-6 w-full">
      <TextEffect as="h2" per="char" preset="fade" className="my-10 font-bold text-4xl font-LibreFranklin">
        {t("Projects")}
      </TextEffect>

      <section
        className="flex flex-col mb-20 relative"
        onMouseMove={handleMouseMove}
      >
        {myProjects.map(project => (
          <Project key={project.id} {...project} setPreview={setPreview} />
        ))}
        {preview && (
          <motion.img
            className="fixed top-0 left-0 z-50 object-cover h-56 rounded-lg shadow-lg pointer-events-none w-80"
            src={preview}
            style={{ x: springX, y: springY }}
          />
        )}
      </section>
    </UIWrapper>
  );
}
