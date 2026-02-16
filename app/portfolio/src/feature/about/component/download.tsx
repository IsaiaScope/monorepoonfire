import { Button, Skeleton } from "@package/shadcn";
import { UILink } from "@package/ui";
import { PACKAGE_UTILITY } from "@package/utility/constant";
import { DownloadIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";

import { useGetCurriculum } from "../api/use-curriculum";

function Download() {
  const isBiggerThanMedium = useMediaQuery({
    minWidth: PACKAGE_UTILITY.MEDIA_QUERY.MD,
  });
  const { data: curriculumList, isLoading, isError } = useGetCurriculum();
  const cvUrl = curriculumList?.[0]?.url;
  const isDisabled = isError || !cvUrl;
  const { t } = useTranslation();

  if (isLoading) {
    return <Skeleton className="h-12 w-48 rounded-md" />;
  }

  return (
    <Button
      className="md:text-xl h-12 px-6 [&_svg]:size-auto hover:scale-105 transition-transform duration-200 animate-in fade-out zoom-in"
      style={isDisabled ? { opacity: 0.5, pointerEvents: "none" } : undefined}
      size="lg"
      disabled={isDisabled}
      asChild={!isDisabled}
      onMouseEnter={(e) => {
        e.currentTarget.style.cursor = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ctext y='24' font-size='24'%3E❤️%3C/text%3E%3C/svg%3E"), auto`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.cursor = "pointer";
      }}
    >
      {isDisabled
        ? (
            <>
              <DownloadIcon size={isBiggerThanMedium ? 26 : 20} />
              {t("Download")}
            </>
          )
        : (
            <UILink href={cvUrl}>
              <DownloadIcon size={isBiggerThanMedium ? 26 : 20} />
              {t("Download")}
            </UILink>
          )}
    </Button>
  );
}

export default Download;
