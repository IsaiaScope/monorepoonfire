import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it, vi } from "vitest";

import UIImage from "./image";

describe("uIImage component", () => {
  // Test basic image rendering with required src attribute
  it("renders simple img element with src and alt", () => {
    const testSrc = "https://example.com/image.jpg";
    render(<UIImage src={testSrc} alt="Test image" />);

    const image = screen.getByRole("img");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", testSrc);
    expect(image).toHaveAttribute("alt", "Test image");
  });

  // Test that without sources, it renders a simple img element
  it("renders simple img element when no sources provided", () => {
    render(<UIImage src="/test/image.png" alt="PNG image" />);

    // Should render a simple img element, not picture
    const picture = document.querySelector("picture");
    expect(picture).not.toBeInTheDocument();

    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src", "/test/image.png");
    expect(image).toHaveAttribute("alt", "PNG image");
  });

  // Test with custom sources - should render picture element
  it("renders picture element with custom sources", () => {
    const customSources = [
      { srcset: "/test/image.webp", type: "image/webp" },
      { srcset: "/test/image.jpg", type: "image/jpeg" },
    ];

    render(
      <UIImage
        src="/test/image.jpg"
        alt="Custom sources image"
        sources={customSources}
      />,
    );

    // Should render a picture element
    const picture = document.querySelector("picture");
    expect(picture).toBeInTheDocument();

    // Should have the custom sources
    const sources = document.querySelectorAll("source");
    expect(sources).toHaveLength(2);
    expect(sources[0]).toHaveAttribute("srcset", "/test/image.webp");
    expect(sources[0]).toHaveAttribute("type", "image/webp");
    expect(sources[1]).toHaveAttribute("srcset", "/test/image.jpg");
    expect(sources[1]).toHaveAttribute("type", "image/jpeg");

    // Fallback img should have the original src
    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src", "/test/image.jpg");
  });

  // Test that images are lazy loaded by default
  it("applies lazy loading by default", () => {
    render(<UIImage src="test.jpg" alt="Lazy image" />);

    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("loading", "lazy");
  });

  // Test custom className application
  it("applies custom className", () => {
    render(
      <UIImage
        src="test.jpg"
        alt="Styled image"
        className="custom-image-class"
      />,
    );

    const image = screen.getByRole("img");
    expect(image).toHaveClass("custom-image-class");
  });

  // Test with empty sources array - should render simple img
  it("renders simple img when sources is empty array", () => {
    render(<UIImage src="/test/image.jpg" alt="Empty sources" sources={[]} />);

    const picture = document.querySelector("picture");
    expect(picture).not.toBeInTheDocument();

    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src", "/test/image.jpg");
  });

  // Test loading state initially
  it("shows loading state initially", () => {
    render(<UIImage src="test.jpg" alt="Loading image" />);

    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("data-loading", "true");
    expect(image).toHaveAttribute("data-error", "false");
  });

  // Test error handling
  it("shows error state on image load failure", () => {
    render(<UIImage src="broken-image.jpg" alt="Broken image" />);

    const image = screen.getByRole("img");

    // Simulate image load error
    fireEvent.error(image);

    expect(image).toHaveAttribute("data-error", "true");
    expect(image).toHaveAttribute("data-loading", "false");
  });

  // Test successful load handling
  it("shows loaded state on successful image load", () => {
    render(<UIImage src="valid-image.jpg" alt="Valid image" />);

    const image = screen.getByRole("img");

    // Simulate successful image load
    fireEvent.load(image);

    expect(image).toHaveAttribute("data-loading", "false");
    expect(image).toHaveAttribute("data-error", "false");
  });

  // Test onLoad callback
  it("calls onLoad callback when image loads successfully", () => {
    const onLoadMock = vi.fn();
    render(<UIImage src="valid-image.jpg" alt="Valid image" onLoad={onLoadMock} />);

    const image = screen.getByRole("img");
    fireEvent.load(image);

    expect(onLoadMock).toHaveBeenCalledTimes(1);
  });

  // Test onError callback
  it("calls onError callback when image fails to load", () => {
    const onErrorMock = vi.fn();
    render(<UIImage src="broken-image.jpg" alt="Broken image" onError={onErrorMock} />);

    const image = screen.getByRole("img");
    fireEvent.error(image);

    expect(onErrorMock).toHaveBeenCalledTimes(1);
  });

  // Test with source attributes - media, sizes
  it("renders source with media and sizes attributes", () => {
    const customSources = [
      {
        srcset: "/test/image-small.webp",
        type: "image/webp",
        media: "(max-width: 600px)",
        sizes: "100vw",
      },
      {
        srcset: "/test/image-large.webp",
        type: "image/webp",
        sizes: "50vw",
      },
    ];

    render(
      <UIImage
        src="/test/image.jpg"
        alt="Responsive image"
        sources={customSources}
      />,
    );

    const sources = document.querySelectorAll("source");
    expect(sources).toHaveLength(2);

    expect(sources[0]).toHaveAttribute("media", "(max-width: 600px)");
    expect(sources[0]).toHaveAttribute("sizes", "100vw");
    expect(sources[1]).toHaveAttribute("sizes", "50vw");
    expect(sources[1]).not.toHaveAttribute("media");
  });

  // Test that additional img props are passed through
  it("passes through additional img props", () => {
    render(
      <UIImage
        src="test.jpg"
        alt="Props test"
        width={200}
        height={100}
        draggable={false}
        data-testid="custom-image"
      />,
    );

    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("width", "200");
    expect(image).toHaveAttribute("height", "100");
    expect(image).toHaveAttribute("draggable", "false");
    expect(image).toHaveAttribute("data-testid", "custom-image");
  });
});
