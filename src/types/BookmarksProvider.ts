import { createContext } from "react";

export type BookmarkArticle = {
  title: string;
  url: string;
  urlToImage?: string;
  description?: string;
  source?: { name?: string };
};

export type BookmarksContextType = {
  bookmarks: BookmarkArticle[];
  toggleBookmark: (article: BookmarkArticle) => void;
  isBookmarked: (url: string) => boolean;
};

export const BookmarksContext = createContext<BookmarksContextType>({
  bookmarks: [],
  toggleBookmark: () => {},
  isBookmarked: () => false,
});
