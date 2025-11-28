import type { Handler } from "@netlify/functions";
import axios from "axios";

export const handler: Handler = async (event) => {
  try {
    // Get query params: category or highlight query & page
    const category = event.queryStringParameters?.category;
    const query = event.queryStringParameters?.query;
    const page = event.queryStringParameters?.page || "1";

    // Determine URL
    let url = "";

    if (query) {
      // Highlight / search mode
      url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
        query
      )}&pageSize=20&page=${page}&apiKey=${process.env.NEWS_API_KEY}`;
    } else if (category) {
      // Category / top headlines
      url = `https://newsapi.org/v2/top-headlines?category=${encodeURIComponent(
        category
      )}&pageSize=12&page=${page}&apiKey=${process.env.NEWS_API_KEY}`;
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Category or query is required." }),
      };
    }

    const response = await axios.get(url);

    return {
      statusCode: 200,
      body: JSON.stringify({
        articles: response.data.articles,
        totalResults: response.data.totalResults,
      }),
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("News function error:", error.message);
    } else {
      console.error("News function error:", error);
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch news" }),
    };
  }
};
