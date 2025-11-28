import { Menu, Search, X } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import type { ChangeEvent } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import type { Article } from "../types/Article";

type NavbarProps = {
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
};

const links: string[] = [
  "Business",
  "Entertainment",
  "Health",
  "Science",
  "Sports",
  "Technology",
];

const trendingSearches = [
  "Bitcoin",
  "Artificial Intelligence",
  "Politics",
  "Stock",
  "Gaming",
];

const Navbar: React.FC<NavbarProps> = ({ setArticles }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [inputFocused, setInputFocused] = useState<boolean>(false);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  const fetchSearchResults = useCallback(
    async (query: string) => {
      if (!query) return;

      try {
        sessionStorage.setItem("searching", "true");
        const res = await axios.get(
          `https://newsapi.org/v2/top-headlines?q=${query}&apiKey=${
            import.meta.env.VITE_API_KEY
          }`
        );
        setArticles(res.data.articles);
      } catch (error) {
        console.error(error);
      }
    },
    [setArticles]
  );

  // Trigger search when debounced input changes
  useEffect(() => {
    if (debouncedSearch.trim() !== "") {
      fetchSearchResults(debouncedSearch);
    }
  }, [debouncedSearch, fetchSearchResults]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() === "") {
      // Mark as not searching
      sessionStorage.setItem("searching", "false");

      // Immediately clear results so old search doesn't show
      setArticles([]);

      return;
    }

    // If typing, set searching = true
    sessionStorage.setItem("searching", "true");
  };

  const handleTrendingClick = (term: string) => {
    setSearch(term);
    sessionStorage.setItem("searching", "true");
  };

  return (
    <div className="fixed w-full bg-red-900 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/">
          <div className="text-2xl font-serif font-bold text-gray-100 cursor-pointer">
            <span className="text-[30px]">∞</span> News
          </div>
        </NavLink>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6">
          {links.map((link) => (
            <NavLink
              key={link}
              to={`/${link.toLowerCase()}`}
              className={({ isActive }) =>
                `transition ${
                  isActive
                    ? "text-white font-bold border-white border-b-2 "
                    : "text-gray-200 hover:text-white hover:border-b-2"
                }`
              }
            >
              {link}
            </NavLink>
          ))}

          <NavLink
            to="/bookmarks"
            className={({ isActive }) =>
              `transition ${
                isActive
                  ? "text-white font-bold border-white border-b-2"
                  : "text-gray-200 hover:text-white hover:border-b-2"
              }`
            }
          >
            Bookmarks
          </NavLink>
        </div>

        {/* Search + Mobile Button */}
        <div className="flex items-center justify-center gap-4 relative">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />

            <input
              type="text"
              value={search}
              onChange={handleChange}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setTimeout(() => setInputFocused(false), 150)}
              placeholder="What interest you?"
              className="md:pl-10 pl-7 w-30 md:w-64 outline-none rounded-lg p-2 text-white"
            />

            {/* Trending Suggestions — show only when focused AND no input */}
            {inputFocused && search === "" && (
              <div className="absolute mt-2 w-full bg-white text-black rounded-md shadow-md p-3 z-50">
                <p className="text-sm font-semibold mb-2">Trending Searches</p>

                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((term) => (
                    <button
                      key={term}
                      onMouseDown={() => handleTrendingClick(term)}
                      className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded-md text-xs"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-gray-200"
          >
            {open ? <X size={25} /> : <Menu size={25} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-4 pb-4">
          {links.map((link) => (
            <NavLink
              key={link}
              to={`/${link.toLowerCase()}`}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block py-2 ${
                  isActive
                    ? "text-white font-bold border-white border-b-2"
                    : "text-gray-200 hover:text-white hover:border-b-2"
                }`
              }
            >
              {link}
            </NavLink>
          ))}

          <NavLink
            to="/bookmarks"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `block py-2 ${
                isActive
                  ? "text-white font-bold border-white border-b-2"
                  : "text-gray-200 hover:text-white hover:border-b-2"
              }`
            }
          >
            Bookmarks
          </NavLink>
        </div>
      )}
    </div>
  );
};

export default Navbar;
