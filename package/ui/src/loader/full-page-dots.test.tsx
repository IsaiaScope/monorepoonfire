import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it } from "vitest";

import UIFullPageDotsLoaderOnFire from "./full-page-dots";

describe("fullPageDotsLoaderOnFire", () => {
  it("renders the correct number of dots and the correct srLabel", () => {
    const dotsCount = 5;
    const srLabel = "[test] srLabel";

    render(
      <UIFullPageDotsLoaderOnFire dotsCount={dotsCount} srLabel={srLabel} />,
    );

    const dots = screen.getAllByTestId("dot");
    expect(dots).toHaveLength(dotsCount);

    const span = screen.getByText(srLabel);
    expect(span).toBeInTheDocument();
  });
});
