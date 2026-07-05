import { ChevronLeft, ChevronRight } from "lucide-react";

const ChapterNavigation = ({
  chapters = [],
  currentChapter,
  setCurrentChapter,
}) => {

  const isFirst = currentChapter === 0;
  const isLast = currentChapter === chapters.length - 1;

  return (
    <div
      className="
      flex
      flex-col
      sm:flex-row
      justify-between
      items-center
      gap-4
      mt-8
      "
    >

      {/* Previous */}

      <button
        onClick={() => {
          if (!isFirst) {
            setCurrentChapter(currentChapter - 1);
          }
        }}
        disabled={isFirst}
        className={`
          flex
          items-center
          gap-2
          px-6
          py-3
          rounded-xl
          font-semibold
          transition-all
          duration-300

          ${
            isFirst
              ? `
                bg-gray-500/30
                text-gray-500
                cursor-not-allowed
              `
              : `
                bg-amber-200
                text-[#2c1e0f]
                hover:scale-105
              `
          }
        `}
      >
        <ChevronLeft size={18} />
        Previous Chapter
      </button>

      {/* Chapter Indicator */}

      <div
        className="
        px-5
        py-2
        rounded-full
        bg-white/5
        border
        border-white/10
        text-sm
        text-gray-300
        "
      >
        Chapter {currentChapter + 1} of {chapters.length}
      </div>

      {/* Next */}

      <button
        onClick={() => {
          if (!isLast) {
            setCurrentChapter(currentChapter + 1);
          }
        }}
        disabled={isLast}
        className={`
          flex
          items-center
          gap-2
          px-6
          py-3
          rounded-xl
          font-semibold
          transition-all
          duration-300

          ${
            isLast
              ? `
                bg-gray-500/30
                text-gray-500
                cursor-not-allowed
              `
              : `
                bg-heritage-gold
                text-black
                hover:scale-105
                hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]
              `
          }
        `}
      >
        Next Chapter
        <ChevronRight size={18} />
      </button>

    </div>
  );
};

export default ChapterNavigation;