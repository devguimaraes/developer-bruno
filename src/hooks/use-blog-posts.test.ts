import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useRecentPosts, useBlogPost } from "./use-blog-posts";
import * as blogLib from "@/lib/blog";

// Mock do módulo @/lib/blog
vi.mock("@/lib/blog", () => ({
  getRecentPosts: vi.fn(),
  getBlogPost: vi.fn(),
  invalidateBlogCache: vi.fn(),
}));

const mockPosts: blogLib.BlogPost[] = [
  { 
    id: "1", 
    slug: "post-1", 
    title: "Post 1", 
    date: "2024-01-01", 
    readTime: "1 min", 
    tags: ["Test"], 
    author: "Author Name", 
    excerpt: "Excerpt 1", 
    content: "Content 1" 
  },
];

describe("use-blog-posts hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useRecentPosts", () => {
    it("deve carregar posts recentes ao montar", async () => {
      vi.mocked(blogLib.getRecentPosts).mockResolvedValue(mockPosts);

      const { result } = renderHook(() => useRecentPosts(1));

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.posts).toEqual(mockPosts);
      expect(blogLib.getRecentPosts).toHaveBeenCalledWith(1);
    });

    it("deve lidar com erros ao carregar posts", async () => {
      const consoleSpacer = vi.spyOn(console, "error").mockImplementation(() => {});
      vi.mocked(blogLib.getRecentPosts).mockRejectedValue(new Error("API Error"));

      const { result } = renderHook(() => useRecentPosts());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.posts).toEqual([]);
      expect(consoleSpacer).toHaveBeenCalled();
      consoleSpacer.mockRestore();
    });

    it("deve responder ao evento de invalidação de cache", async () => {
      vi.mocked(blogLib.getRecentPosts).mockResolvedValue(mockPosts);
      const { result } = renderHook(() => useRecentPosts());

      await waitFor(() => expect(result.current.loading).toBe(false));
      
      await act(async () => {
        window.dispatchEvent(new Event("blog-cache-invalidated"));
        await waitFor(() => expect(result.current.loading).toBe(false));
      });

      expect(blogLib.invalidateBlogCache).toHaveBeenCalled();
      expect(blogLib.getRecentPosts).toHaveBeenCalledTimes(2);
    });
  });

  describe("useBlogPost", () => {
    it("deve carregar um post individual pelo slug", async () => {
      vi.mocked(blogLib.getBlogPost).mockResolvedValue(mockPosts[0]);

      const { result } = renderHook(() => useBlogPost("post-1"));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.post).toEqual(mockPosts[0]);
      expect(blogLib.getBlogPost).toHaveBeenCalledWith("post-1");
    });

    it("não deve carregar se o slug for vazio", () => {
      const { result } = renderHook(() => useBlogPost(""));
      expect(result.current.loading).toBe(true); // Loading inicial permanece true pois o effect retorna cedo
      expect(blogLib.getBlogPost).not.toHaveBeenCalled();
    });
  });
});
