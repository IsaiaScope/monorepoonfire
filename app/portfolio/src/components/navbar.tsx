import { Button, Separator, Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@package/shadcn";
import { UIDarkModeSwitch, UILanguageSelector, UILink } from "@package/ui";
import { PACKAGE_UTILITY } from "@package/utility/constant";
import { ObjectKeys } from "@package/utility/object";
import { cn } from "@package/utility/tailwind";
import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";

import type { Language } from "../constant/language";

import { APP_PORTFOLIO } from "../constant";

type NavbarLinkProps = {
  children: React.ReactNode;
}
& React.AnchorHTMLAttributes<HTMLAnchorElement>;

function NavbarDarkModeSwitch() {
  const { t } = useTranslation();

  return (
    <UIDarkModeSwitch

      darkLabel={t("dark mode label")}
      lightLabel={t("light mode label")}
      screenReaderLabel={t("dark mode screen reader label")}
    />
  );
}

function NavbarLanguageSelector() {
  const { t, i18n: {
    language,
    changeLanguage,
  } } = useTranslation();

  const getLabel = useCallback((lang: Language) => {
    switch (lang) {
      case APP_PORTFOLIO.LANGUAGE["en-GB"]:
        return t("english");
      case APP_PORTFOLIO.LANGUAGE["it-IT"]:
        return t("italian");
    }
  }, [t]);

  const _languages = useMemo(() =>
    ObjectKeys(APP_PORTFOLIO.LANGUAGE).map(lang => ({
      code: lang,
      label: getLabel(lang),
    })), [getLabel]);

  return (
    <UILanguageSelector<Language>
      value={language}
      onValueChange={changeLanguage}
      languages={_languages}
    />
  );
}

function NavbarLink({ className, children, href }: NavbarLinkProps) {
  return (
    <Button
      asChild
      variant="link"

    >
      <UILink href={href} className={cn("cursor-pointer", className)}>
        {children}
      </UILink>

    </Button>
  );
};

function NavbarMobile() {
  const { t } = useTranslation();
  return (
    <>
      <NavbarLink className="text-lg">
        {t("home")}
      </NavbarLink>

      <section className="inline-flex gap-2">
        <NavbarLanguageSelector />
        <NavbarDarkModeSwitch />
        <Sheet>
          <SheetTrigger asChild>
            <Button className="ml-auto p-1" size="icon" variant="ghost">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader className="mb-2">
              <SheetTitle>{t("menu")}</SheetTitle>
              <SheetDescription className="sr-only">
                {t("menu description")}
              </SheetDescription>

            </SheetHeader>
            <div className="p-4 grid">

              <NavbarLink>
                {t("about")}
              </NavbarLink>
              <Separator className="my-2" />
              <NavbarLink>
                {t("work")}
              </NavbarLink>
              <Separator className="my-2" />
              <Button
                asChild
                variant="link"
              >
                <Link to="/contact">
                  {t("contact")}
                </Link>
              </Button>
              <Separator className="my-2" />
            </div>
          </SheetContent>
        </Sheet>
      </section>

    </>
  );
}

function NavbarDesktop() {
  const { t } = useTranslation();
  return (
    <>
      <NavbarLink className="text-lg">
        {t("home")}
      </NavbarLink>
      <section className="inline-flex gap-4">
        <NavbarLink>
          {t("about")}
        </NavbarLink>
        <NavbarLink>
          {t("work")}
        </NavbarLink>
        <Button
          asChild
          variant="link"
        >
          <Link to="/contact">
            {t("contact")}
          </Link>
        </Button>
        <NavbarLanguageSelector />
        <NavbarDarkModeSwitch />
      </section>
    </>
  );
}

export default function Navbar({ className }: { className?: string }) {
  const isBiggerThanLarge = useMediaQuery({
    minWidth: PACKAGE_UTILITY.MEDIA_QUERY.LG,
  });

  return (
    <header>

      <nav
        className={cn(
          "p-3 flex w-full items-center justify-between shadow-sm shadow-primary-foreground",
          className,
        )}
      >

        {isBiggerThanLarge ? <NavbarDesktop /> : <NavbarMobile /> }
      </nav>
    </header>
  );
}
