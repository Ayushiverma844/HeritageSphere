import { useEffect, useState } from "react";
import StoryIllustration from "./StoryIllustration";

const StoryBook = ({ story, chapter }) => {

  // -----------------------------
  // Safety
  // -----------------------------

  if (!story || !chapter) return null;

  // -----------------------------
  // States
  // -----------------------------

  const [pages, setPages] = useState([]);

  const [currentPage, setCurrentPage] =
    useState(0);

  // -----------------------------
  // Split Story into Book Pages
  // -----------------------------

  const splitIntoPages = (
    text,
    wordsPerPage = 185
  ) => {

    if (!text) return [];

    const words = text.trim().split(/\s+/);

    const result = [];

    for (
      let i = 0;
      i < words.length;
      i += wordsPerPage
    ) {

      result.push(
        words
          .slice(i, i + wordsPerPage)
          .join(" ")
      );

    }

    return result;

  };

  // -----------------------------
  // Whenever chapter changes
  // -----------------------------

  useEffect(() => {

    const pageData =
      splitIntoPages(chapter.content);

    setPages(pageData);

    setCurrentPage(0);

  }, [chapter]);

  // -----------------------------
  // Pagination Functions
  // -----------------------------

  const nextPage = () => {

    if (
      currentPage <
      pages.length - 1
    ) {

      setCurrentPage(
        currentPage + 1
      );

    }

  };

  const previousPage = () => {

    if (currentPage > 0) {

      setCurrentPage(
        currentPage - 1
      );

    }

  };

  // -----------------------------
  // UI
  // -----------------------------

  return (

    <div className="relative">

      {/* Background Glow */}

      <div
        className="
        absolute
        left-1/2
        top-12
        -translate-x-1/2
        w-175
        h-175
        rounded-full
        bg-amber-300/10
        blur-[180px]
        pointer-events-none
        "
      />

      {/* Book */}
            <div
        className="
        relative
        grid
        lg:grid-cols-2
        rounded-[30px]
        overflow-hidden
        border
        border-heritage-gold/20
        shadow-[0_20px_60px_rgba(0,0,0,0.45)]
        h-205
        bg-[#f3e6c9]
        "
      >

        {/* ================= Left Page ================= */}

        <div
          className="
          relative
          flex
          flex-col
          bg-linear-to-r
          from-[#f7ecd2]
          to-[#ead8b5]
          text-[#2b1c0d]
          px-8
          py-8
          border-r
          border-black/10
          "
        >

          {/* Title */}

          <div>

            <h1 className="text-3xl md:text-4xl font-serif leading-tight mt-2">

              {story.title}

            </h1>

            <p className="mt-2 text-lg opacity-80">

              Chapter {chapter.chapter_number} • {chapter.title}

            </p>

          </div>

          {/* Story Content */}

          <div
            className="
            flex-1
            mt-6
            overflow-hidden
            "
          >

            <div
              className="
              story-content
              text-[15px]
              leading-6
              whitespace-pre-line
              text-justify
              "
            >

              {pages[currentPage]}

            </div>

          </div>

          {/* Bottom Navigation */}

          <div
            className="
            mt-3
            pt-3
            border-t
            border-black/10
            flex
            items-center
            justify-between
            "
          >

            <button
              onClick={previousPage}
              disabled={currentPage === 0}
              className="
              px-5
              py-2
              rounded-xl
              border
              border-black/15
              hover:bg-black/5
              transition
              disabled:opacity-40
              disabled:cursor-not-allowed
              "
            >
              ← Previous
            </button>

            <p className="text-sm font-medium tracking-wide">

              Page {currentPage + 1} of {pages.length}

            </p>

            <button
              onClick={nextPage}
              disabled={
                currentPage === pages.length - 1
              }
              className="
              px-5
              py-2
              rounded-xl
              border
              border-black/15
              hover:bg-black/5
              transition
              disabled:opacity-40
              disabled:cursor-not-allowed
              "
            >
              Next →
            </button>

          </div>

          {/* Page Shadow */}

          <div
            className="
            absolute
            top-0
            right-0
            w-10
            h-full
            bg-linear-to-l
            from-black/10
            to-transparent
            pointer-events-none
            "
          />

        </div>

                {/* ================= Book Spine ================= */}

        <div
          className="
          hidden
          lg:block
          absolute
          left-1/2
          top-0
          h-full
          w-8
          -translate-x-1/2
          z-20
          pointer-events-none
          bg-linear-to-r
          from-black/10
          via-black/25
          to-black/10
          "
        />

        {/* ================= Right Page ================= */}

        <div
          className="
          relative
          h-full
          bg-linear-to-l
          from-[#f7ecd2]
          to-[#ead8b5]
          overflow-hidden
          "
        >

          <StoryIllustration
            story={story}
            chapter={chapter}
          />

          {/* Right Page Shadow */}

          <div
            className="
            absolute
            top-0
            left-0
            w-10
            h-full
            bg-linear-to-r
            from-black/10
            to-transparent
            pointer-events-none
            "
          />

          {/* Decorative Page Number */}

          <div
            className="
            absolute
            bottom-6
            right-8
            text-sm
            tracking-[4px]
            text-black/40
            font-serif
            select-none
            "
          >
            {String(currentPage + 1).padStart(2, "0")}
          </div>

        </div>

      </div>

      {/* Book Bottom Shadow */}

      <div
        className="
        absolute
        left-1/2
        -translate-x-1/2
        -bottom-7
        w-[90%]
        h-10
        bg-black/35
        blur-2xl
        rounded-full
        pointer-events-none
        "
      />

    </div>
      );
};

export default StoryBook;