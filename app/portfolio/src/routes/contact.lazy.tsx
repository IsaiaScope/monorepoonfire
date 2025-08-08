import { createLazyFileRoute } from "@tanstack/react-router";

import Contact from "../feature/contact/contact";

export const Route = createLazyFileRoute("/contact")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Contact />
  );
}
