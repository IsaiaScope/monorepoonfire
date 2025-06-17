import { Button, Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@package/shadcn";
import { UILink } from "@package/ui";
import { PACKAGE_UTILITY } from "@package/utility/constant";
import { cn } from "@package/utility/tailwind";
import { Menu } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";

type NavbarLinkProps = {
  children: React.ReactNode;
}
& React.AnchorHTMLAttributes<HTMLAnchorElement>;

function NavbarMobile() {
  return (
    <section className="flex flex-nowrap items-center justify-center">
      <Button
        asChild
        size="icon"
        variant="ghost"
        className="m-1 p-1 md:hidden md:p-2 [&.active]:hidden"
      >
      </Button>
      <Sheet>
        <SheetTrigger asChild>
          <Button className="ml-auto p-1" size="icon" variant="ghost">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader className="mb-2">
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription className="sr-only">
              This is the menu for the app. Use the links below to navigate.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </section>
  );
}

function NavbarDesktopLink({ children, href }: NavbarLinkProps) {
  return (
    <Button
      asChild
      variant="link"
    >
      <UILink href={href}>
        {children}
      </UILink>

    </Button>
  );
};

function NavbarDesktop() {
  const { t } = useTranslation();
  return (
    <NavbarDesktopLink>
      {t("home")}
    </NavbarDesktopLink>
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
          "",
          className,
        )}
      >

        {isBiggerThanLarge ? <NavbarMobile /> : <NavbarDesktop /> }
      </nav>
    </header>
  );
}
