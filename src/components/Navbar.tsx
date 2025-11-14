import { Menu, Search, X } from "lucide-react";
import React, { useState } from "react";
import type { ChangeEvent } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import type { Article } from "../types/Article";

type NavbarProps = {
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
};

const links: string[] = [
  "General",
  "Business",
  "Entertainment",
  "Health",
  "Science",
  "Sports",
  "Technology",
];

const Navbar: React.FC<NavbarProps> = ({ setArticles }) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleSearch = async (e: ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value;

    try {
      const res = await axios.get(
        `https://newsapi.org/v2/top-headlines?q=${search}&apiKey=${
          import.meta.env.VITE_API_KEY
        }`
      );

      setArticles(res.data.articles);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed w-full bg-red-900 z-10 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/">
          <div className="md:text-2xl text-lg font-bold text-gray-100 cursor-pointer">
            LoopNews
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
                    ? "text-white font-bold"
                    : "text-gray-200 hover:text-white"
                }`
              }
            >
              {link}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4">
          {/* Search */}
          <div className="relative p-2 rounded-lg">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              onChange={handleSearch}
              type="text"
              placeholder="Search news..."
              className="md:pl-10 pl-7 w-30 md:w-64 outline-none"
            />
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
                `block py-2 transition ${
                  isActive
                    ? "text-white font-bold"
                    : "text-gray-200 hover:text-white"
                }`
              }
            >
              {link}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

export default Navbar;
