import { useContext, useEffect, useState } from "react";
import { BookmarksContext } from "../context/BookmarksContext";
import NewsCard from "../components/NewsCard";
import type { BookmarkArticle } from "../context/BookmarksContext";

const skeletons = Array.from({ length: 8 });

const Bookmarks = () => {
  const { bookmarks } = useContext(BookmarksContext);
  const [loading, setLoading] = useState<boolean>(true);
  const [displayBookmarks, setDisplayBookmarks] = useState<BookmarkArticle[]>(
    []
  );

  useEffect(() => {
    // Simulate async loading (like fetching from localStorage)
    const timeout = setTimeout(() => {
      setDisplayBookmarks(bookmarks);
      setLoading(false);
    }, 500); // optional small delay for visual effect

    return () => clearTimeout(timeout);
  }, [bookmarks]);

  return (
    <div className="pt-20 w-screen h-screen bg-gray-800 px-4 md:px-0">
      <div className=" mx-auto py-4">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {skeletons.map((_, index) => (
              <div
                key={index}
                className="w-full max-w-md mx-auto bg-gray-700 animate-pulse rounded-xl shadow-md overflow-hidden h-80"
              >
                <div className="w-full h-48 bg-gray-600" />
                <div className="p-4">
                  <div className="h-5 bg-gray-500 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-500 rounded w-full mb-2" />
                  <div className="h-4 bg-gray-500 rounded w-5/6 mb-4" />
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-500 rounded w-1/3" />
                    <div className="h-4 bg-gray-500 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : displayBookmarks.length === 0 ? (
          <p className="text-gray-400 mt-10 text-center">
            You haven’t bookmarked any articles yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {displayBookmarks.map((article) => (
              <NewsCard key={article.url} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
