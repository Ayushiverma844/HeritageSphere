import React, { useState } from "react";
import { Search ,ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    id: 1,
    name: "Mythology",
    stories: [
      {
        id: 101,
        title: "Ramayana",
        description:
          "The journey of Lord Rama and the victory of good over evil.",
        image: "/stories/ramayana.png",
        coverColor: "#5A2E2A",
      },
      {
        id: 102,
        title: "Mahabharata",
        description:
          "The great epic describing the Kurukshetra war.",
        image: "/stories/mahabharata.png",
        coverColor: "#243447",
      },
      {
        id: 103,
        title: "Krishna",
        description:
          "Life and teachings of Lord Krishna.",
        image: "/stories/krishna.png",
        coverColor: "#1F4D43",
      },
    ],
  },

  {
    id: 2,
    name: "History",
    stories: [
      {
        id: 201,
        title: "Ashoka",
        description:
          "The emperor who embraced Buddhism.",
        image: "/stories/ashoka.png",
        coverColor: "#5B4028",
      },
      {
        id: 202,
        title: "Shivaji",
        description:
          "Founder of the Maratha Empire.",
        image: "/stories/shivaji.png",
        coverColor: "#0F3F44",
      },
      {
        id: 203,
        title: "Akbar",
        description:
          "One of the greatest Mughal emperors.",
        image: "/stories/akbar.png",
        coverColor: "#43305D",
      },
    ],
  },

  {
    id: 3,
    name: "Culture",
    stories: [
      {
        id: 301,
        title: "Yoga",
        description:
          "India's ancient gift to the world.",
        image: "/stories/yoga.png",
        coverColor: "#1E375B",
      },
      {
        id: 302,
        title: "Kathak",
        description:
          "Classical dance form of North India.",
        image: "/stories/kathak.png",
        coverColor: "#5A263E",
      },
      {
        id: 303,
        title: "Bharatanatyam",
        description:
          "Ancient dance tradition of Tamil Nadu.",
        image: "/stories/bharatanatyam.png",
        coverColor: "#22483D",
      },
    ],
  },

  {
    id: 4,
    name: "Freedom",
    stories: [
      {
        id: 401,
        title: "Bhagat Singh",
        description:
          "One of India's greatest freedom fighters.",
        image: "/stories/bhagatsingh.png",
        coverColor: "#5D3422",
      },
      {
        id: 402,
        title: "Subhash Bose",
        description:
          "Leader of the Indian National Army.",
        image: "/stories/bose.png",
        coverColor: "#23374B",
      },
      {
        id: 403,
        title: "Rani Lakshmi Bai",
        description:
          "The Queen of Jhansi.",
        image: "/stories/rani.png",
        coverColor: "#54253A",
      },
    ],
  },
];
const KnowledgeHub = () => {

  const allStories = categories.flatMap((category) =>
  category.stories.map((story) => ({
    ...story,
    category: category.name,
  }))
);

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
  hover:scale-102
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


      {/* ================= BOOK SECTION ================= */}

      <div className="max-w-7xl mx-auto mt-16 pb-24">

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-14 gap-y-16">

    {allStories.map((story) => (

      <Link
        key={story.id}
        to={`/stories/${story.id}`}
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
transform-3d
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
    className="absolute left-0 top-0 w-6 h-full rounded-l-md"
    style={{
      background: `linear-gradient(to right,#2b1b13,${story.coverColor})`,
    }}
  >
    <div className="absolute right-0 top-0 h-full w-0.5 bg-yellow-700/40"></div>
  </div>

  {/* Cover */}

<div
 className="
absolute
left-4
top-0
bottom-5
rounded-r-md
border
overflow-hidden
origin-left
transition-all
duration-700
ease-out
group-hover:transform-[rotateY(-18deg)]
group-hover:shadow-[0_30px_60px_rgba(212,175,55,0.45)]
"
  style={{
    background: story.coverColor,
    borderColor: "#b88935",
    boxShadow:
      "12px 12px 30px rgba(0,0,0,.45), inset 0 0 0 1px rgba(255,215,120,.15)",
  }}
>
     
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

    {/* Decorative Corners */}

    <div className="absolute left-3 top-3  text-yellow-600 text-xl">❦</div>
    <div className="absolute right-3 top-3 text-yellow-600 text-xl rotate-90">❦</div>
    <div className="absolute left-3 bottom-3 text-yellow-600 text-xl -rotate-90">❦</div>
    <div className="absolute right-3 bottom-3 text-yellow-600 text-xl rotate-180">❦</div>

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

    <div className="flex justify-center mt-10">

      <div
        className="w-36 h-36 rounded-full overflow-hidden border-[3px]
        border-yellow-700 shadow-xl"
      >
        <img
          src={story.image}
          alt={story.title}
          className="
w-full
h-full
object-cover
object-center
transition-all
duration-700
group-hover:scale-110
group-hover:rotate-2
brightness-95
group-hover:brightness-110
"
        />
      </div>

    </div>

    {/* Category */}

    <div className="flex justify-center mt-3">

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
        {story.category}
      </span>

    </div>

    {/* Title */}

<h2
  className="
    mt-6
    px-5
    text-center
    font-bold
    text-yellow-100
    leading-tight
    wrap-break-words
    line-clamp-2
    transition-all
duration-500
group-hover:text-yellow-50
  "
  style={{
    fontFamily: "Cormorant Garamond, serif",
    fontSize: story.title.length > 11 ? "1.7rem" : "2rem",
  }}
>
  {story.title}
</h2>

    {/* Description */}

    <p
      className="px-7 mt-4 text-center text-gray-300
group-hover:text-white
transition-colors
duration-500
      text-[17px] leading-7 line-clamp-3"
      style={{ fontFamily: "Cormorant Garamond, serif" }}
    >
      {story.description}
    </p>

    {/* Ornament */}

    <div className="flex justify-center mt-6">

      <div className="w-12 h-0.5 bg-yellow-700"></div>

      <div className="mx-2 text-yellow-700 transition-all duration-500 group-hover:rotate-180 group-hover:scale-125 ">
    ✦
</div>

      <div className="w-12 h-0.5 bg-yellow-700"></div>

    </div>

     <div
className="
absolute
top-0
left-[-120%]
w-1/2
h-full
bg-linear-to-r
from-transparent
via-white/25
to-transparent
skew-x-[-20deg]
transition-all
duration-1000
group-hover:left-[140%]
pointer-events-none
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
group-hover:scale-125
"
/>

  <div
    className="absolute bottom-0 left-4 right-0 h-5 rounded-b-md"
    style={{
      background:
        "linear-gradient(to bottom,#e8d9b6,#c8b18a)",
    }}
  ></div>

  <div
    className="absolute bottom-4 left-4 right-0 h-2"
    style={{
      background:
        "linear-gradient(to bottom,#f7ecd5,#d7c19a)",
    }}
  ></div>

 

</div>

        </div>

      </Link>

    ))}

  </div>


</div>


    </div>
  );
};

export default KnowledgeHub;