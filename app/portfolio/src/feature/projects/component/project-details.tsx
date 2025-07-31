import {
  Button,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@package/shadcn";
import { UILink } from "@package/ui";
import { ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";

type ProjectDetailsProps = {
  title: string;
  description: string;
  subDescription: string[];
  image: string;
  tags: Array<{ id: number; path: string; name: string }>;
  href: string;
};

const ProjectDetails = ({
  title,
  description,
  subDescription,
  image,
  tags,
  href,
}: ProjectDetailsProps) => {
  const { t } = useTranslation();
  return (

    <DialogContent className="md:max-w-2xl">
      <DialogHeader>
        <DialogTitle>Edit profile</DialogTitle>
        <DialogDescription>
          Make changes to your profile here. Click save when you&apos;re
          done.
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col  items-center justify-center w-full h-full overflow-hidden backdrop-blur-sm">

        <img src={image} alt={title} className="w-full rounded-t-2xl" />
        <div className="p-5">
          <h5 className="mb-2 text-2xl font-bold text-white">{title}</h5>
          <p className="mb-3 font-normal text-neutral-400">{description}</p>
          {subDescription.map((subDesc, index) => (
            <p
              className="mb-3 font-normal text-neutral-400"
              // eslint-disable-next-line react/no-array-index-key
              key={index}
            >
              {subDesc}
              {subDesc}

            </p>
          ))}

        </div>

      </div>
      <DialogFooter>
        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-3">
            {tags.map(tag => (
              <img
                key={tag.id}
                src={tag.path}
                alt={tag.name}
                className="rounded-lg size-10 hover-animation"
              />
            ))}
          </div>
        </div>
        <Button asChild>
          <UILink href={href}>
            {t("View Project")}
            <ExternalLink />
          </UILink>
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default ProjectDetails;
