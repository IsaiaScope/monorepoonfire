import { Toaster } from "@package/shadcn";
// import { cn } from "@package/utility/tailwind";
import { UIWrapper } from "@package/ui";
import { useDarkMode } from "@package/utility/provider";

import { BackgroundLines } from "./component/background-lines";
import ContactForm from "./component/contact-form";

function Contact() {
  const { theme } = useDarkMode();
  return (
    <UIWrapper tag="section" className="relative grow scroll-mt-16 max-w-screen-xl w-full mx-auto px-6  py-10 mt-16 grid place-content-center">
      <BackgroundLines>
        <div className="relative z-10">
          <ContactForm />
        </div>
      </BackgroundLines>
      <Toaster closeButton richColors theme={theme} position="bottom-right" />
    </UIWrapper>
  );
}

export default Contact;
