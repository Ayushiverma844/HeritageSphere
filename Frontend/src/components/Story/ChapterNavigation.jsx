import { ChevronLeft, ChevronRight } from "lucide-react";

const ChapterNavigation = () => {
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
  className="
  flex
  items-center
  gap-2
  px-6
  py-3
  rounded-xl
  bg-amber-200
  text-[#2c1e0f]
  font-semibold
  hover:scale-105
  transition-all
  duration-300
  "
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
        Chapter 1 of 6
      </div>


{/* Next */}

<button
  className="
  flex
  items-center
  gap-2
  px-6
  py-3
  rounded-xl
  bg-heritage-gold
  text-black
  font-semibold
  hover:scale-105
  hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]
  transition-all
  duration-300
  "
>
  Next Chapter
  <ChevronRight size={18} />
</button>

     
     
    </div>
  );
};

export default ChapterNavigation;