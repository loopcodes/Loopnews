import { useState} from "react";
import type {ReactNode } from "react"
import { BookmarksContext } from "../types/BookmarksProvider";
import type {BookmarkArticle} from "../types/BookmarksProvider"

export const BookmarksProvider = ({ children }: { children: ReactNode }) => {
  const [bookmarks, setBookmarks] = useState<BookmarkArticle[]>(() => {
    try {
      const stored = localStorage.getItem("bookmarks");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const toggleBookmark = (article: BookmarkArticle) => {
    const exists = bookmarks.some((b) => b.url === article.url);

    const updated = exists
      ? bookmarks.filter((b) => b.url !== article.url)
      : [...bookmarks, article];

    setBookmarks(updated);
    localStorage.setItem("bookmarks", JSON.stringify(updated));
  };

  const isBookmarked = (url: string) => bookmarks.some((b) => b.url === url);

  return (
    <BookmarksContext.Provider value={{ bookmarks, toggleBookmark, isBookmarked }}>
      {children}
    </BookmarksContext.Provider>
  );
};
export { BookmarksContext, type BookmarkArticle };

