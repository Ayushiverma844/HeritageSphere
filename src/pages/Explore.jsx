import React, { useState } from "react";
import {
  Search,
  Star,
  ChevronDown,
  Landmark,
  Castle,
  Building2,
  Trees,
  ScrollText,
  SlidersHorizontal ,
    MapPin, Heart
} from "lucide-react";


const categories = [
  { id: 1, name: "Temples", icon: Landmark },
  { id: 2, name: "Forts", icon: Castle },
  { id: 3, name: "Palaces", icon: Building2 },
  { id: 4, name: "Museums", icon: ScrollText },
  { id: 5, name: "Nature", icon: Trees },

  // Hidden initially
  { id: 6, name: "Monuments", icon: Landmark },
  { id: 7, name: "Lakes", icon: Trees },
  { id: 8, name: "Caves", icon: Castle },
  { id: 9, name: "Gardens", icon: Trees },
  { id: 10, name: "Churches", icon: Building2 },
  { id: 11, name: "Mosques", icon: Building2 },
  { id: 12, name: "UNESCO", icon: Landmark },
];

const places = [
  {
    id: 1,
    name: "Hawa Mahal",
    category: "Palace",
    location: "Jaipur, Rajasthan",
    rating: 4.8,
    reviews: 890,
    price: 50,
    image: "/places/hawamahal.jpg",
    height: "h-[320px]",
  },
  {
    id: 2,
    name: "Konark Sun Temple",
    category: "Temple",
    location: "Konark, Odisha",
    rating: 4.9,
    reviews: 320,
    price: 40,
    image: "/places/konark.jpg",
    height: "h-[450px]",
  },
  {
    id: 3,
    name: "Red Fort",
    category: "Fort",
    location: "Delhi",
    rating: 4.7,
    reviews: 1120,
    price: 60,
    image: "/places/redfort.jpg",
    height: "h-[280px]",
  },
  {
    id: 4,
    name: "Khajuraho Temples",
    category: "Temple",
    location: "Madhya Pradesh",
    rating: 4.8,
    reviews: 540,
    price: 45,
    image: "/places/khajuraho.jpg",
    height: "h-[400px]",
  },
  {
    id: 5,
    name: "Amer Fort",
    category: "Fort",
    location: "Jaipur, Rajasthan",
    rating: 4.7,
    reviews: 760,
    price: 55,
    image: "/places/amerfort.jpg",
    height: "h-[300px]",
  },
  {
    id: 6,
    name: "Victoria Memorial",
    category: "Monument",
    location: "Kolkata, West Bengal",
    rating: 4.6,
    reviews: 980,
    price: 35,
    image: "/places/victoria.jpg",
    height: "h-[420px]",
  },
];

const Explore = () => {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen text-white pt-28">
      

      {/* Heading */}
      <div className="max-w-7xl mx-auto px-5">

        <h1 className="text-5xl md:text-6xl font-bold">
          Explore India's{" "}
          <span className="text-heritage-gold">
            Heritage
          </span>
        </h1>

        <p className="text-gray-400 mt-4 max-w-2xl">
          Discover timeless monuments, temples,
          forts and cultural wonders.
        </p>

        {/* Search */}
       <div className="mt-10 flex gap-4">

  {/* Search */}
  <div
    className="
    flex-1
    flex items-center gap-3
    px-5 py-4
    rounded-2xl
    bg-white/5
    border border-white/10
    focus-within:border-heritage-gold
    "
  >
    <Search size={20} />

    <input
      type="text"
      placeholder="Search heritage places..."
      className="bg-transparent outline-none w-full"
    />
  </div>

  {/* Filter Button */}
  <button
    onClick={() => setShowFilters(!showFilters)}
    className="
    px-6
    rounded-2xl
    border
    border-heritage-gold/40
    bg-white/5
    flex
    items-center
    gap-2
    text-heritage-gold
    hover:bg-heritage-gold/10
    transition-all
    duration-300
    "
  >
    <SlidersHorizontal size={18} />
    Filters
  </button>

</div>
        {/* Categories */}

        <div className="mt-10">

  <div className="flex flex-wrap gap-5">

    {(showAllCategories
      ? categories
      : categories.slice(0, 5)
    ).map((item) => {
      const Icon = item.icon;

      return (
        <button
          key={item.id}
          className="
          group
          flex
          flex-col
          items-center
          gap-2
          "
        >
          <div
            className="
            h-16 w-16
            rounded-full
            border border-heritage-gold/30
            bg-white/5
            backdrop-blur-md
            flex items-center justify-center
            text-heritage-gold
            transition-all duration-300
            group-hover:scale-110
            group-hover:border-heritage-gold
            group-hover:shadow-[0_0_20px_rgba(212,175,55,0.2)]
            "
          >
            <Icon size={24} />
          </div>

          <span className="text-sm text-gray-300">
            {item.name}
          </span>
        </button>
      );
    })}

    {/* View All */}
    <button
      onClick={() =>
        setShowAllCategories(!showAllCategories)
      }
      className="
      group
      flex
      flex-col
      items-center
      gap-2
      "
    >
      <div
        className="
        h-16 w-16
        rounded-full
        border border-dashed border-heritage-gold/40
        bg-white/5
        flex items-center justify-center
        text-heritage-gold
        transition-all duration-300
        group-hover:scale-110
        "
      >
        +
      </div>

      <span className="text-sm text-gray-300">
        {showAllCategories
          ? "View Less"
          : "View All"}
      </span>
    </button>

  </div>
  <div
  className={`
  overflow-hidden
  transition-all
  duration-500
  ${showFilters ? "max-h-75 mt-8" : "max-h-0"}
  `}
>
  <div
    className="
    p-6
    rounded-3xl
    bg-white/5
    border border-white/10
    backdrop-blur-xl
    "
  >

    <div className="grid md:grid-cols-2 gap-6">

      {/* State */}
      <div>

        <label className="block mb-3 text-gray-300">
          State
        </label>

        <select
          className="
          w-full
          p-4
          rounded-xl
          bg-heritage-dark
          border border-white/10
          outline-none
          "
        >
          <option>All States</option>
          <option>Rajasthan</option>
          <option>Madhya Pradesh</option>
          <option>Delhi</option>
          <option>Tamil Nadu</option>
          <option>Odisha</option>
        </select>

      </div>

      {/* Sort */}
      <div>

        <label className="block mb-3 text-gray-300">
          Sort By
        </label>

        <select
          className="
          w-full
          p-4
          rounded-xl
          bg-heritage-dark
          border border-white/10
          outline-none
          "
        >
          <option>Popular</option>
          <option>Highest Rated</option>
          <option>Most Reviewed</option>
          <option>Name A-Z</option>
        </select>

      </div>

    </div>

  </div>
</div>

</div>

      </div>

      {/* Gallery */}

      <div className="max-w-7xl mx-auto px-5 mt-16 pb-20">

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">

          {places.map((place) => (
            <div
              key={place.id}
              className="
              relative
              mb-5
              overflow-hidden
              rounded-3xl
              break-inside-avoid
              cursor-pointer
              group
              "
            >
              <img
                src={place.image}
                alt={place.name}
                className={`
                  w-full
                  object-cover
                  ${place.height}
                  transition-transform
                  duration-700
                  group-hover:scale-110
                `}
              />

              <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />

              <div className="absolute bottom-5 left-5">

                <h3 className="text-2xl font-semibold">
                  {place.name}
                </h3>

                <div className="flex items-center gap-2 mt-2">

                  <Star
                    size={16}
                    fill="#d4af37"
                    color="#d4af37"
                  />

                  <span>{place.rating}</span>

                </div>

              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};

export default Explore;