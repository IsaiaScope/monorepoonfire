import type { ErrorComponentProps } from "@tanstack/react-router";
import type { FallbackProps } from "react-error-boundary";

import { Button } from "@package/shadcn";
import { Globe, Route } from "lucide-react";

import UIWrapper from "../wrapper/wrapper";

type From = "boundary" | "router";

type ErrorProps = {
  from: From;
  errorData: FallbackProps | ErrorComponentProps;
};

function isErrorFromBoundary(from: From, errorData: FallbackProps | ErrorComponentProps): errorData is FallbackProps {
  return !!(errorData && from === "boundary");
}

function isErrorFromRouter(from: From, errorData: FallbackProps | ErrorComponentProps): errorData is ErrorComponentProps {
  return !!(errorData && from === "router");
}

function UIErrorWrapper({ children }: { children: React.ReactNode }) {
  return (
    <UIWrapper tag="main" variant="primary" className="z-100 bg-foreground flex flex-col items-center justify-center gap-10">
      <h1 className=" text-9xl font-extrabold text-primary tracking-widest">404</h1>
      <div className="bg-primary-foreground text-primary px-2 text-sm rounded rotate-12 absolute">
        Page Not Found
      </div>
      {children}
    </UIWrapper>
  );
}

function UIError({ from, errorData }: ErrorProps) {
  if (isErrorFromBoundary(from, errorData)) {
    const { error, resetErrorBoundary } = errorData;

    console.error("[Boundary Error]:", { message: error.message, stack: error.stack });

    return (
      <UIErrorWrapper>
        <Button size="lg" onClick={resetErrorBoundary}>
          <Globe />
          Reset
        </Button>
      </UIErrorWrapper>
    );
  }

  if (isErrorFromRouter(from, errorData)) {
    const { error, info, reset } = errorData;

    console.error("[Router Error]:", { message: error.message, stack: info?.componentStack });

    return (
      <UIErrorWrapper>
        <Button size="lg" onClick={reset}>
          <Route />
          Reset
        </Button>
      </UIErrorWrapper>

    );
  }
}

export function UIBoundaryError(error: FallbackProps) {
  return <UIError from="boundary" errorData={error} />;
}

export function UIRouterError(error: ErrorComponentProps) {
  return <UIError from="router" errorData={error} />;
}
