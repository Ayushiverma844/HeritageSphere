import React from "react";
import {
  Search,
  Landmark,
  Castle,
  Building2,
  ScrollText,
  Trees,
  Ellipsis,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import img from "../../assests/bg2.jpg";

const categories = [
  { name: "Temple", icon: Landmark },
  { name: "Fort", icon: Castle },
  { name: "Palace", icon: Building2 },
  { name: "Museum", icon: ScrollText },
  { name: "Monument", icon: Landmark },
  { name: "Natural Attraction", icon: Trees },
  { name: "More", icon: Ellipsis },
];

const Landing = () => {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-[85vh] overflow-hidden rounded-b-3xl  ">

      {/* Background Image */}
      <img
  src={img}
  alt="Heritage"
  className="absolute inset-0 w-full h-full object-cover scale-x-[-1] "
/>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Blue Side Gradient */}
     <div className="absolute inset-0 bg-linear-to-r from-heritage-dark/90 via-heritage-dark/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 pt-32 pb-20">

        {/* Heading */}
        <div className="max-w-2xl">

          <h1 className="text-4xl md:text-6xl font-serif font-semibold text-gray-100 leading-tight">
            Discover. Explore.
            <br />
            Preserve Our{" "}
            <span className="text-heritage-gold">
              Heritage
            </span>
          </h1>

          <p className="mt-5 text-gray-200 text-lg leading-relaxed">
            Explore the timeless beauty of India's cultural
            heritage, historic places and epic stories.
          </p>

          {/* Search */}
          <div className="mt-8 max-w-xl">
            <div className="bg-white rounded-2xl px-5 py-4 flex items-center justify-between shadow-2xl hover:scale-105 transition-all ease-in-out">

              <input
                type="text"
                placeholder="Search for places, stories, categories..."
                className="w-full outline-none text-gray-700 bg-transparent"
              />

              <button>
                <Search
                  size={22}
                  className="text-gray-600"
                />
              </button>

            </div>
          </div>

          {/* Categories */}
          <div className="mt-10 flex flex-wrap gap-5">

            {categories.map((item, index) => {
              const Icon = item.icon;

              return (
                <button key={item.name}
                     onClick={() =>navigate("/places", {
                                state: {
                                category: item.name,},})}
                   className="group flex flex-col items-center gap-2">
                  <div
                    className="
                    h-16 w-16
                    rounded-full
                    border border-heritage-gold/40
                    bg-transparent
                    backdrop-blur-md
                    flex items-center justify-center
                    text-heritage-gold
                    transition-all duration-300
                    group-hover:scale-120
                    group-hover:border-heritage-gold
                    group-hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]
                    cursor-pointer
                  "
                  >
                    <Icon size={24} />
                  </div>

                  <span className="text-sm text-white">
                    {item.name}
                  </span>
                </button>
              );
            })}

          </div>

        </div>
      </div>
    </section>
  );
};

export default Landing;