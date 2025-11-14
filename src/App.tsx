import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import News from "./pages/News";
import type { Article } from "./types/Article";

const App: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
 

  return (
    <BrowserRouter>
      <Navbar setArticles={setArticles} />

      <Routes>
        <Route
          path="/"
          element={
            <News
              category="general"
              articles={articles}
              setArticles={setArticles}
            />
          }
        />
        <Route
          path="/business"
          element={
            <News
              category="business"
              articles={articles}
              setArticles={setArticles}
            />
          }
        />
        <Route
          path="/entertainment"
          element={
            <News
              category="entertainment"
              articles={articles}
              setArticles={setArticles}
            />
          }
        />
        <Route
          path="/general"
          element={
            <News
              category="general"
              articles={articles}
              setArticles={setArticles}
            />
          }
        />
        <Route
          path="/health"
          element={
            <News
              category="health"
              articles={articles}
              setArticles={setArticles}
            />
          }
        />
        <Route
          path="/science"
          element={
            <News
              category="science"
              articles={articles}
              setArticles={setArticles}
            />
          }
        />
        <Route
          path="/sports"
          element={
            <News
              category="sports"
              articles={articles}
              setArticles={setArticles}
            />
          }
        />
        <Route
          path="/technology"
          element={
            <News
              category="technology"
              articles={articles}
              setArticles={setArticles}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
