import { Badge, Button, Dialog, DialogTrigger } from "@package/shadcn";
import { UILink } from "@package/ui";
import { PACKAGE_UTILITY } from "@package/utility/constant";
import { ArrowRightCircle, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";

import ProjectDetails from "./project-details";

type Props = {
  id: number;
  title: string;
  description: string;
  subDescription: string[];
  href: string;
  repo: string;
  image: string;
  tags: {
    id: number;
    name: string;
    path: string;
  }[];
  setPreview: (image: string | null) => void;
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
}: Props) => {
  const { t } = useTranslation();
  const isBiggerThanMedium = useMediaQuery({
    minWidth: PACKAGE_UTILITY.MEDIA_QUERY.MD,
  });
  return (
    <>
      <div
        className="flex-wrap justify-between  pt-10 pb-14 space-y-14 sm:flex sm:space-y-0"
        onMouseEnter={() => setPreview(image)}
        onMouseLeave={() => setPreview(null)}
      >
        <div className="flex flex-col space-y-6 max-w-9/12 overflow-hidden text-ellipsis">
          <p className="text-2xl lg:text-3xl font-semibold">
            {title}
          </p>
          <div className="flex gap-5 mt-4">
            {tags.map(tag => (
              <Badge variant="secondary" key={tag.id}>
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
                      className="flex items-center gap-1 cursor-pointer hover-animation"
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
                    tags={tags}
                    href={href}
                  />
                </Dialog>
              )
            : (
                <Button asChild>
                  <UILink href={repo}>
                    {t("View Project")}
                    <ExternalLink />
                  </UILink>
                </Button>
              )
        }
      </div>

      <div className="bg-gradient-to-r from-transparent via-primary/70 to-transparent h-[2px] w-full" />
    </>
  );
};

export default Project;
