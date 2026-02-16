import { render, screen } from "../../../test/set-up-test";
import Download from "./download";

describe("download component", () => {
  it("should render download button with text", async () => {
    render(<Download />);

    expect(await screen.findByText("Download")).toBeInTheDocument();
    expect(screen.getByRole("link")).toBeInTheDocument();
  });

  it("should render download icon", async () => {
    render(<Download />);

    await screen.findByText("Download");
    const svgIcon = document.querySelector("svg");
    expect(svgIcon).toBeInTheDocument();
  });
});
