import React, { useState } from "react";
import {
  MapPin,
  Star,
  Heart,
  BookOpen,
  Landmark,
  Clock3,
  Ticket,
  Tag,
  ChevronRight,
} from "lucide-react";

import heroImg from "../assests/1.jpg";

const PlaceDetails = () => {
  const [activeTab, setActiveTab] = useState("About");

  const tabs = ["About", "Gallery", "Stories", "Reviews", "Nearby"];

  return (
    <div className="min-h-screen text-white">

     
      <section className="relative h-125 overflow-hidden">

        <img
          src={heroImg}
          alt="Place"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/70" />

        <div className="absolute bottom-10 left-0 right-0 px-6 md:px-20">

          <span className="px-3 py-1 text-xs rounded-full bg-heritage-gold text-black font-semibold">
            Fort
          </span>

          <h1 className="text-4xl md:text-6xl font-bold mt-4">
            Red Fort
          </h1>

          <div className="flex flex-wrap items-center gap-6 mt-4 text-gray-300">

            <div className="flex items-center gap-2">
              <MapPin size={18} />
              Delhi, India
            </div>

            <div className="flex items-center gap-2 text-yellow-400">
              <Star size={18} fill="currentColor" />
              4.7 (1200 Reviews)
            </div>

          </div>
        </div>

      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 border-b border-heritage-gold/20 pb-4">

          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg transition ${
                activeTab === tab
                  ? "bg-heritage-gold text-black"
                  : "bg-white/5 border border-heritage-gold/20"
              }`}
            >
              {tab}
            </button>
          ))}

        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mt-8">

          {/* Left Side */}
          <div className="lg:col-span-2">

            <h2 className="text-2xl font-bold mb-4">
              About Red Fort
            </h2>

            <p className="text-gray-300 leading-8">
              The Red Fort, or Lal Qila, was commissioned by Mughal Emperor
              Shah Jahan in 1638 as the palace of his new capital
              Shahjahanabad. The fort is named for its massive enclosing
              walls of red sandstone and stands as one of India's most
              iconic heritage sites.
            </p>

            {/* Info Cards */}

            <div className="grid md:grid-cols-2 gap-5 mt-8">

              <div className="bg-white/5 backdrop-blur-md border border-heritage-gold/20 rounded-2xl p-5">
                <p className="text-sm text-gray-400 mb-2">
                  ARCHITECTURAL STYLE
                </p>

                <h3 className="font-semibold text-heritage-gold">
                  Mughal Architecture
                </h3>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-heritage-gold/20 rounded-2xl p-5">
                <p className="text-sm text-gray-400 mb-2">
                  BUILT BY
                </p>

                <h3 className="font-semibold text-heritage-gold">
                  Shah Jahan
                </h3>
              </div>

            </div>

           

            {/* Similar Places */}

            <div className="mt-12">

              <div className="flex justify-between items-center mb-5">

                <h2 className="text-2xl font-bold">
                  Similar Places
                </h2>

                <button className="text-heritage-gold flex items-center gap-1">
                  View All
                  <ChevronRight size={16} />
                </button>

              </div>

              <div className="grid md:grid-cols-3 gap-5">

                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="
                      bg-white/5
                      border
                      border-heritage-gold/20
                      rounded-2xl
                      overflow-hidden
                      hover:scale-105
                      transition
                    "
                  >
                    <img
                      src={heroImg}
                      alt=""
                      className="h-40 w-full object-cover"
                    />

                    <div className="p-4">

                      <h3 className="font-semibold">
                        Amber Fort
                      </h3>

                      <div className="flex items-center gap-1 text-yellow-400 mt-2">
                        <Star size={14} fill="currentColor" />
                        4.8
                      </div>

                    </div>
                  </div>
                ))}

              </div>

            </div>

          </div>

          {/* Right Side */}

          <div>

            <div
              className="
                bg-white/5
                backdrop-blur-md
                border
                border-heritage-gold/20
                rounded-3xl
                p-6
                sticky
                top-24
              "
            >

              <h2 className="font-bold text-xl mb-6">
                Visitor Information
              </h2>

              <div className="space-y-5">

                <div className="flex gap-3">
                  <Landmark className="text-heritage-gold" />
                  <div>
                    <p className="text-sm text-gray-400">
                      Architecture
                    </p>
                    <p>Mughal Architecture</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Clock3 className="text-heritage-gold" />
                  <div>
                    <p className="text-sm text-gray-400">
                      Best Time
                    </p>
                    <p>Oct - Mar</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Ticket className="text-heritage-gold" />
                  <div>
                    <p className="text-sm text-gray-400">
                      Entry Fee
                    </p>
                    <p>₹35 (Indian)</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <MapPin className="text-heritage-gold" />
                  <div>
                    <p className="text-sm text-gray-400">
                      Location
                    </p>
                    <p>Delhi, India</p>
                  </div>
                </div>

              </div>

              {/* Buttons */}

              <div className="mt-8 space-y-3">

                <button
                  className="
                    w-full
                    py-3
                    rounded-xl
                    border
                    border-heritage-gold/30
                    flex
                    items-center
                    justify-center
                    gap-2
                  "
                >
                  <Heart size={18} />
                  Save to Favorites
                </button>

                <button
                  className="
                    w-full
                    py-3
                    rounded-xl
                    bg-heritage-gold
                    text-black
                    font-semibold
                    flex
                    items-center
                    justify-center
                    gap-2
                  "
                >
                  <BookOpen size={18} />
                  Explore Stories
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default PlaceDetails;