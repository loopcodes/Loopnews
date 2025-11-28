import { Menu, Search, X } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
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

const Navbar: React.FC<NavbarProps> = ({ setArticles }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [inputFocused, setInputFocused] = useState(false);

  /** Load recent searches once */
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem("recentSearches");
    return saved ? JSON.parse(saved) : [];
  });

  /** Save search term */
  const saveRecentSearch = useCallback(
    (term: string) => {
      if (!term.trim()) return;

      const updated = [
        term,
        ...recentSearches.filter(
          (item) => item.toLowerCase() !== term.toLowerCase()
        ),
      ].slice(0, 5);

      setRecentSearches(updated);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
    },
    [recentSearches]
  );

  /** Clear button logic */
  const handleClear = () => {
    const term = search.trim();
    if (term) saveRecentSearch(term);

    setSearch("");
    setDebouncedSearch("");
    setArticles([]);
    setInputFocused(false);
  };

  /** Debounce input */
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  /** Search when debounced */
  useEffect(() => {
    const run = async () => {
      const q = debouncedSearch.trim();

      if (!q) {
        setArticles([]);
        return;
      }

      try {
        const res = await axios.get(
          `/.netlify/functions/news?query=${encodeURIComponent(q)}`
        );

        setArticles(res.data.articles);
      } catch (err) {
        console.error("Navbar search error:", err);
      }
    };

    run();
  }, [debouncedSearch, setArticles]);

  /** Input change */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  /** Only save + search on Enter */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const term = search.trim();
      if (!term) return;

      saveRecentSearch(term);
      setDebouncedSearch(term);
    }
  };

  /** Clicking a recent search */
  const handleRecentClick = (term: string) => {
    setSearch(term);
    setDebouncedSearch(term);
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

        {/* Search Input */}
        <div className="flex items-center justify-center gap-2 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 h-4 w-4" />

            <input
              type="text"
              value={search}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setTimeout(() => setInputFocused(false), 150)}
              placeholder="What interests you?"
              className="md:pl-10 pl-7 w-46 md:w-64 outline-none rounded-lg p-2 text-white bg-red-900/40"
            />

            {/* Clear Button */}
            {search.trim() !== "" && (
              <X
                onMouseDown={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 h-4 w-4 cursor-pointer hover:text-white"
              />
            )}

            {/* Recent Searches */}
            {inputFocused && (
              <div className="absolute mt-2 w-full bg-white text-black rounded-md shadow-md p-3 z-50">
                <p className="text-sm font-semibold mb-2">Recent Searches</p>

                {recentSearches.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">
                    No recent searches
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onMouseDown={() => handleRecentClick(term)}
                        className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded-md text-xs"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                )}
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
        <div className="md:hidden px-4 pb-4 translate-y-2 animate-fadeUp">
          {links.map((link) => (
            <NavLink
              key={link}
              to={`/${link.toLowerCase()}`}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block py-2 ${
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
