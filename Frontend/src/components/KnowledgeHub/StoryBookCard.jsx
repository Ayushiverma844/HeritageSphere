import React from "react";
import { Link } from "react-router-dom";
import { MapPin, BookOpen } from "lucide-react";

const StoryBookCard = ({ story, coverColor }) => {
  return (
    <Link
      to={`/stories/${story.slug}`}
      className="group flex justify-center"
    >
      <div
        className="
        relative
        z-0
        w-75
        h-120
        transition-all
        duration-500
        ease-out
        transform-gpu
        perspective-[1500px]
        group-hover:z-50
        group-hover:-translate-y-5
        group-hover:rotate-2
        group-hover:scale-[1.02]
      "
      >
        {/* ================= BOOK COVER ================= */}

        <div
          className="
          absolute
          inset-0
          transition-all
          duration-500
          ease-out
          group-hover:-translate-y-3
          group-hover:scale-[1.02]
          group-hover:rotate-1
        "
        >
          {/* Spine */}

          <div
            className="
            absolute
            left-0
            top-0
            w-6
            h-full
            rounded-l-md
            bg-linear-to-r
            from-[#2b1b13]
            to-[#6b4423]
          "
          >
            <div className="absolute right-0 top-0 h-full w-0.5 bg-yellow-700/40" />
          </div>

          {/* Cover */}

          <div
            className={`
              absolute
              left-4
              top-0
              bottom-5
              right-0
              rounded-r-md
              border
              overflow-hidden
              transition-all
              duration-700
              ease-out
              group-hover:transform-[rotateY(-18deg)]
              group-hover:shadow-[0_30px_60px_rgba(212,175,55,0.45)]
              flex
              flex-col
              ${coverColor}
            `}
            style={{
              borderColor: "#b88935",
              boxShadow:
                "12px 12px 30px rgba(0,0,0,.45), inset 0 0 0 1px rgba(255,215,120,.15)",
            }}
          >
            {/* Glow */}

            <div
              className="
              absolute
              inset-0
              opacity-0
              group-hover:opacity-100
              transition-opacity
              duration-500
              bg-linear-to-br
              from-yellow-400/10
              via-transparent
              to-yellow-400/5
              pointer-events-none
            "
            />

            {/* Golden Border */}

            <div
              className="
              absolute
              inset-3
              rounded
              border
              border-yellow-700/60
              transition-all
              duration-500
              group-hover:border-yellow-300
              group-hover:shadow-[0_0_22px_rgba(255,215,0,0.7)]
            "
            />

            {/* Image */}

            <div className="flex justify-center pt-10">
              <div
                className="
                w-36
                h-36
                rounded-full
                overflow-hidden
                border-[3px]
                border-yellow-700
                shadow-xl
              "
              >
                <img
                  src={story.cover_image}
                  alt={story.title}
                  onError={(e) => {
                    e.target.src = "/images/default-story.jpg";
                  }}
                  className="
                  w-full
                  h-full
                  object-cover
                  transition-all
                  duration-700
                  group-hover:scale-110
                  group-hover:rotate-2
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

            <div className="px-5 mt-6 min-h-17.5 flex items-center justify-center">
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

            <div className="px-7">
              <p
                className="
                text-center
                text-gray-300
                group-hover:text-white
                transition-colors
                duration-500
                text-[15px]
                leading-7
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
              w-1/2
              h-full
              bg-linear-to-r
              from-transparent
              via-white/20
              to-transparent
              skew-x-[-20deg]
              transition-all
              duration-1000
              group-hover:left-[140%]
            "
            />
          </div>

          {/* Pages */}

          <div
            className="
            absolute
            bottom-0
            left-1/2
            -translate-x-1/2
            w-52
            h-10
            rounded-full
            bg-yellow-400/20
            blur-2xl
            opacity-0
            transition-all
            duration-500
            group-hover:opacity-100
          "
          />

          <div
            className="absolute bottom-0 left-4 right-0 h-5 rounded-b-md"
            style={{
              background:
                "linear-gradient(to bottom,#e8d9b6,#c8b18a)",
            }}
          />

          <div
            className="absolute bottom-4 left-4 right-0 h-2"
            style={{
              background:
                "linear-gradient(to bottom,#f7ecd5,#d7c19a)",
            }}
          />
        </div>
      </div>
    </Link>
  );
};

export default StoryBookCard;