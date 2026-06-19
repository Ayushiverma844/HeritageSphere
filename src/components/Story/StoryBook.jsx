import StoryIllustration from "./StoryIllustration";

const StoryBook = () => {
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
          <h1 className="text-4xl md:text-5xl font-serif mb-3">
            Ramayana
          </h1>

          <p className="text-lg mb-8 opacity-80">
            The Epic of Lord Rama
          </p>

          <div className="story-content text-base md:text-lg leading-8 md:leading-9">
            <p>
              The Ramayana, composed by the sage Valmiki,
              is one of the greatest epics of ancient India.
              It tells the story of Rama, the seventh avatar
              of Vishnu, who is exiled from his kingdom for
              fourteen years due to a conspiracy in the royal
              court.
            </p>

            <br />

            <p>
              His devoted wife Sita and loyal brother
              Lakshmana accompany him into exile. During
              their exile, the demon king Ravana abducts
              Sita and takes her to Lanka.
            </p>
          </div>

          {/* Left Page Curve Shadow */}

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

        {/* Book Spine */}

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

        <StoryIllustration />
      </div>
    </div>
  );
};

export default StoryBook;