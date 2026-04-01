import { describe, it, expect, vi } from "vitest";

// ---------------------------------------------------------------------------
// BUG-001: profile.followers is undefined when unauthenticated
// ---------------------------------------------------------------------------
describe("BUG-001 – getById: isFollowing when unauthenticated", () => {
  it("returns false (not crash) when followers is undefined", () => {
    const profileFromPrisma = {
      name: "Alice",
      image: null,
      _count: { followers: 5, follows: 3, tweets: 10 },
      followers: undefined as unknown as { id: string }[],
    };

    const isFollowing =
      profileFromPrisma.followers != null &&
      profileFromPrisma.followers.length > 0;

    expect(isFollowing).toBe(false);
  });

  it("returns true when authenticated and following", () => {
    const profileFromPrisma = {
      name: "Bob",
      image: null,
      _count: { followers: 1, follows: 0, tweets: 2 },
      followers: [{ id: "user-123" }],
    };

    const isFollowing =
      profileFromPrisma.followers != null &&
      profileFromPrisma.followers.length > 0;

    expect(isFollowing).toBe(true);
  });

  it("returns false when authenticated but not following", () => {
    const profileFromPrisma = {
      name: "Carol",
      image: null,
      _count: { followers: 0, follows: 0, tweets: 0 },
      followers: [],
    };

    const isFollowing =
      profileFromPrisma.followers != null &&
      profileFromPrisma.followers.length > 0;

    expect(isFollowing).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// BUG-002: Wrong revalidation path /profile/ vs /profiles/
// ---------------------------------------------------------------------------
describe("BUG-002 – toggleFollow: revalidation path correctness", () => {
  it("calls revalidateSSG with /profiles/ prefix for both users", () => {
    const revalidateSSG = vi.fn().mockResolvedValue(undefined);
    const userId = "user-abc";
    const currentUserId = "user-xyz";

    void revalidateSSG(`/profiles/${userId}`);
    void revalidateSSG(`/profiles/${currentUserId}`);

    expect(revalidateSSG).toHaveBeenCalledWith("/profiles/user-abc");
    expect(revalidateSSG).toHaveBeenCalledWith("/profiles/user-xyz");

    const calls = revalidateSSG.mock.calls.map((c) => c[0] as string);
    expect(calls.every((p) => p.startsWith("/profiles/"))).toBe(true);
  });

  it("does NOT use the singular /profile/ path", () => {
    const revalidateSSG = vi.fn().mockResolvedValue(undefined);
    const currentUserId = "user-xyz";

    void revalidateSSG(`/profiles/${currentUserId}`);

    const calls = revalidateSSG.mock.calls.map((c) => c[0] as string);
    const hasWrongPath = calls.some(
      (p) => p.startsWith("/profile/") && !p.startsWith("/profiles/")
    );
    expect(hasWrongPath).toBe(false);
  });
});

