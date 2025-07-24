import { Button } from "@package/shadcn";
import { UILink } from "@package/ui";
import { PACKAGE_UTILITY } from "@package/utility/constant";
import { DownloadIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";

function Download() {
  const isBiggerThanMedium = useMediaQuery({
    minWidth: PACKAGE_UTILITY.MEDIA_QUERY.MD,
  });
  const cvUrl = "https://1drv.ms/b/c/ce94a875eefa9f39/EW1jGNcVV59MtB30LDkGqw4BdCc1iDppLM9XShslAdwltg?e=aqR9I4";
  const { t } = useTranslation();

  return (
    <Button
      className="md:text-xl h-12 px-6 [&_svg]:size-auto hover:scale-105 transition-transform duration-200"
      size="lg"
      asChild
      onMouseEnter={(e) => {
        e.currentTarget.style.cursor = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ctext y='24' font-size='24'%3E❤️%3C/text%3E%3C/svg%3E"), auto`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.cursor = "pointer";
      }}
    >
      <UILink href={cvUrl}>
        <DownloadIcon size={isBiggerThanMedium ? 26 : 20} />
        {t("Download")}
      </UILink>
    </Button>
  );
}

export default Download;
