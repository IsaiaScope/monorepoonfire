import { Toaster } from "@package/shadcn";
// import { cn } from "@package/utility/tailwind";
import { UIWrapper } from "@package/ui";
import { useDarkMode } from "@package/utility/provider";

import AnimatedImages from "./component/animated-images";
import { BackgroundLines } from "./component/background-lines";
import ContactForm from "./component/contact-form";

function Contact() {
  const { theme } = useDarkMode();

  const images = [{
    src: "/assets/me-0.jpg",
  }, {
    src: "/assets/me-1.jpg",
  }, {
    src: "/assets/me-2.jpg",
  }, {
    src: "/assets/me-3.jpg",
  }, {
    src: "/assets/me-4.jpg",
  }, {
    src: "/assets/me-5.jpg",
  }];

  return (
    <UIWrapper tag="section" className="relative grow scroll-mt-16 max-w-screen-xl w-full mx-auto px-6 py-10 mt-16 grid place-content-center">
      <BackgroundLines>
        <div className="relative z-10  flex flex-col-reverse gap-10 lg:gap-0 justify-center lg:grid lg:grid-cols-2 ">
          <ContactForm />
          <AnimatedImages images={images} autoplay />
        </div>
      </BackgroundLines>
      <Toaster closeButton richColors theme={theme} position="bottom-right" />
    </UIWrapper>
  );
}

export default Contact;
