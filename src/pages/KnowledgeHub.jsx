import React, { useState } from "react";
import { Search ,ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    id: 1,
    name: "Mythology",
    image: "/categories/mythology.jpg",
    stories: [
      { id: 101, title: "Ramayana" },
      { id: 102, title: "Mahabharata" },
      { id: 103, title: "Krishna" },
    ],
  },

  {
    id: 2,
    name: "History",
    image: "/categories/history.jpg",
    stories: [
      { id: 201, title: "Ashoka" },
      { id: 202, title: "Shivaji" },
      { id: 203, title: "Akbar" },
    ],
  },

  {
    id: 3,
    name: "Culture",
    image: "/categories/culture.jpg",
    stories: [
      { id: 301, title: "Yoga" },
      { id: 302, title: "Kathak" },
      { id: 303, title: "Bharatanatyam" },
    ],
  },

  {
    id: 4,
    name: "Freedom",
    image: "/categories/freedom.jpg",
    stories: [
      { id: 401, title: "Bhagat Singh" },
      { id: 402, title: "Subhash Bose" },
      { id: 403, title: "Rani Lakshmi Bai" },
    ],
  },
];

const KnowledgeHub = () => {
  const [activePlanet, setActivePlanet] = useState(null);

  return (
    <div className="min-h-screen text-white pt-10 px-4 md:px-8">
         <Link
  to="/"
  className="
  inline-flex
  items-center
  gap-2
  mb-8
  px-4
  py-2
  rounded-xl
  bg-white/5
  border
  border-white/10
  text-gray-300
  hover:text-heritage-gold
  hover:border-heritage-gold
  transition-all
  duration-300
  "
>
  <ArrowLeft size={18} />
  Back to Home
</Link>
      {/* Heading */}

      <div className="max-w-7xl mx-auto">
        

        <h1 className="text-4xl md:text-5xl font-bold">
          Explore India's{" "}
          <span className="text-heritage-gold">
            Knowledge
          </span>
        </h1>

        <p className="text-gray-400 mt-4">
          Discover mythology, history, culture and untold stories.
        </p>

        {/* Search */}

        <div className="relative mt-8">

          <Search
            size={22}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search stories..."
            className="
            w-full
            py-4
            pl-14
            pr-5
            rounded-2xl
            bg-white/5
            backdrop-blur-xl
            border
            border-white/10
            outline-none
            focus:border-heritage-gold
            transition-all
            "
          />
        </div>

        {/* Categories */}

        <div className="flex flex-wrap gap-3 mt-6">
            <button
  className="
  px-4
  py-2
  rounded-full
  bg-heritage-gold
  text-black
  font-medium
  shadow-[0_0_20px_rgba(212,175,55,0.4)]
  hover:scale-105
  transition-all
  duration-300
  "
>
  All
</button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              className="
              px-4
              py-2
              rounded-full
              bg-white/5
              border
              border-white/10
              hover:border-heritage-gold
              hover:text-heritage-gold
              transition-all
              duration-300
              "
            >
              {cat.name}
            </button>
          ))}

        </div>
      </div>

      {/* GALAXY */}

      <div className="relative h-300 flex items-center justify-center overflow-hidden">

        {/* Stars */}

        {[...Array(120)].map((_, i) => (
          <span
            key={i}
            className="particle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}

    

        {/* Center Sun */}

        <div
          className="
          absolute
          z-50
          h-40
          w-40
          md:h-56
          md:w-56
          rounded-full
          flex
          flex-col
          items-center
          justify-center
          text-center
          bg-linear-to-br
          from-yellow-300
          to-heritage-gold
          shadow-[0_0_80px_rgba(212,175,55,0.5)]
          animate-pulse
          "
        >
          <h2 className="text-black text-2xl md:text-3xl font-bold">
            Knowledge
          </h2>

          <p className="text-black/70 text-sm">
           Galaxy
          </p>
        </div>

        {/* PLANETS */}

        {categories.map((cat, index) => {
          const orbitSize = 350 + index * 120;

          return (
            <div
              key={cat.id}
              className="orbit-wrapper"
              style={{
                width: `${orbitSize}px`,
                height: `${orbitSize}px`,
                animationDuration: `${40 + index * 15}s`,
              }}
            >
              <div
                className="absolute left-1/2 -top-12 -translate-x-1/2"
                onMouseEnter={() =>
                  setActivePlanet(cat.id)
                }
                onMouseLeave={() =>
                  setActivePlanet(null)
                }
              >
                {/* Planet */}

                <div
                  className="
                  relative
                  w-20
                  h-20
                  md:w-24
                  md:h-24
                  rounded-full
                  overflow-hidden
                  border-2
                  border-heritage-gold
                  cursor-pointer
                  transition-all
                  duration-500
                  hover:scale-110
                  hover:shadow-[0_0_60px_rgba(212,175,55,0.6)]
                  "
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Planet Name */}

                <p className="text-center mt-3 text-sm font-medium whitespace-nowrap">
                  {cat.name}
                </p>

                {/* Planet Info */}

                {activePlanet === cat.id && (
                  <div
                    className="
                    absolute
                    top-32
                    left-1/2
                    -translate-x-1/2
                    min-w-45
                    p-4
                    rounded-2xl
                    bg-white/10
                    backdrop-blur-xl
                    border
                    border-white/10
                    text-center
                    animate-fadeUp
                    z-50
                    "
                  >
                    <h3 className="text-heritage-gold font-semibold">
                      {cat.name}
                    </h3>

                    <p className="text-xs text-gray-300 mt-1">
                      Explore stories from {cat.name}
                    </p>
                  </div>
                )}

                {/* Moons */}

                {activePlanet === cat.id && (
                  <div className="moon-system">

                    {cat.stories.map((story, moonIndex) => {

                      const angle =
                        (360 / cat.stories.length) *
                        moonIndex;

                      const moonRadius = 100;

                      const x =
                        Math.cos(
                          (angle * Math.PI) / 180
                        ) * moonRadius;

                      const y =
                        Math.sin(
                          (angle * Math.PI) / 180
                        ) * moonRadius;

                      return (
                        <Link
                          key={story.id}
                          to={`/story/${story.id}`}
                          className="
                          moon
                          absolute
                          w-16
                          h-16
                          rounded-full
                          bg-white
                          text-heritage-dark
                          text-[10px]
                          text-center
                          flex
                          items-center
                          justify-center
                          p-1
                          transition-all
                          duration-300
                          hover:bg-heritage-gold
                          hover:scale-110
                          hover:shadow-[0_0_25px_rgba(212,175,55,0.7)]
                          "
                          style={{
                            left: x + 50,
                            top: y + 50,
                          }}
                        >
                          {story.title}
                        </Link>
                      );
                    })}

                  </div>
                )}

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KnowledgeHub;