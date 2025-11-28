import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { BookmarksContext } from "../context/BookmarksContext";
import type { BookmarkArticle } from "../context/BookmarksContext";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";

type NewsArticle = {
  source?: { id?: string | null; name?: string };
  author?: string;
  title?: string;
  description?: string;
  url?: string;
  urlToImage?: string;
  publishedAt?: string;
};

type NewsCardProps = {
  article: NewsArticle;
};

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  const { source, author, title, description, url, urlToImage, publishedAt } =
    article;

  const { toggleBookmark, isBookmarked } = useContext(BookmarksContext);
  const isSaved = isBookmarked(url || "");

  const [imgLoaded, setImgLoaded] = useState(false);

  const handleBookmark = () => {
    if (!url) return;

    const bookmarkData: BookmarkArticle = {
      title: title || "Untitled",
      url,
      urlToImage,
      description,
      source: { name: source?.name },
    };

    toggleBookmark(bookmarkData);
  };

  return (
    <div className="max-w-md mx-auto bg-gray-900 hover:scale-105 transition-all rounded-xl shadow-md overflow-hidden hover:shadow-lg duration-300 flex flex-col animate-fadeIn">
      {/* IMAGE WITH LAZY LOAD + BLUR UP EFFECT */}
      <img
        src={urlToImage || "/placeholder.jpg"}
        alt={title || "News image"}
        loading="lazy"
        onLoad={() => setImgLoaded(true)}
        className={`w-full h-48 object-cover bg-gray-400 transition-all duration-500 
          ${imgLoaded ? "blur-loaded" : "blur-loading"}`}
      />

      <div className="p-4 flex flex-col h-full">
        <Link to={url || "#"}>
          <h2 className="text-xl font-semibold text-gray-200 hover:text-red-600 transition">
            {title
              ? title.length > 60
                ? title.slice(0, 60) + "..."
                : title
              : "Untitled Article"}
          </h2>
        </Link>

        <p className="text-sm text-gray-300 mt-2">
          {description
            ? description.length > 100
              ? description.slice(0, 100) + "..."
              : description
            : "No description available."}
        </p>

        <div className="mt-4 text-sm text-gray-400 flex flex-col gap-1">
          <span>By {author || "Unknown"}</span>
          <span>
            {publishedAt
              ? new Date(publishedAt).toLocaleDateString()
              : "Unknown date"}
          </span>
        </div>

        {/* BOTTOM BOOKMARK */}
        <div className="mt-auto flex items-center gap-2 justify-end">
          <div className="mt-1 text-xs text-red-500 font-bold">
            Source: {source?.name || "Unknown"}
          </div>
          <button
            onClick={handleBookmark}
            className="text-white text-lg bg-black/40 p-3 rounded-full cursor-pointer hover:bg-black/60 transition"
          >
            {isSaved ? (
              <FaBookmark className="text-red-500 w-4 h-4" />
            ) : (
              <FaRegBookmark className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
