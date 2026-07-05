import { BookMarked } from "lucide-react";

const StorySidebar = ({
  chapters = [],
  currentChapter,
  setCurrentChapter,
}) => {
  return (
    <div
      className="
      bg-white/5
      backdrop-blur-xl
      border
      border-white/10
      rounded-3xl
      p-6
      h-fit
      sticky
      top-28
      overflow-hidden
      "
    >
      {/* Top Glow */}

      <div
        className="
        absolute
        top-0
        left-0
        w-full
        h-20
        bg-linear-to-b
        from-heritage-gold/10
        to-transparent
        pointer-events-none
        "
      />

      {/* Heading */}

      <div className="flex items-center gap-3 mb-8 relative z-10">
        <div
          className="
          h-10
          w-10
          rounded-xl
          bg-heritage-gold/15
          flex
          items-center
          justify-center
          "
        >
          <BookMarked
            size={20}
            className="text-heritage-gold"
          />
        </div>

        <div>
          <h3 className="text-xl font-semibold text-heritage-gold">
            Chapters
          </h3>

          <p className="text-xs text-gray-400">
            {chapters.length} Chapters Available
          </p>
        </div>
      </div>

      {/* Chapter List */}

      <div className="space-y-3">

        {chapters.map((chapter, index) => (

          <button
            key={chapter.chapter_id}
            onClick={() => setCurrentChapter(index)}
            className={`
              group
              relative
              w-full
              text-left
              px-4
              py-4
              rounded-2xl
              border
              transition-all
              duration-300

              ${
                currentChapter === index
                  ? `
                    bg-heritage-gold
                    text-black
                    border-heritage-gold
                  `
                  : `
                    bg-white/3
                    text-gray-300
                    border-white/5
                    hover:border-heritage-gold/40
                    hover:bg-white/10
                  `
              }
            `}
          >

            <div className="flex items-center gap-4">

              {/* Chapter Number */}

              <div
                className={`
                h-9
                w-9
                rounded-full
                flex
                items-center
                justify-center
                text-sm
                font-semibold

                ${
                  currentChapter === index
                    ? "bg-black/15"
                    : "bg-white/10"
                }
                `}
              >
                {String(chapter.chapter_number).padStart(2, "0")}
              </div>

              {/* Chapter Name */}

              <div>

                <p className="font-medium">
                  {chapter.title}
                </p>

                <p
                  className={`
                  text-xs mt-1

                  ${
                    currentChapter === index
                      ? "text-black/70"
                      : "text-gray-500"
                  }
                  `}
                >
                  Chapter {chapter.chapter_number}
                </p>

              </div>

            </div>

          </button>

        ))}

      </div>

      {/* Bottom */}

      <div
        className="
        mt-8
        pt-6
        border-t
        border-white/10
        "
      >
        <p className="text-xs text-center text-gray-500">
          Ancient Indian Epic
        </p>
      </div>

    </div>
  );
};

export default StorySidebar;