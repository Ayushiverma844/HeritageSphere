const StoryIllustration = ({ story, chapter }) => {
  const image =
    chapter?.image_url ||
    story?.cover_image ||
    "/stories/default.jpg";

  return (
    <div
      className="
      relative
      h-full
      bg-linear
      -to-l
      from-[#ecdcb8]
      to-[#f3e6c9]
      px-4
      sm:px-6
      lg:px-8
      pt-4
      sm:pt-5
      lg:pt-6
      pb-4
      sm:pb-5
      lg:pb-6
      flex
      flex-col
      "
    >
      {/* Left Page Shadow */}
      <div
        className="
        absolute
        top-0
        left-0
        w-10
        lg:w-12
        h-full
        bg-linear
        -to-r
        from-black/10
        to-transparent
        pointer-events-none
        "
      />

      {/* Image */}
      <div className="flex justify-center">
        <img
          src={image}
          alt={chapter?.title || story?.title}
          className="
          w-full
          rounded-2xl
          border
          border-black/10
          object-cover
          object-top

          h-64
          sm:h-80
          md:h-105
          lg:h-125
          xl:h-135

          shadow-[0_15px_35px_rgba(0,0,0,0.25)]
          transition-all
          duration-500
          hover:scale-[1.015]
          "
        />
      </div>

      {/* Quote */}
      <div
        className="
        mt-4
        sm:mt-5
        lg:mt-6
        text-center
        px-1
        sm:px-2
        lg:px-3
        "
      >
        <p
          className="
          text-base
          sm:text-lg
          lg:text-xl
          italic
          leading-relaxed
          font-serif
          text-[#3b2b1d]
          "
        >
          {chapter?.quote || "No quote available."}
        </p>

        <div
          className="
          w-14
          sm:w-16
          h-0.5
          bg-amber-700/40
          mx-auto
          mt-3
          sm:mt-4
          "
        />

        <p
          className="
          mt-2
          sm:mt-3
          text-[10px]
          sm:text-xs
          tracking-[2px]
          sm:tracking-[3px]
          uppercase
          text-[#6a5038]
          "
        >
          {story?.title}
        </p>
      </div>
    </div>
  );
};

export default StoryIllustration;