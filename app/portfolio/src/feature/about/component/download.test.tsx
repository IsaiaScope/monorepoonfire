import { render, screen } from "../../../test/set-up-test";
import Download from "./download";

describe("download component", () => {
  it("should render download button with text", () => {
    render(<Download />);

    expect(screen.getByText("Download")).toBeInTheDocument();
    expect(screen.getByRole("link")).toBeInTheDocument();
  });

  it("should render download icon", () => {
    render(<Download />);

    // Check for the download icon (Lucide icon renders as svg)
    const svgIcon = document.querySelector("svg");
    expect(svgIcon).toBeInTheDocument();
  });
});
