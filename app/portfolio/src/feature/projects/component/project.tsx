import { Badge, Button, Dialog, DialogTrigger } from "@package/shadcn";
import { UILink } from "@package/ui";
import { PACKAGE_UTILITY } from "@package/utility/constant";
import { ArrowRightCircle, ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";

import type { useGetProjects } from "../api/use-projects";

import ProjectDetails from "./project-details";

type ProjectPros = NonNullable<ReturnType<typeof useGetProjects>["data"]>[number];

type Props = ProjectPros & {
  setPreview: (image: string | null) => void;
  index: number;
};

const Project = ({
  title,
  description,
  subDescription,
  href,
  image,
  repo,
  tags,
  setPreview,
  index,
}: Props) => {
  const { t } = useTranslation();
  const isBiggerThanMedium = useMediaQuery({
    minWidth: PACKAGE_UTILITY.MEDIA_QUERY.MD,
  });
  const canHover = useMediaQuery({ query: "(hover: hover)" });
  return (
    <>
      <motion.div
        className="flex-wrap justify-between pb-10 space-y-14 md:flex md:space-y-0"
        onMouseEnter={canHover ? () => setPreview(image) : undefined}
        onMouseLeave={canHover ? () => setPreview(null) : undefined}
        initial={{
          opacity: 0,
          x: index % 2 === 0 ? -100 : 100,
        }}
        whileInView={{
          opacity: 1,
          x: 0,
        }}
        viewport={{
          once: true,
          amount: 0.3,
        }}
        transition={{
          duration: 0.6,
          delay: 0.1,
          ease: "easeOut",
        }}
      >
        <div className="flex flex-col space-y-6 max-w-9/12 overflow-hidden text-ellipsis">
          <p className="text-2xl lg:text-3xl font-semibold">
            {title}
          </p>
          <div className="flex gap-5 mt-4">
            {tags.map(tag => (
              <Badge variant="secondary" className="hover:scale-110 cursor-default" key={tag.id}>
                {`#${tag.name}`}
              </Badge>
            ))}

          </div>
        </div>
        {
          isBiggerThanMedium

            ? (
                <Dialog onOpenChange={() => setPreview(null)}>

                  <DialogTrigger asChild>
                    <Button
                      variant="default"
                      className="flex items-center gap-1 cursor-pointer"
                    >
                      {t("Read More")}
                      <ArrowRightCircle />
                    </Button>
                  </DialogTrigger>
                  <ProjectDetails
                    title={title}
                    description={description}
                    subDescription={subDescription}
                    image={image}
                    href={href}
                    repo={repo}
                  />
                </Dialog>
              )
            : (
                <Button asChild className="">
                  <UILink href={repo}>
                    {t("View Project")}
                    <ExternalLink />
                  </UILink>
                </Button>
              )
        }
      </motion.div>

      <div className="bg-gradient-to-r from-transparent via-primary/70 to-transparent h-[2px] w-full" />
    </>
  );
};

export default Project;
