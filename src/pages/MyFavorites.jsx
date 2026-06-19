import React, { useState } from "react";
import {
  ArrowLeft,
  Heart,
  Bookmark,
  MapPin,
  Star,
   Clock3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import img from "../assests/1.jpg";

const Favorites = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("all");

  const activities = [
  {
    id: 1,
    type: "liked",
    title: "Liked Red Fort",
    place: "Red Fort",
    location: "Delhi, India",
    rating: 4.7,
    image: img,
    date: "January 2025",
  },
  {
    id: 2,
    type: "pending",
    title: "Added Taj Mahal To Pending",
    place: "Taj Mahal",
    location: "Agra, India",
    rating: 4.9,
    image: img,
    date: "February 2025",
  },
  {
    id: 3,
    type: "liked",
    title: "Liked Qutub Minar",
    place: "Qutub Minar",
    location: "Delhi, India",
    rating: 4.6,
    image: img,
    date: "March 2025",
  },
  {
    id: 4,
    type: "pending",
    title: "Added Konark Temple To Pending",
    place: "Konark Temple",
    location: "Odisha, India",
    rating: 4.8,
    image: img,
    date: "April 2025",
  },
];

  const filteredData =
  activeTab === "all"
    ? activities
    : activities.filter(
        (item) => item.type === activeTab
      );

  return (
    <div className="min-h-screen text-white px-4 md:px-10 py-10">

      {/* Back Button */}

      <div className="max-w-6xl mx-auto mb-8">
        <button
          onClick={() => navigate("/")}
          className="
            flex items-center gap-2
            text-heritage-gold
            hover:-translate-x-1
            transition
          "
        >
          <ArrowLeft size={18} />
          Back to Home
        </button>
      </div>

      {/* Header */}

      <div className="text-center mb-12">

        <h1 className="text-4xl md:text-5xl font-bold">
          My Heritage Journey
        </h1>

        <p className="text-gray-400 mt-4">
          Places you love and places waiting to be explored
        </p>

      </div>

      {/* Tabs */}

      <div className="flex justify-center gap-4 mb-16 flex-wrap">

  <button
    onClick={() => setActiveTab("all")}
    className={`px-6 py-3 rounded-xl transition ${
      activeTab === "all"
        ? "bg-heritage-gold text-black"
        : "bg-white/5 border border-heritage-gold/20"
    }`}
  >
    All
  </button>

  <button
    onClick={() => setActiveTab("pending")}
    className={`px-6 py-3 rounded-xl flex items-center gap-2 transition ${
      activeTab === "pending"
        ? "bg-heritage-gold text-black"
        : "bg-white/5 border border-heritage-gold/20"
    }`}
  >
    <Clock3 size={16} />
    Pending
  </button>

  <button
    onClick={() => setActiveTab("liked")}
    className={`px-6 py-3 rounded-xl flex items-center gap-2 transition ${
      activeTab === "liked"
        ? "bg-heritage-gold text-black"
        : "bg-white/5 border border-heritage-gold/20"
    }`}
  >
    <Heart size={16} />
    Liked
  </button>

</div>

      {/* Timeline */}

      <div className="max-w-6xl mx-auto">

        <h2 className="text-3xl font-bold text-heritage-gold mb-10">
          Heritage Activity
        </h2>

        <div className="relative">

          {/* Timeline Line */}

          <div
            className="
              absolute
              left-4
              top-0
              bottom-0
              w-0.5
              bg-heritage-gold/40
            "
          />

          {filteredData.map((item) => (

            <div
              key={item.id}
              className="
                relative
                flex
                flex-col
                lg:flex-row
                gap-6
                mb-14
                pl-12
              "
            >

              {/* Timeline Dot */}

             <div
  className="
    absolute
    left-0
    top-4
    w-8
    h-8
    rounded-full
    bg-heritage-gold
    flex
    items-center
    justify-center
    shadow-[0_0_15px_rgba(212,175,55,0.8)]
  "
>
  {item.type === "liked" ? (
    <Heart
      size={16}
      className="text-black fill-black"
    />
  ) : (
    <Clock3
      size={16}
      className="text-black"
    />
  )}
</div>

              {/* Activity Card */}

              <div className="lg:w-1/3">

                <div
                  className="
                    bg-white/5
                    backdrop-blur-md
                    border
                    border-heritage-gold/20
                    rounded-2xl
                    p-5
                  "
                >

                  <p className="text-heritage-gold text-sm mb-2">
                    {item.date}
                  </p>

                  <h3 className="font-semibold text-lg">
                    {item.title}
                  </h3>

                </div>

              </div>

              {/* Place Preview */}

              <div
                className="
                  lg:w-2/3
                  bg-white/5
                  backdrop-blur-md
                  border
                  border-heritage-gold/20
                  rounded-3xl
                  overflow-hidden
                  hover:border-heritage-gold/50
                  transition-all
                  duration-300
                "
              >

                <div className="flex flex-col md:flex-row">

                  <img
                    src={item.image}
                    alt={item.place}
                    className="
                      md:w-72
                      h-60
                      object-cover
                    "
                  />

                  <div className="p-6 flex-1">

                    <h3 className="text-2xl font-bold">
                      {item.place}
                    </h3>

                    <div className="flex items-center gap-2 text-gray-400 mt-3">
                      <MapPin size={16} />
                      {item.location}
                    </div>

                    <div className="flex items-center gap-2 text-yellow-400 mt-3">
                      <Star
                        size={16}
                        fill="currentColor"
                      />
                      {item.rating}
                    </div>

                    <p className="text-gray-400 mt-5 leading-7">
                      Explore the history,
                      architecture and cultural
                      significance of this
                      remarkable heritage site.
                    </p>

                    <button
                      className="
                        mt-5
                        px-5
                        py-2.5
                        rounded-xl
                        bg-heritage-gold
                        text-black
                        font-semibold
                        hover:scale-105
                        transition
                      "
                    >
                      View Details
                    </button>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
};

export default Favorites;