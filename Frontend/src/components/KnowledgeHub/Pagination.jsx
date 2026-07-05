import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

  const {
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    totalStories,
  } = pagination;

  // Visible page numbers
  const getPages = () => {
    const pages = [];

    let start = Math.max(currentPage - 2, 1);
    let end = Math.min(currentPage + 2, totalPages);

    if (currentPage <= 3) {
      end = Math.min(5, totalPages);
    }

    if (currentPage >= totalPages - 2) {
      start = Math.max(totalPages - 4, 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="mt-20 flex flex-col items-center gap-6">
      {/* Info */}

      <p className="text-sm text-gray-400">
        Showing page{" "}
        <span className="text-heritage-gold font-semibold">
          {currentPage}
        </span>{" "}
        of{" "}
        <span className="text-heritage-gold font-semibold">
          {totalPages}
        </span>{" "}
        • {totalStories} Stories
      </p>

      {/* Buttons */}

      <div className="flex items-center gap-2 flex-wrap justify-center">
        {/* Previous */}

        <button
          disabled={!hasPreviousPage}
          onClick={() => onPageChange(currentPage - 1)}
          className={`
            flex items-center gap-2
            px-4 py-2
            rounded-xl
            border
            transition-all
            duration-300

            ${
              hasPreviousPage
                ? "border-white/10 bg-white/5 hover:border-heritage-gold hover:text-heritage-gold"
                : "border-white/5 bg-white/5 text-gray-600 cursor-not-allowed"
            }
          `}
        >
          <ChevronLeft size={18} />
          Previous
        </button>

        {/* Page Numbers */}

        {getPages().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`
              w-11
              h-11
              rounded-xl
              transition-all
              duration-300

              ${
                currentPage === page
                  ? "bg-heritage-gold text-black font-bold shadow-lg shadow-yellow-500/30"
                  : "bg-white/5 border border-white/10 hover:border-heritage-gold hover:text-heritage-gold"
              }
            `}
          >
            {page}
          </button>
        ))}

        {/* Next */}

        <button
          disabled={!hasNextPage}
          onClick={() => onPageChange(currentPage + 1)}
          className={`
            flex items-center gap-2
            px-4 py-2
            rounded-xl
            border
            transition-all
            duration-300

            ${
              hasNextPage
                ? "border-white/10 bg-white/5 hover:border-heritage-gold hover:text-heritage-gold"
                : "border-white/5 bg-white/5 text-gray-600 cursor-not-allowed"
            }
          `}
        >
          Next
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;