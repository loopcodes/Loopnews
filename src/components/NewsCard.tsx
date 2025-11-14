import React from "react";
import { Link } from "react-router-dom";

type NewsArticle = {
  source:
    | {
        id?: string | null;
        name?: string;
      }
    | undefined; // allow undefined since API sometimes sends undefined
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

  return (
    <div className="max-w-md mx-auto bg-gray-900 hover:scale-105 transition-all rounded-xl shadow-md overflow-hidden hover:shadow-lg duration-300">
      <img
        src={urlToImage || "/placeholder.jpg"}
        alt={title || "News image"}
        className="w-full h-48 object-cover bg-gray-400"
      />

      <div className="p-4">
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

        <div className="mt-1 text-xs text-red-500 font-bold">
          Source: {source?.name || "Unknown"}
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
