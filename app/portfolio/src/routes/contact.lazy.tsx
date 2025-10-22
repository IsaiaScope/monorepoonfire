import { createLazyFileRoute } from "@tanstack/react-router";

import Contact from "../feature/contact/contact";

export const Route = createLazyFileRoute("/contact")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      {/* Contact page - override only what's different from homepage */}
      <title>Contact Isaia Riva</title>
      <meta name="description" content="Contact Isaia Riva (Riva Isaia), Senior Front End Developer. Get in touch for collaboration opportunities, freelance projects, or professional inquiries." />
      <link rel="canonical" href="https://www.isaiariva.com/contact" />
      <Contact />
    </>
  );
}
