import { Button, Separator, Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@package/shadcn";
import { UIDarkModeSwitch, UILanguageSelector, UILink } from "@package/ui";
import { PACKAGE_UTILITY } from "@package/utility/constant";
import { ObjectKeys } from "@package/utility/javascript";
import { cn } from "@package/utility/tailwind";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";

import type { Language } from "../constant/language";

import { APP_PORTFOLIO } from "../constant";
import { createSectionHref } from "../utility/create-section-id";

type NavbarLinkProps = {
  children: React.ReactNode;
}
& React.AnchorHTMLAttributes<HTMLAnchorElement>;

function NavbarDarkModeSwitch() {
  const { t } = useTranslation();

  return (
    <div className="animate-in fade-in zoom-in duration-300">
      <UIDarkModeSwitch
        darkLabel={t("Dark")}
        lightLabel={t("Light")}
        screenReaderLabel={t("Toggle dark mode")}
      />
    </div>
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
        return t("English");
      case APP_PORTFOLIO.LANGUAGE["it-IT"]:
        return t("Italian");
    }
  }, [t]);

  const _languages = useMemo(() =>
    ObjectKeys(APP_PORTFOLIO.LANGUAGE).map(lang => ({
      code: lang,
      label: getLabel(lang),
    })), [getLabel]);

  return (
    <div className="animate-in fade-in zoom-in duration-300">
      <UILanguageSelector<Language>
        value={language}
        onValueChange={changeLanguage}
        languages={_languages}
        ariaLabel={t("Languages Menu")}
      />
    </div>
  );
}

function NavbarLink({ className, children, href }: NavbarLinkProps) {
  return (
    <Button
      asChild
      variant="link"
      className="animate-in fade-in zoom-in duration-300 text-secondary-foreground"
    >
      <UILink
        href={href}
        target="_parent"

        className={cn("cursor-pointer", className)}
      >
        {children}
      </UILink>

    </Button>
  );
};

function NavbarMobile({ isHome }: { isHome: boolean }) {
  const { t } = useTranslation();
  return (
    <>
      {isHome
        ? (
            <NavbarLink
              href={createSectionHref(t("Home"))}
              className="text-2xl font-bold font-LibreFranklin"
            >
              {t("Home")}
            </NavbarLink>
          )
        : (
            <Button
              asChild
              variant="link"
              className="text-2xl font-bold animate-in fade-in zoom-in duration-300 text-secondary-foreground font-LibreFranklin"
            >
              <Link to="/" aria-label={t("Back to Home")}>
                {t("Home")}
              </Link>
            </Button>
          )}
      <section className="inline-flex gap-2">
        <NavbarLanguageSelector />
        <NavbarDarkModeSwitch />
        {isHome
          ? (

              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    className="ml-auto p-1 animate-in fade-in zoom-in duration-300"
                    size="icon"
                    variant="outline"
                    aria-label={t("Navigation Menu")}
                  >
                    <Menu />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader className="mb-2">
                    <SheetTitle>{t("Menu")}</SheetTitle>
                    <SheetDescription className="sr-only">
                      {t("This is the menu for the app. Use the links below to navigate")}
                    </SheetDescription>

                  </SheetHeader>
                  <div className="p-4 grid">

                    <NavbarLink
                      href={createSectionHref(t("About"))}
                    >
                      {t("About")}
                    </NavbarLink>
                    <Separator className="my-2" />
                    <NavbarLink href={createSectionHref(t("Work"))}>
                      {t("Work")}
                    </NavbarLink>
                    <Separator className="my-2" />
                    <NavbarLink href={createSectionHref(t("Projects"))}>
                      {t("Projects")}
                    </NavbarLink>
                    <Separator className="my-2" />
                    <Button
                      asChild
                      variant="link"
                      className="animate-in fade-in zoom-in duration-300 text-secondary-foreground"
                    >
                      <Link to="/contact">
                        {t("Contact")}
                      </Link>
                    </Button>
                    <Separator className="my-2" />
                  </div>
                </SheetContent>
              </Sheet>
            )
          : null}
      </section>
    </>
  );
}

function NavbarDesktop({ isHome }: { isHome: boolean }) {
  const { t } = useTranslation();

  return (
    <>
      {isHome
        ? (
            <NavbarLink
              href={createSectionHref(t("Home"))}
              className="text-2xl font-bold font-LibreFranklin"
            >
              {t("Home")}
            </NavbarLink>
          )
        : (
            <Button
              asChild
              variant="link"
              className="text-2xl font-bold animate-in fade-in zoom-in duration-300 text-secondary-foreground font-LibreFranklin"
            >
              <Link to="/" aria-label={t("Back to Home")}>
                {t("Home")}
              </Link>
            </Button>
          )}
      <section className="inline-flex gap-4">
        {isHome
          ? (
              <NavbarLink
                href={createSectionHref(t("About"))}
              >
                {t("About")}
              </NavbarLink>
            )
          : null}
        {isHome
          ? (
              <NavbarLink href={createSectionHref(t("Work"))}>
                {t("Work")}
              </NavbarLink>
            )
          : null}
        {isHome
          ? (
              <NavbarLink href={createSectionHref(t("Projects"))}>
                {t("Projects")}
              </NavbarLink>
            )
          : null}
        {isHome
          ? (
              <Button
                asChild
                variant="link"
                className="animate-in fade-in zoom-in duration-300 text-secondary-foreground"
              >
                <Link to="/contact">
                  {t("Contact")}
                </Link>
              </Button>
            )
          : null}
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
  const isHome = useLocation().pathname === "/";

  return (
    <header className="z-20 fixed w-full backdrop-blur-md bg-secondary/80">

      <nav
        className={cn(
          " flex w-full h-16 items-center justify-between max-w-screen-xl mx-auto pl-2 pr-6 py-3",
          className,
        )}
      >

        {isBiggerThanLarge ? <NavbarDesktop isHome={isHome} /> : <NavbarMobile isHome={isHome} /> }
      </nav>
    </header>
  );
}
