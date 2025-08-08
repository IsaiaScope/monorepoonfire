import {
  Button,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@package/shadcn";
import { UIImage, UILink } from "@package/ui";
import { cn } from "@package/utility/tailwind";
import { ExternalLink, Github, OctagonX } from "lucide-react";
import { useTranslation } from "react-i18next";

type ProjectDetailsProps = {
  title: string;
  description: string;
  subDescription: string[];
  image: string;
  repo: string;
  href: string;
};

const ProjectDetails = ({
  title,
  description,
  subDescription,
  image,
  href,
  repo,
}: ProjectDetailsProps) => {
  const { t } = useTranslation();
  return (

    <DialogContent showCloseButton={false} className="overflow-auto flex flex-col rounded-2xl p-3 pb-4 md:max-w-2xl h-10/12 max-h-[950px] gap-8 hide-scrollbar">
      <DialogHeader className="flex flex-col gap-5">
        <UIImage src={image} alt="" className="w-full rounded-2xl shadow" />
        <DialogTitle className="text-2xl font-LibreFranklin">{title}</DialogTitle>
        <DialogDescription className="sr-only">
          {description}
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col grow gap-2">
        {subDescription.map(subDesc => (
          <p
            key={subDesc}
          >
            {subDesc}
          </p>
        ))}

      </div>
      <DialogFooter className="mt-2">
        <div className="flex gap-4 items-center justify-center">

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                asChild
                aria-label={t("Check out the repository")}
              >
                <UILink href={repo} className={cn("rounded-full px-0 py-0 size-10 [&_svg]:size-6 bg-transparent animate-in fade-out zoom-in duration-300 hover:scale-110")}>
                  <Github />
                </UILink>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" className="text-xs">
              {t("Check out the repository")}
            </TooltipContent>
          </Tooltip>
          <DialogClose asChild>

            <Button variant="destructive" className="cursor-pointer animate-in fade-out zoom-in duration-300">
              {t("Close")}
              <OctagonX />
            </Button>
          </DialogClose>
          <Button asChild className="animate-in fade-out zoom-in duration-300">
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
