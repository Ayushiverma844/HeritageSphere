import React from "react";
import { Search } from "lucide-react";

const KnowledgeFilters = ({
  search,
  setSearch,
  categories,
  selectedCategory,
  setSelectedCategory,
  setPage,
}) => {
  return (
    <>
      {/* Search */}

      <div className="relative mt-8">
        <Search
          size={22}
          className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search stories, places, mythology..."
          className="
            w-full
            py-4
            pl-14
            pr-5
            rounded-2xl
            bg-white/5
            backdrop-blur-xl
            border
            border-white/10
            outline-none
            text-white
            placeholder:text-gray-500
            focus:border-heritage-gold
            focus:ring-2
            focus:ring-heritage-gold/20
            transition-all
            duration-300
          "
        />
      </div>

      {/* Categories */}

      <div className="flex flex-wrap gap-3 mt-8">
        <button
          onClick={() => {
            setSelectedCategory("");
            setPage(1);
          }}
          className={`
            px-5
            py-2.5
            rounded-full
            text-sm
            font-medium
            transition-all
            duration-300

            ${
              selectedCategory === ""
                ? "bg-heritage-gold text-black shadow-lg shadow-yellow-500/20"
                : "bg-white/5 border border-white/10 text-gray-300 hover:border-heritage-gold hover:text-heritage-gold hover:bg-white/10"
            }
          `}
        >
          All
        </button>

        {categories.map((cat) => (
          <button
            key={cat.category_id}
            onClick={() => {
              setSelectedCategory(cat.category_name);
              setPage(1);
            }}
            className={`
              px-5
              py-2.5
              rounded-full
              text-sm
              font-medium
              transition-all
              duration-300

              ${
                selectedCategory === cat.category_name
                  ? "bg-heritage-gold text-black shadow-lg shadow-yellow-500/20"
                  : "bg-white/5 border border-white/10 text-gray-300 hover:border-heritage-gold hover:text-heritage-gold hover:bg-white/10"
              }
            `}
          >
            {cat.category_name}
          </button>
        ))}
      </div>
    </>
  );
};

export default KnowledgeFilters;