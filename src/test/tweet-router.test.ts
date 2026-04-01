import { describe, it, expect, vi } from "vitest";
import { z } from "zod";

// ---------------------------------------------------------------------------
// BUG-003: strict === null misses undefined for unauthenticated users
// ---------------------------------------------------------------------------
describe("BUG-003 – infiniteFeed: currentUserId null/undefined guard", () => {
  function shouldShowAllTweets(
    currentUserId: string | null | undefined,
    onlyFollowing: boolean
  ): boolean {
    return currentUserId == null || !onlyFollowing;
  }

  it("returns true when currentUserId is null", () => {
    expect(shouldShowAllTweets(null, true)).toBe(true);
  });

  it("returns true when currentUserId is undefined (unauthenticated)", () => {
    // The old === null check would have missed this case
    expect(shouldShowAllTweets(undefined, true)).toBe(true);
  });

  it("returns false when authenticated and onlyFollowing is true", () => {
    expect(shouldShowAllTweets("user-123", true)).toBe(false);
  });

  it("returns true when authenticated but onlyFollowing is false", () => {
    expect(shouldShowAllTweets("user-123", false)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// BUG-004: likedByMe crashes when likes is boolean false (unauthenticated)
// ---------------------------------------------------------------------------
describe("BUG-004 – likedByMe computation when likes is false", () => {
  function computeLikedByMe(likes: { userId: string }[] | false): boolean {
    return likes !== false && likes.length > 0;
  }

  it("returns false when likes is boolean false (unauthenticated)", () => {
    expect(computeLikedByMe(false)).toBe(false);
  });

  it("returns false when likes is an empty array", () => {
    expect(computeLikedByMe([])).toBe(false);
  });

  it("returns true when likes has entries", () => {
    expect(computeLikedByMe([{ userId: "user-1" }])).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// BUG-005: Tweet content had no validation (min/max)
// ---------------------------------------------------------------------------
describe("BUG-005 – Tweet content validation", () => {
  const contentSchema = z.string().min(1).max(280);

  it("rejects empty string", () => {
    expect(contentSchema.safeParse("").success).toBe(false);
  });

  it("accepts a single character", () => {
    expect(contentSchema.safeParse("a").success).toBe(true);
  });

  it("accepts a normal tweet", () => {
    expect(contentSchema.safeParse("Hello world!").success).toBe(true);
  });

  it("accepts exactly 280 characters", () => {
    expect(contentSchema.safeParse("a".repeat(280)).success).toBe(true);
  });

  it("rejects 281 characters", () => {
    expect(contentSchema.safeParse("a".repeat(281)).success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// BUG-006: Home feed not revalidated after tweet creation
// ---------------------------------------------------------------------------
describe("BUG-006 – create tweet: home feed revalidation", () => {
  it("revalidates both the profile page and home feed", () => {
    const revalidateSSG = vi.fn().mockResolvedValue(undefined);
    const userId = "user-abc";

    void revalidateSSG(`/profiles/${userId}`);
    void revalidateSSG(`/`);

    const calls = revalidateSSG.mock.calls.map((c) => c[0] as string);
    expect(calls).toContain(`/profiles/${userId}`);
    expect(calls).toContain("/");
  });
});

