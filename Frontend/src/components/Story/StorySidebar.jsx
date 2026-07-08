import { BookMarked } from "lucide-react";

const StorySidebar = ({
  chapters = [],
  currentChapter,
  setCurrentChapter,
}) => {
  return (
    <div
      className="
      sticky
      top-28
      h-[82vh]
      flex
      flex-col
      bg-white/5
      backdrop-blur-xl
      border
      border-white/10
      rounded-3xl
      overflow-hidden
      "
    >
      {/* Gold Glow */}

      <div
        className="
        absolute
        top-0
        left-0
        w-full
        h-24
        bg-linear-to-b
        from-heritage-gold/10
        to-transparent
        pointer-events-none
        "
      />

      {/* Header */}

      <div className="relative z-10 p-6 border-b border-white/10">

        <div className="flex items-center gap-3">

          <div
            className="
            h-12
            w-12
            rounded-2xl
            bg-heritage-gold/15
            flex
            items-center
            justify-center
            "
          >
            <BookMarked
              size={22}
              className="text-heritage-gold"
            />
          </div>

          <div>

            <h3 className="text-xl font-bold text-heritage-gold">
              Chapters
            </h3>

            <p className="text-sm text-gray-400">
              {chapters.length} Chapters
            </p>

          </div>

        </div>

      </div>
            {/* Chapter List */}

      <div
        className="
        flex-1
        overflow-y-auto
        p-4
        space-y-3
        scrollbar-thin
        scrollbar-thumb-heritage-gold/30
        scrollbar-track-transparent
        "
      >

        {chapters.map((chapter, index) => (

          <button
            key={chapter.chapter_id}
            onClick={() => setCurrentChapter(index)}
            className={`
              w-full
              rounded-2xl
              border
              text-left
              transition-all
              duration-300
              p-4

              ${
                currentChapter === index
                  ? `
                    bg-heritage-gold
                    text-black
                    border-heritage-gold
                    shadow-lg
                    scale-[1.02]
                  `
                  : `
                    bg-white/3
                    border-white/10
                    text-gray-300
                    hover:bg-white/10
                    hover:border-heritage-gold/40
                    hover:translate-x-1
                  `
              }
            `}
          >

            <div className="flex gap-4 items-start">

              {/* Number */}

              <div
                className={`
                  flex
                  items-center
                  justify-center
                  h-10
                  w-10
                  rounded-full
                  font-bold
                  text-sm
                  shrink-0

                  ${
                    currentChapter === index
                      ? "bg-black/15"
                      : "bg-white/10"
                  }
                `}
              >

                {String(
                  chapter.chapter_number
                ).padStart(2, "0")}

              </div>

              {/* Title */}

              <div className="min-w-0 flex-1">

                <h4
                  className="
                  font-semibold
                  truncate
                  "
                >
                  {chapter.title}
                </h4>

                <p
                  className={`text-xs mt-1 ${
                    currentChapter === index
                      ? "text-black/70"
                      : "text-gray-500"
                  }`}
                >
                  Chapter {chapter.chapter_number}
                </p>

              </div>

            </div>

          </button>

        ))}

      </div>
            {/* Footer */}

      <div
        className="
        border-t
        border-white/10
        bg-white/2
        p-3
        "
      >

        {/* Reading Progress */}

        <div className="mb-2">

          <div className="flex justify-between text-xs text-gray-400 mb-2">

            <span>Reading Progress</span>

            <span>
              {currentChapter + 1} / {chapters.length}
            </span>

          </div>

          <div className="h-2 rounded-full bg-white/10 overflow-hidden">

            <div
              className="
              h-full
              bg-heritage-gold
              rounded-full
              transition-all
              duration-500
              "
              style={{
                width: `${
                  ((currentChapter + 1) /
                    chapters.length) *
                  100
                }%`,
              }}
            />

          </div>

        </div>

        {/* Current Chapter */}

        <div className="text-center">

          <p className="text-xs uppercase tracking-widest text-gray-500">
            Currently Reading
          </p>

          <h4 className="mt-2 text-sm font-semibold text-heritage-gold line-clamp-2">
            {chapters[currentChapter]?.title}
          </h4>

        </div>

      </div>

    </div>
  );
};

export default StorySidebar;