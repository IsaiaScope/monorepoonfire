import { createFileRoute } from "@tanstack/react-router";

import Hero from "../components/hero";

// import logo from "../logo.svg";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  // const { t } = useTranslation();
  return (
    <Hero />

  // <div className="text-center">
  //   <Button
  //     onClick={() => {
  //       // console.log("TEST");
  //     }}
  //     className="mt-4 animate-in fade-in zoom-in"
  //     variant="link"
  //   >
  //     TEST
  //   </Button>
  //   {/* <img
  //     src={logo}
  //     className="h-[40vmin] pointer-events-none animate-[spin_20s_linear_infinite]"
  //     alt="logo"
  //   /> */}
  //   <p>
  //     {t("home")}
  //     {" "}
  //     <code>src/routes/index.tsx</code>
  //     {" "}
  //     and save to reload.
  //   </p>
  //   <a
  //     className="text-[#61dafb] hover:underline"
  //     href="https://reactjs.org"
  //     target="_blank"
  //     rel="noopener noreferrer"
  //   >
  //     Learn React
  //   </a>
  //   <a
  //     className="text-[#61dafb] hover:underline"
  //     href="https://tanstack.com"
  //     target="_blank"
  //     rel="noopener noreferrer"
  //   >
  //     Learn TanStack
  //     {/* <Navigate to="/demo/tanstack-query" /> */}
  //   </a>
  // </div>
  );
}
