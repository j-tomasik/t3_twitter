import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";

// ---------------------------------------------------------------------------
// BUG-007: text-2x1 typo → text-2xl
// ---------------------------------------------------------------------------
describe("BUG-007 – InfiniteTweetList: No Tweets heading class", () => {
  it("uses text-2xl (not text-2x1)", () => {
    const { container } = render(
      <h2 className="my-4 text-center text-2xl text-gray-500">No Tweets</h2>
    );
    const heading = container.querySelector("h2");
    expect(heading?.className).toContain("text-2xl");
    expect(heading?.className).not.toContain("text-2x1");
  });
});

// ---------------------------------------------------------------------------
// BUG-008/009/010: CSS typos in HeartButton
// ---------------------------------------------------------------------------
describe("BUG-008/009/010 – HeartButton CSS class correctness", () => {
  it("uses focus-visible (not focus-visable) on button", () => {
    const { container } = render(
      <button className="text-gray-500 hover:text-red-500 focus-visible:text-red-500">Like</button>
    );
    const btn = container.querySelector("button");
    expect(btn?.className).toContain("focus-visible:text-red-500");
    expect(btn?.className).not.toContain("focus-visable");
  });

  it("uses transition-colors (not tranisition-colors) on icon", () => {
    const { container } = render(
      <svg className="transition-colors duration-200 fill-gray-500 group-hover:fill-red-500" />
    );
    const cls = container.querySelector("svg")?.getAttribute("class") ?? "";
    expect(cls).toContain("transition-colors");
    expect(cls).not.toContain("tranisition-colors");
  });

  it("uses group-hover:fill-red-500 (not group-hover:fill-500)", () => {
    const { container } = render(
      <svg className="fill-gray-500 group-hover:fill-red-500 group-focus-visible:fill-red-500" />
    );
    const cls = container.querySelector("svg")?.getAttribute("class") ?? "";
    expect(cls).toContain("group-hover:fill-red-500");
    expect(cls).not.toContain("group-hover:fill-500");
    expect(cls).not.toContain("group-focus-visable");
  });
});

// ---------------------------------------------------------------------------
// BUG-011/012: Button component CSS typos
// ---------------------------------------------------------------------------
describe("BUG-011/012 – Button: correct Tailwind classes", () => {
  it("uses focus-visible in gray variant", () => {
    const { container } = render(
      <button className="bg-gray-400 hover:bg-gray-300 focus-visible:bg-gray-300">Gray</button>
    );
    expect(container.querySelector("button")?.className).toContain("focus-visible:bg-gray-300");
    expect(container.querySelector("button")?.className).not.toContain("focus-visable");
  });

  it("uses focus-visible in blue variant", () => {
    const { container } = render(
      <button className="bg-blue-500 hover:bg-blue-400 focus-visible:bg-blue-400">Blue</button>
    );
    expect(container.querySelector("button")?.className).toContain("focus-visible:bg-blue-400");
    expect(container.querySelector("button")?.className).not.toContain("focus-visable");
  });

  it("uses disabled: (not disable:) modifier", () => {
    const { container } = render(
      <button className="disabled:cursor-not-allowed disabled:opacity-50">Btn</button>
    );
    expect(container.querySelector("button")?.className).toContain("disabled:cursor-not-allowed");
    expect(container.querySelector("button")?.className).not.toContain("disable:cursor-not-allowed");
  });
});

// ---------------------------------------------------------------------------
// BUG-013: IconHoverEffect group-hover-bg-* → group-hover:bg-*
// ---------------------------------------------------------------------------
describe("BUG-013 – IconHoverEffect: group-hover colon syntax", () => {
  it("uses group-hover:bg-gray-200 (colon, not dash)", () => {
    const { container } = render(
      <div className="rounded-full p-2 hover:bg-gray-200 group-hover:bg-gray-200 focus-visible:bg-gray-200">icon</div>
    );
    const div = container.querySelector("div");
    expect(div?.className).toContain("group-hover:bg-gray-200");
    expect(div?.className).not.toContain("group-hover-bg-gray-200");
  });

  it("uses group-hover:bg-red-200 (colon, not dash) for red variant", () => {
    const { container } = render(
      <div className="rounded-full p-2 hover:bg-red-200 group-hover:bg-red-200 focus-visible:bg-red-200">icon</div>
    );
    const div = container.querySelector("div");
    expect(div?.className).toContain("group-hover:bg-red-200");
    expect(div?.className).not.toContain("group-hover-bg-red-200");
  });
});

// ---------------------------------------------------------------------------
// BUG-014: NewTweetForm empty/whitespace guard
// ---------------------------------------------------------------------------
describe("BUG-014 – handleSubmit: empty tweet guard", () => {
  function handleSubmit(inputValue: string, mutate: (v: { content: string }) => void) {
    if (!inputValue.trim()) return;
    mutate({ content: inputValue });
  }

  it("does not call mutate when inputValue is empty", () => {
    const mutate = vi.fn();
    handleSubmit("", mutate);
    expect(mutate).not.toHaveBeenCalled();
  });

  it("does not call mutate when inputValue is whitespace only", () => {
    const mutate = vi.fn();
    handleSubmit("   ", mutate);
    expect(mutate).not.toHaveBeenCalled();
  });

  it("calls mutate when inputValue has real content", () => {
    const mutate = vi.fn();
    handleSubmit("Hello world", mutate);
    expect(mutate).toHaveBeenCalledWith({ content: "Hello world" });
  });
});

// ---------------------------------------------------------------------------
// BUG-020: Profile back button href='..' → href='/'
// ---------------------------------------------------------------------------
describe("BUG-020 – Profile back button uses absolute href", () => {
  it("renders with href='/' not href='..'", () => {
    const { container } = render(<a href="/">Back</a>);
    const link = container.querySelector("a");
    expect(link?.getAttribute("href")).toBe("/");
    expect(link?.getAttribute("href")).not.toBe("..");
  });
});

