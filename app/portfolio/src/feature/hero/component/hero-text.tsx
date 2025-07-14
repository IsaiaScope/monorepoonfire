import { PACKAGE_UTILITY } from "@package/utility/constant";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";

import FlipWords from "./flip-words";

const HeroText = () => {
  const { t } = useTranslation();
  const words = [t("robust"), t("innovative"), t("reliable")];
  const variants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };
  const isBiggerThanLarge = useMediaQuery({
    minWidth: PACKAGE_UTILITY.MEDIA_QUERY.LG,
  });
  return (
    <section className="text-white z-10 text-center lg:text-left inset-0 absolute">
      <h1 className="flex flex-col space-y-4 lg:justify-center h-full lg:ml-[25%] mt-28 md:mt-36 lg:mt-0">
        <motion.p
          className="text-5xl font-semibold font-LibreFranklin"
          variants={variants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1 }}
        >
          {t("Hi, I'm Isaia")}
        </motion.p>
        <div className="space-y-2">
          <motion.p
            className="text-5xl "
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.2 }}
          >
            {
              isBiggerThanLarge
                ? (
                    <>
                      {t("a developer")}
                      <br />
                      {t("committed to building")}
                    </>
                  )
                : t("creating")
            }
          </motion.p>
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.5 }}
          >
            <FlipWords
              words={words}
              className="font-bold text-white text-5xl"
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
      </h1>
    </section>
  );
};

export default HeroText;
