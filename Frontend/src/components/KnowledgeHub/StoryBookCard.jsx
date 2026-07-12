import React from "react";
import { Link } from "react-router-dom";
import { MapPin, BookOpen, Bookmark } from "lucide-react";

const StoryBookCard = ({
  story,
  coverColor,
  isSaved,
  onSave,
}) => {
  return (
    <Link
      to={`/stories/${story.slug}`}
      className="group flex justify-center"
    >
      <div
        className="
          relative
          w-88
          h-135
          transform-gpu
          perspective-[1800px]
          transition-all
          duration-500
          group-hover:-translate-y-4
          group-hover:scale-[1.02]
          z-10
          group-hover:z-50
        "
      >
        {/* Save */}

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSave(story);
          }}
          className="
            absolute
            right-1
            top-1
            z-100
            h-9
            w-9
            rounded-full
            bg-black/60
            backdrop-blur
            border
            border-yellow-600/30
            flex
            items-center
            justify-center
            transition
            hover:scale-110
          "
        >
          <Bookmark
            size={16}
            className={
              isSaved
                ? "fill-yellow-400 text-yellow-400"
                : "text-white"
            }
          />
        </button>

        {/* Book */}

        <div
          className="
            absolute
            inset-0
            transition-all
            duration-500
           transform-3d
          "
        >
          {/* Spine */}

          <div
            className="
              absolute
              left-0
              top-0
              bottom-0
              w-6
              rounded-l-md
              bg-linear-to-r
              from-[#2b1b13]
              to-[#6b4423]
              shadow-xl
            "
          >
            <div className="absolute right-0 top-0 h-full w-px bg-yellow-600/40" />
          </div>

          {/* Cover */}

          <div
            className={`
              absolute
              left-4
              top-0
              right-0
              bottom-5
              rounded-r-md
              border
              overflow-hidden
              flex
              flex-col
              transition-all
              duration-700
              ease-out
              group-hover:transform-[rotateY(-16deg)]
              ${coverColor}
            `}
            style={{
              borderColor: "#b88935",
              transformOrigin: "left center",
              transformStyle: "preserve-3d",
              boxShadow:
                "10px 12px 30px rgba(0,0,0,.45), inset 0 0 0 1px rgba(255,215,120,.15)",
            }}
          >
            {/* Glow */}

            <div
              className="
                absolute
                inset-0
                opacity-0
                group-hover:opacity-100
                transition
                duration-500
                bg-linear-to-br
                from-yellow-400/10
                via-transparent
                to-yellow-300/5
              "
            />

            {/* Border */}

            <div
              className="
                absolute
                inset-1.5
                rounded
                border
                border-yellow-700/60
                transition
                duration-500
                group-hover:border-yellow-300
              "
            />

            {/* Image */}

            <div className="flex justify-center pt-6">
              <div
                className="
                  w-76
                  h-45
                  overflow-hidden
                  border
                  border-yellow-700
                  shadow-xl
                "
              >
                <img
                  src={story.cover_image}
                  alt={story.title}
                  onError={(e) => {
                    e.target.src =
                      "/images/default-story.jpg";
                  }}
                  className="
                    w-full
                    h-full
                    object-cover
                    transition-all
                    duration-700
                    group-hover:scale-110
                  "
                />
              </div>
            </div>
                        {/* Category */}

            <div className="flex justify-center mt-4">
              <span
                className="
                  px-4
                  py-1
                  rounded-full
                  text-[11px]
                  tracking-widest
                  uppercase
                  border
                  border-yellow-700
                  text-yellow-500
                  transition-all
                  duration-500
                  group-hover:bg-yellow-500
                  group-hover:text-black
                "
              >
                {story.category_name}
              </span>
            </div>

            {/* Title */}

            <div className="px-3 mt-5 min-h-17.5 flex items-center justify-center">
              <h2
                className="
                  text-center
                  font-bold
                  text-yellow-100
                  leading-tight
                  line-clamp-2
                "
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize:
                    story.title.length > 22
                      ? "1.55rem"
                      : story.title.length > 12
                      ? "1.75rem"
                      : "2rem",
                }}
              >
                {story.title}
              </h2>
            </div>

            {/* Summary */}

            <div className="px-4 mt-4">
              <p
                className="
                  text-center
                  text-gray-300
                  group-hover:text-white
                  transition-colors
                  duration-500
                  text-[15px]
                  leading-5
                  line-clamp-3
                "
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                }}
              >
                {story.summary}
              </p>
            </div>

            {/* Info */}

            <div className="mt-auto px-6 pb-6 space-y-3">
              {story.place_name && (
                <div className="flex items-center justify-center gap-2 text-gray-200 text-sm">
                  <MapPin size={15} />
                  <span>{story.place_name}</span>
                </div>
              )}

              <div className="flex items-center justify-center gap-2 text-yellow-300 text-sm">
                <BookOpen size={15} />
                <span>{story.total_chapters} Chapters</span>
              </div>

              {story.source_name && (
                <p className="text-center text-xs text-gray-400">
                  Source:{" "}
                  <span className="text-yellow-300">
                    {story.source_name}
                  </span>
                </p>
              )}
            </div>

            {/* Shine */}

            <div
              className="
                absolute
                top-0
                left-[-120%]
                h-full
                w-1/2
                skew-x-[-20deg]
                bg-linear-to-r
                from-transparent
                via-white/20
                to-transparent
                transition-all
                duration-1000
                group-hover:left-[140%]
              "
            />
          </div>
                    {/* ===== Bottom Pages ===== */}

          <div
            className="
              absolute
              left-4
              right-0
              bottom-0
              h-5
              rounded-b-md
              transition-all
              duration-700
              group-hover:transform-[rotateY(-14deg)]
            "
            style={{
              transformOrigin: "left center",
              background:
                "linear-gradient(to bottom,#f7ecd5,#d7c19a 0%,#d6bc8d 100%)",
              boxShadow:
                "0 2px 8px rgba(0,0,0,.25), inset 0 1px rgba(255,255,255,.6)",
            }}
          />

          {/* Inner Pages */}

          <div
            className="
              absolute
              left-4
              right-0
              bottom-4
              h-1.5
              transition-all
              duration-700
              group-hover:transform-[rotateY(-14deg)]
            "
            style={{
              transformOrigin: "left center",
              background:
                "linear-gradient(to bottom,#ffffff,#e7d7b4)",
            }}
          />

          {/* Ground Shadow */}

          <div
            className="
              absolute
              -bottom-2
              left-1/2
              -translate-x-1/2
              w-56
              h-8
              rounded-full
              bg-yellow-500/20
              blur-2xl
              opacity-0
              transition-all
              duration-500
              group-hover:opacity-100
            "
          />

        </div>
      </div>
    </Link>
  );
};

export default StoryBookCard;