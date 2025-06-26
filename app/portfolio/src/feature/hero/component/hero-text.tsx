import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

import FlipWords from "./flip-words";

const HeroText = () => {
  const { t } = useTranslation();
  const words = [t("robust"), t("bulletproof"), t("reliable")];
  const variants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };
  return (
    <div className="z-10 mt-20 text-center md:mt-40 md:text-left bg-clip-text">
      {/* Desktop View */}
      <div className="flex-col hidden md:flex  c-space">
        <motion.h1
          className="text-4xl"
          variants={variants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1 }}
        >
          {t("Hi, I'm Isaia")}
        </motion.h1>
        <div className="flex flex-col items-start">
          <motion.p
            className="text-5xl text-neutral-300"
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.2 }}
          >
            {t("a developer")}
            <br />
            {t("committed to building")}
          </motion.p>
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.5 }}
          >
            <FlipWords
              words={words}
              className="text-white text-8xl"
            />
          </motion.div>
          <motion.p
            className="text-4xl text-neutral-300"
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.8 }}
          >
            {t("web solutions")}
          </motion.p>
        </div>
      </div>
      {/* Mobile View */}
      <div className="flex flex-col space-y-6 md:hidden">
        <motion.p
          className="text-4xl"
          variants={variants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1 }}
        >
          {t("Hi, I'm Isaia")}
        </motion.p>
        <div>
          <motion.p
            className="text-5xl text-neutral-300"
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.2 }}
          >
            {t("creating")}
          </motion.p>
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.5 }}
          >
            <FlipWords
              words={words}
              className="font-bold text-white text-7xl"
            />
          </motion.div>
          <motion.p
            className="text-4xl text-neutral300"
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.8 }}
          >
            {t("web solutions")}
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default HeroText;
