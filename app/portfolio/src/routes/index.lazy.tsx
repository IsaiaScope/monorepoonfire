import { createLazyFileRoute } from "@tanstack/react-router";

import About from "../feature/about/about";
import Hero from "../feature/hero/hero";
import Projects from "../feature/projects/projects";
import Work from "../feature/work/work";

export const Route = createLazyFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <About />
      <Work />
      <Projects />
    </>
  );
}
