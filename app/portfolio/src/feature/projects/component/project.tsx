import { Badge, Button } from "@package/shadcn";
import { ArrowRightCircle } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import ProjectDetails from "./project-details";

type Props = {
  title: string;
  description: string;
  subDescription: string[];
  href: string;
  image: string;
  tags: { id: number; path: string; name: string }[];
  setPreview: (image: string | null) => void;
};

const Project = ({
  title,
  description,
  subDescription,
  href,
  image,
  tags,
  setPreview,
}: Props) => {
  const [isHidden, setIsHidden] = useState(false);
  const { t } = useTranslation();
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
        <Button
          variant="default"
          onClick={() => setIsHidden(true)}
          className="flex items-center gap-1 cursor-pointer hover-animation"
        >
          {t("Read More")}
          <ArrowRightCircle />
        </Button>
      </div>
      <div className="bg-gradient-to-r from-transparent via-primary/70 to-transparent h-[1px] w-full" />
      {isHidden && (
        <ProjectDetails
          title={title}
          description={description}
          subDescription={subDescription}
          image={image}
          tags={tags}
          href={href}
          closeModal={() => setIsHidden(false)}
        />
      )}
    </>
  );
};

export default Project;
