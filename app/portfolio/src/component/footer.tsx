import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@package/shadcn";
import { UILink } from "@package/ui";
import { cn } from "@package/utility/tailwind";
import { useLocation } from "@tanstack/react-router";
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
        >
          <UILink href={href} {...props} className={cn("rounded-full px-0 py-0 size-10 [&_svg]:size-6 bg-transparent animate-in fade-in zoom-in duration-300 hover:scale-110", className)}>
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
  const isHome = useLocation().pathname === "/";
  return (
    <footer className={cn("w-full backdrop-blur-md bg-secondary/80 mt-20", { "mt-0": !isHome })}>
      <section className="py-2 px-6 md:justify-between max-w-screen-xl mx-auto flex items-center justify-center text-secondary-foreground font-LibreFranklin">

        <p className="hidden text-nowrap text-md lg:block">
          {`${t("Terms & Conditions")} | ${t("Privacy Policy")}`}
        </p>

        <section className="w-full flex items-center justify-center gap-4">
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
        </section>
        <p className="hidden text-nowrap text-md lg:block">{`© ${t("2025 Isaia. All rights reserved.")}`}</p>
      </section>
    </footer>
  );
}

export default Footer;
