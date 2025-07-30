import { createFileRoute } from "@tanstack/react-router";

import About from "../feature/about/about";
import Hero from "../feature/hero/hero";
import Projects from "../feature/projects/projects";
import Work from "../feature/work/work";

// import logo from "../logo.svg";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  // const { t } = useTranslation();
  return (
    <>
      <Hero />
      <About />
      <Work />
      <Projects />
    </>
  );
}
