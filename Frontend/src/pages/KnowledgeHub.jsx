import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import storyService from "../services/storyService";
import categoryService from "../services/categoryService";

import StoryBookCard from "../components/knowledgeHub/StoryBookCard";
import KnowledgeFilters from "../components/knowledgeHub/KnowledgeFilters";
import StorySkeleton from "../components/knowledgeHub/StorySkeleton";
import Pagination from "../components/knowledgeHub/Pagination";

const coverColors = [
  "bg-gradient-to-br from-red-500 to-red-800",
  "bg-gradient-to-br from-blue-500 to-blue-800",
  "bg-gradient-to-br from-green-500 to-green-800",
  "bg-gradient-to-br from-purple-500 to-purple-800",
  "bg-gradient-to-br from-amber-500 to-orange-800",
  "bg-gradient-to-br from-pink-500 to-rose-800",
  "bg-gradient-to-br from-cyan-500 to-blue-800",
  "bg-gradient-to-br from-indigo-500 to-violet-800",
  "bg-gradient-to-br from-emerald-500 to-green-800",
  "bg-gradient-to-br from-orange-500 to-red-800",
];

const KnowledgeHub = () => {
  const [stories, setStories] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchInput, setSearchInput] = useState("");
const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalStories: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // =========================
  // Fetch Categories
  // =========================

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories({
        usage_type: "STORY",
      });

      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // Fetch Stories
  // =========================

  const fetchStories = async () => {
    try {
      setLoading(true);

      const data = await storyService.getStories({
        page,
        limit: 12,
        category: selectedCategory,
        search,
      });

      if (data.success) {
        setStories(data.stories);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Effects
  // =========================

  useEffect(() => {
    fetchCategories();
  }, []);

useEffect(() => {
  fetchStories();
}, [page, selectedCategory, search]);

  useEffect(() => {
  const timer = setTimeout(() => {
    setSearch(searchInput);
  }, 500);

  return () => clearTimeout(timer);
}, [searchInput]);

  // =========================
  // Pagination Handler
  // =========================

  const handlePageChange = (newPage) => {
    setPage(newPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
    return (
    <div className="min-h-screen pt-10 px-4 md:px-8 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}

        <Link
          to="/"
          className="
            inline-flex
            items-center
            gap-2
            mb-8
            px-4
            py-2
            rounded-xl
            bg-white/5
            border
            border-white/10
            text-gray-300
            hover:text-heritage-gold
            hover:border-heritage-gold
            transition-all
            duration-300
          "
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        {/* Heading */}

        <h1 className="text-4xl md:text-5xl font-bold">
          Explore India's{" "}
          <span className="text-heritage-gold">
            Knowledge
          </span>
        </h1>

        <p className="mt-4 text-gray-400 max-w-2xl">
          Discover mythology, history, culture and untold stories from every
          corner of India.
        </p>

        {/* Search + Categories */}

        <KnowledgeFilters
           search={searchInput}
  setSearch={setSearchInput}
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          setPage={setPage}
        />

        {/* Stories */}

        <div className="mt-16 pb-24">
          {loading ? (
            <StorySkeleton count={8} />
          ) : stories.length === 0 ? (
            <div className="py-28 text-center">
              <h2 className="text-3xl font-semibold text-white">
                No Stories Found
              </h2>

              <p className="mt-4 text-gray-400">
                Try another category or search with different keywords.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-14 gap-y-16">
                {stories.map((story, index) => (
                  <StoryBookCard
                    key={story.story_id}
                    story={story}
                    coverColor={
                      coverColors[index % coverColors.length]
                    }
                  />
                ))}
              </div>

              <Pagination
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeHub;