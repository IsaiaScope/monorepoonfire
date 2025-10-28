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
      {/* Homepage - strongest SEO signals for personal name searches */}
      <title>Isaia Riva Portfolio</title>
      <meta name="description" content="Isaia Riva (Riva Isaia) - Senior Front End Developer specializing in React, TypeScript, and modern web technologies. Portfolio of projects, work experience, and skills." />
      <link rel="canonical" href="https://www.isaiariva.com/" />

      <Hero />
      <About />
      <Work />
      <Projects />
    </>
  );
}
