import StoryIllustration from "./StoryIllustration";

const StoryBook = ({ story, chapter }) => {

  if (!story || !chapter) return null;

  return (
    <div className="relative">

      {/* Background Glow */}

      <div
        className="
        absolute
        left-1/2
        top-10
        -translate-x-1/2
        w-125
        h-125
        bg-amber-400/10
        blur-[150px]
        rounded-full
        "
      />

      {/* Book */}

      <div
        className="
        relative
        grid
        lg:grid-cols-2
        overflow-hidden
        rounded-[30px]
        border
        border-heritage-gold/20
        shadow-[0_20px_60px_rgba(0,0,0,0.45)]
        "
      >

        {/* Left Page */}

        <div
          className="
          relative
          bg-linear-to-r
          from-[#f3e6c9]
          to-[#e8d6b0]
          text-[#2c1e0f]
          p-6
          md:p-10
          border-r
          border-black/10
          "
        >

          {/* Story Title */}

          <h1 className="text-4xl md:text-5xl font-serif mb-3">
            {story.title}
          </h1>

          {/* Chapter */}

          <p className="text-lg mb-8 opacity-80">
            Chapter {chapter.chapter_number} • {chapter.title}
          </p>

          {/* Chapter Content */}

          <div
            className="
            story-content
            text-base
            md:text-lg
            leading-8
            md:leading-9
            whitespace-pre-line
            "
          >
            {chapter.content}
          </div>

          {/* Left Shadow */}

          <div
            className="
            absolute
            top-0
            right-0
            w-12
            h-full
            bg-linear-to-l
            from-black/10
            to-transparent
            pointer-events-none
            "
          />

        </div>

        {/* Spine */}

        <div
          className="
          hidden
          lg:block
          absolute
          left-1/2
          top-0
          h-full
          w-10
          -translate-x-1/2
          z-20
          pointer-events-none
          bg-linear-to-r
          from-black/10
          via-black/30
          to-black/10
          "
        />

        {/* Right Page */}

        <StoryIllustration
          story={story}
          chapter={chapter}
        />

      </div>

    </div>
  );
};

export default StoryBook;