import axios from "axios";
import React, { useEffect, useState } from "react";
import NewsCard from "../components/NewsCard";
import { Loader2 } from "lucide-react";
import type { Article } from "../types/Article";

type NewsProps = {
  category: string;
  articles: Article[];
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
};

const News: React.FC<NewsProps> = ({ category, articles, setArticles }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAllNews = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${
          import.meta.env.VITE_API_KEY
        }`
      );

      setArticles(res.data.articles);
      console.log(res.data.articles);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllNews();
  }, [category]);

  return (
    <>
      {loading ? (
        <div className="h-screen flex flex-col gap-3 items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-gray-200" />
          <h1 className="text-gray-200 text-xl font-semibold">
            {/* Scanning... */}
          </h1>
        </div>
      ) : (
        <div className=" bg-gray-800 py-24 px-4 md:px-4">
          <div className="w-full mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-7">
            {articles.map((article, index) => (
              <NewsCard key={index} article={article} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default News;
