import React from "react";
import { Heart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const places = [
  {
    place_id:1,
    name: "Khajuraho Temples",
    state: "Madhya Pradesh",
    rating: 4.8,
    image: "/places/khajuraho.jpg",
  },
  {
    place_id:2,
    name: "Hawa Mahal",
    state: "Rajasthan",
    rating: 4.6,
    image: "/places/hawamahal.jpg",
  },
  {
    place_id:3,
    name: "Konark Sun Temple",
    state: "Odisha",
    rating: 4.9,
    image: "/places/konark.jpg",
  },
  {
    place_id:4,
    name: "Red Fort",
    state: "Delhi",
    rating: 4.7,
    image: "/places/redfort.jpg",
  },
];

const HeritageHighlights = () => {
  const navigate = useNavigate();
  return (
    <section className="max-w-7xl mx-auto px-5 py-10 ">

      <div className="flex items-center justify-between mb-6 ">
        <h2 className="text-3xl font-serif text-heritage-gold">
          Heritage Highlights
        </h2>

       <button
  onClick={() => navigate("/places")}
  className="
  px-4
  py-2
  rounded-xl
  bg-heritage-light-gold/30
  border
  border-white/10
  hover:border-heritage-gold
  transition
  hover:scale-105
  cursor-pointer
  "
>
  View All
</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 cursor-pointer">

        {places.map((place, index) => (
          <div
            key={place.place_id}
             onClick={() =>
    navigate(`/places/${place.id}`, {
      state: {
        place: place,
      },
    })
  }
            className="group rounded-2xl overflow-hidden border border-heritage-gold/20 bg-white/5 hover:border-heritage-gold/50 transition-all duration-300"
          >
            <div className="relative overflow-hidden">

              <img
                src={place.image}
                alt={place.name}
                className="h-52 w-full object-cover group-hover:scale-110 transition duration-500"
              />

              <button className="absolute top-3 right-3 h-9 w-9 rounded-full bg-black/40 backdrop-blur flex items-center justify-center">
                <Heart size={18} />
              </button>
            </div>

            <div className="p-4">

              <h3 className="font-semibold text-lg">
                {place.name}
              </h3>

              <div className="flex items-center justify-between mt-2 text-sm text-gray-300">
                <span>{place.state}</span>

                <span className="flex items-center gap-1 text-heritage-gold">
                  <Star size={14} fill="currentColor" />
                  {place.rating}
                </span>
              </div>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HeritageHighlights;