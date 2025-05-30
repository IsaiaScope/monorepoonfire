import { render, screen } from "@testing-library/react";

import Header from "./header";

// Mock the Link component from @tanstack/react-router

describe("header component", () => {
  it("renders the header with navigation links", () => {
    render(<Header />);
    const headerElement = screen.getByRole("button", {
      name: "Ciao",
    });
    expect(headerElement).toBeInTheDocument();
  });
});
