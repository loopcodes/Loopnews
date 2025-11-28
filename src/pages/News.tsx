import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import NewsCard from "../components/NewsCard";
import Highlights from "../components/Highlights";
import type { Article } from "../types/Article";

type NewsProps = {
  category: string;
  articles: Article[];
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
};

const skeletons = Array.from({ length: 8 });

const News: React.FC<NewsProps> = ({ category, articles, setArticles }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);

  // Active highlight tag
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);

  // When category changes, reset highlight mode
  useEffect(() => {
    setActiveHighlight(null);
  }, [category]);

  /** Fetch category news */
  const fetchCategoryNews = useCallback(async () => {
    if (activeHighlight) return; // prevent fetch during highlight mode

    try {
      setLoading(true);
      setPage(1);

      const res = await axios.get(
        `https://newsapi.org/v2/top-headlines?category=${category}&page=1&pageSize=12&apiKey=${
          import.meta.env.VITE_API_KEY
        }`
      );

      setArticles(res.data.articles);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [category, setArticles, activeHighlight]);

  /** Load More News (category mode only) */
  const fetchMoreNews = useCallback(async () => {
    if (loadingMore || activeHighlight) return; // prevent infinite scroll in highlight mode

    try {
      setLoadingMore(true);
      const nextPage = page + 1;

      const res = await axios.get(
        `https://newsapi.org/v2/top-headlines?category=${category}&page=${nextPage}&pageSize=12&apiKey=${
          import.meta.env.VITE_API_KEY
        }`
      );

      if (res.data.articles.length > 0) {
        setArticles((prev) => [...prev, ...res.data.articles]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMore(false);
    }
  }, [page, loadingMore, category, setArticles, activeHighlight]);

  /** Fetch Highlight Tag News */
  const fetchHighlightNews = async (tag: string) => {
    try {
      setLoading(true);
      setActiveHighlight(tag);

      const res = await axios.get(
        `https://newsapi.org/v2/everything?q=${tag}&pageSize=20&apiKey=${
          import.meta.env.VITE_API_KEY
        }`
      );

      setArticles(res.data.articles);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /** Auto-fetch category news unless a highlight is active */
  useEffect(() => {
    if (!activeHighlight) fetchCategoryNews();
  }, [fetchCategoryNews, activeHighlight]);

  /** Infinite Scroll */
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 200 &&
        !loadingMore &&
        !activeHighlight
      ) {
        fetchMoreNews();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadingMore, activeHighlight, fetchMoreNews]);

  return (
    <div className="w-screen bg-gray-800 min-h-screen pt-20 px-4">
      <div className="sticky top-16 bg-gray-800 z-20 pb-2">
        <Highlights
          category={category}
          activeTag={activeHighlight}
          onSelect={fetchHighlightNews}
        />
      </div>

      <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-7 py-6">
        {/* Loading skeleton */}
        {loading &&
          skeletons.map((_, index) => (
            <div
              key={index}
              className="w-full max-w-md mx-auto bg-gray-700 animate-pulse rounded-xl shadow-md overflow-hidden"
            >
              <div className="w-full h-48 bg-gray-600" />
              <div className="p-4 space-y-2">
                <div className="h-5 bg-gray-500 rounded w-full max-w-[180px]" />
                <div className="h-4 bg-gray-500 rounded w-full" />
                <div className="h-4 bg-gray-500 rounded w-5/6" />
                <div className="flex justify-between items-center mt-2">
                  <div className="h-4 bg-gray-500 rounded w-1/3" />
                  <div className="h-4 bg-gray-500 rounded w-1/4" />
                </div>
                <div className="h-3 bg-gray-500 rounded w-1/2 mt-2" />
              </div>
            </div>
          ))}

        {/* No results */}
        {!loading && articles.length === 0 && (
          <div className="col-span-full text-center text-gray-300 py-10">
            <h2 className="text-xl font-semibold mb-2">No results found</h2>
            <p className="text-gray-400 text-sm">
              Try selecting another highlight or category.
            </p>
          </div>
        )}

        {/* Articles */}
        {!loading &&
          articles.length > 0 &&
          articles.map((article, index) => (
            <NewsCard key={index} article={article} />
          ))}

        {/* Loading more (category only) */}
        {loadingMore && !activeHighlight && (
          <div className="col-span-full text-center text-gray-400 py-6">
            Loading more news...
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
