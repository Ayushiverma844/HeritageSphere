import React from "react";

const StorySkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-14 gap-y-16">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="
            relative
            w-75
            h-120
            mx-auto
            animate-pulse
          "
        >
          {/* Spine */}
          <div className="absolute left-0 top-0 w-6 h-full rounded-l-md bg-white/5" />

          {/* Cover */}
          <div className="absolute left-4 top-0 right-0 bottom-5 rounded-r-md bg-white/5 border border-white/10 overflow-hidden">

            {/* Image */}
            <div className="flex justify-center pt-10">
              <div className="w-36 h-36 rounded-full bg-white/10" />
            </div>

            {/* Category */}
            <div className="flex justify-center mt-5">
              <div className="w-24 h-6 rounded-full bg-white/10" />
            </div>

            {/* Title */}
            <div className="px-8 mt-8 space-y-3">
              <div className="h-6 rounded bg-white/10" />
              <div className="h-6 w-3/4 mx-auto rounded bg-white/10" />
            </div>

            {/* Summary */}
            <div className="px-7 mt-8 space-y-3">
              <div className="h-4 rounded bg-white/10" />
              <div className="h-4 rounded bg-white/10" />
              <div className="h-4 w-4/5 mx-auto rounded bg-white/10" />
            </div>

            {/* Footer */}
            <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-3">
              <div className="w-32 h-4 rounded bg-white/10" />
              <div className="w-28 h-4 rounded bg-white/10" />
              <div className="w-40 h-3 rounded bg-white/10" />
            </div>
          </div>

          {/* Pages */}
          <div className="absolute bottom-0 left-4 right-0 h-5 rounded-b-md bg-white/10" />
          <div className="absolute bottom-4 left-4 right-0 h-2 bg-white/10" />
        </div>
      ))}
    </div>
  );
};

export default StorySkeleton;