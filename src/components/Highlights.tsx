import React, { type JSX } from "react";
import {
  FaChartLine,
  FaHeartbeat,
  FaFlask,
  FaFutbol,
  FaFilm,
  FaLaptopCode,
  FaGlobe,
} from "react-icons/fa";

type HighlightsProps = {
  category: string;
  activeTag: string | null;
  onSelect: (tag: string) => void;
};

const categoryIcons: Record<string, JSX.Element> = {
  business: <FaChartLine />,
  entertainment: <FaFilm />,
  general: <FaGlobe />,
  health: <FaHeartbeat />,
  science: <FaFlask />,
  sports: <FaFutbol />,
  technology: <FaLaptopCode />,
};

const highlightTags: Record<string, string[]> = {
  business: ["Markets", "Startups", "Economy", "Crypto", "Finance"],
  entertainment: ["Movies", "Music", "Celebrities", "TV Shows", "Awards"],
  general: ["Breaking News", "World", "Local", "Politics"],
  health: ["Nutrition", "Mental Health", "Medicine", "Fitness", "Viruses"],
  science: ["Space", "Research", "Physics", "Discovery", "WIldlife"],
  sports: ["Football", "Soccer", "NBA", "Tennis", "Formula 1", "Transfers"],
  technology: ["AI", "Gadgets", "Cybersecurity", "Apps", "Gaming"],
};

const Highlights: React.FC<HighlightsProps> = ({
  category,
  activeTag,
  onSelect,
}) => {
  const tags = highlightTags[category] || [];
  const Icon = categoryIcons[category] || <FaGlobe />;

  return (
    <div className="w-full mb-2 opacity-0 translate-y-3 animate-fadeUp">

      <div className="flex items-center gap-2">
        <span className="text-red-500 text-xl">{Icon}</span>
        <h3 className="text-gray-200 text-lg font-semibold">
          Highlights in {category.charAt(0).toUpperCase() + category.slice(1)}
        </h3>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
        {tags.map((tag, index) => (
          <button
            key={tag}
            style={{ animationDelay: `${index * 80}ms` }}
            className={`
              shrink-0 px-4 py-1 rounded-full text-sm cursor-pointer transition-all
              opacity-0 translate-y-2 animate-fadeUp
              ${
                activeTag === tag
                  ? "bg-red-600 text-white"
                  : "bg-gray-700 text-gray-200 hover:bg-red-600 hover:text-white"
              }
            `}
            onClick={() => onSelect(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Highlights;
