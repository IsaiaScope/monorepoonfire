import { TanStackRouterDevtoolsInProd } from "@tanstack/react-router-devtools";

type Props = {
  children: React.ReactNode;
  showDevtool: boolean;
};

function TanstackRouterDevtoolsProvider({ children, showDevtool }: Props) {
  return (
    <>
      {children}
      {
        showDevtool
          ? (
              <TanStackRouterDevtoolsInProd />
            )
          : null
      }
    </>
  );
}

export default TanstackRouterDevtoolsProvider;
