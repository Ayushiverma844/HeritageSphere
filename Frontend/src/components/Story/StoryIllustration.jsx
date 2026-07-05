const StoryIllustration = ({ story, chapter }) => {

  const image =
    chapter?.image_url ||
    story?.cover_image ||
    "/stories/default.jpg";

  return (
    <div
      className="
      relative
      bg-linear-to-l
      from-[#ecdcb8]
      to-[#f3e6c9]
      p-6
      md:p-10
      flex
      flex-col
      justify-center
      items-center
      "
    >
      {/* Right Page Curve Shadow */}

      <div
        className="
        absolute
        top-0
        left-0
        w-12
        h-full
        bg-linear-to-r
        from-black/10
        to-transparent
        pointer-events-none
        "
      />

      {/* Illustration */}

      <img
        src={image}
        alt={chapter?.title || story?.title}
        className="
        w-full
        max-w-md
        h-70
        md:h-105
        object-cover
        rounded-2xl
        shadow-[0_10px_30px_rgba(0,0,0,0.25)]
        border
        border-black/10
        transition-all
        duration-500
        hover:scale-[1.02]
        "
      />

      {/* Quote */}

      <div className="mt-8 text-center max-w-md">

        <p
          className="
          text-xl
          italic
          text-[#3b2b1d]
          font-serif
          "
        >
          {chapter?.quote || "No quote available."}
        </p>

        <div
          className="
          mt-4
          w-20
          h-0.5
          bg-amber-700/40
          mx-auto
          "
        />

        <p
          className="
          mt-3
          text-sm
          tracking-widest
          uppercase
          text-[#5a4632]
          "
        >
          {story?.title}
        </p>

      </div>

    </div>
  );
};

export default StoryIllustration;