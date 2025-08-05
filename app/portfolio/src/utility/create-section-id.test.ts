import { createSectionHref, createSectionId } from "./create-section-id";

describe("createSectionId utility", () => {
  it("handles English section names without spaces", () => {
    expect(createSectionId("About")).toBe("About");
    expect(createSectionId("Work")).toBe("Work");
    expect(createSectionId("Projects")).toBe("Projects");
  });

  it("handles Italian section names with spaces", () => {
    expect(createSectionId("Chi sono")).toBe("Chi-sono");
    expect(createSectionId("Work Experience")).toBe("Work-Experience");
  });

  it("handles multiple spaces and special characters", () => {
    expect(createSectionId("Multiple   Spaces")).toBe("Multiple-Spaces");
    expect(createSectionId("Special@Characters#")).toBe("SpecialCharacters");
    expect(createSectionId("  Leading and trailing  ")).toBe("Leading-and-trailing");
  });

  it("handles empty and edge cases", () => {
    expect(createSectionId("")).toBe("");
    expect(createSectionId("   ")).toBe("");
    expect(createSectionId("Single")).toBe("Single");
  });
});

describe("createSectionHref utility", () => {
  it("creates proper anchor links", () => {
    expect(createSectionHref("About")).toBe("#About");
    expect(createSectionHref("Chi sono")).toBe("#Chi-sono");
    expect(createSectionHref("Work Experience")).toBe("#Work-Experience");
  });

  it("handles edge cases", () => {
    expect(createSectionHref("")).toBe("#");
    expect(createSectionHref("Single")).toBe("#Single");
  });
});
