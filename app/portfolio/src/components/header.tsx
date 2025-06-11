// import { Link } from "@tanstack/react-router";

import { useTranslation } from "react-i18next";

export default function Header() {
  const { t } = useTranslation();
  return (
    <header className="">
      <nav className="bg-accent">
        <button type="button">{t("work")}</button>
        <button type="button">Ciao</button>
      </nav>
    </header>
  );
}
