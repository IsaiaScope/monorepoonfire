import { render, screen } from "@testing-library/react";

import Header from "./header";

describe("header component", () => {
  it("renders the header with navigation links", () => {
    render(<Header />);
    const headerElement = screen.getByRole("button", {
      name: "Ciao",
    });
    expect(headerElement).toBeInTheDocument();
  });
});
