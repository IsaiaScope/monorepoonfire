import { Button } from "@package/shadcn";
import { UILink } from "@package/ui";
import { DownloadIcon } from "lucide-react";

function Download() {
  const cvUrl = "https://1drv.ms/b/c/ce94a875eefa9f39/EW1jGNcVV59MtB30LDkGqw4BdCc1iDppLM9XShslAdwltg?e=aqR9I4";
  return (
    <Button size="lg" variant="secondary" asChild>
      <UILink href={cvUrl}>
        <DownloadIcon />
        Download
      </UILink>
    </Button>
  );
}

export default Download;
