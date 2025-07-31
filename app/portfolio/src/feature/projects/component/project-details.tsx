import {
  Button,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@package/shadcn";
import { UIImage, UILink } from "@package/ui";
import { ExternalLink, OctagonX } from "lucide-react";
import { useTranslation } from "react-i18next";

type ProjectDetailsProps = {
  title: string;
  description: string;
  subDescription: string[];
  image: string;
  href: string;
};

const ProjectDetails = ({
  title,
  description,
  subDescription,
  image,
  href,
}: ProjectDetailsProps) => {
  const { t } = useTranslation();
  return (

    <DialogContent showCloseButton={false} className="overflow-auto flex flex-col rounded-2xl p-3 pb-4 md:max-w-2xl h-10/12 max-h-[950px] gap-8 hide-scrollbar">
      <DialogHeader className="flex flex-col gap-5">
        <UIImage src={image} alt="" className="w-full rounded-2xl" />
        <DialogTitle className="text-2xl font-LibreFranklin">{title}</DialogTitle>
        <DialogDescription className="sr-only">
          {description}
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col grow gap-2">
        {subDescription.map((subDesc, index) => (
          <p
            // eslint-disable-next-line react/no-array-index-key
            key={index}
          >
            {subDesc}
          </p>
        ))}

      </div>
      <DialogFooter className="mt-2">
        <div className="flex gap-4 items-center justify-center">
          <DialogClose asChild>
            <Button variant="destructive" className="cursor-pointer">
              {t("Close")}
              <OctagonX />
            </Button>
          </DialogClose>
          <Button asChild>
            <UILink href={href}>
              {t("View Project")}
              <ExternalLink />
            </UILink>
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  );
};

export default ProjectDetails;
