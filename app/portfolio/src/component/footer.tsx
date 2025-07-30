import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@package/shadcn";
import { UILink } from "@package/ui";
import { cn } from "@package/utility/tailwind";
import { Facebook, Github, Instagram, Linkedin, Twitch, Twitter } from "lucide-react";
import { useTranslation } from "react-i18next";

function ContactLink(
  {
    href,
    className,
    children,
    label,
    ...props

  }: {
    href: string;
    className?: string;
    children: React.ReactNode;
    label: string;
  } & React.AnchorHTMLAttributes<HTMLAnchorElement>,
) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          asChild
          aria-label={label}
          onMouseEnter={(e) => {
            e.currentTarget.style.cursor = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ctext y='24' font-size='24'%3E🦆%3C/text%3E%3C/svg%3E"), auto`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.cursor = "pointer";
          }}
        >
          <UILink href={href} {...props} className={cn("rounded-full px-0 py-0 size-10 [&_svg]:size-6 bg-transparent animate-in fade-in zoom-in duration-300", className)}>
            {children}
          </UILink>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="flex items-center justify-center p-2 backdrop-blur-md bg-secondary/80 text-secondary-foreground gap-4">
      <ContactLink
        href="https://github.com/IsaiaScope"
        label={t("GitHub")}
      >
        <Github />
      </ContactLink>
      <ContactLink
        href="https://www.linkedin.com/in/isaia-riva-2452242ab/"
        label={t("LinkedIn")}
      >
        <Linkedin />
      </ContactLink>
      <ContactLink
        href="https://www.twitch.tv/iso_on_fire"
        label={t("Twitch")}
      >
        <Twitch />
      </ContactLink>
      <ContactLink
        href="https://www.instagram.com/iso_on_fire"
        label={t("Instagram")}
      >
        <Instagram />
      </ContactLink>
      <ContactLink
        href="https://www.facebook.com/isaia.riva/"
        label={t("Facebook")}
      >
        <Facebook />
      </ContactLink>
      <ContactLink
        href="https://x.com/isaia77462"
        label={t("Twitter")}
      >
        <Twitter />
      </ContactLink>
    </footer>
  );
}

export default Footer;
