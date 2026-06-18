import React from "react";
import { ArrowRight } from "lucide-react";

const stories = [
  {
    title: "Ramayana",
    subtitle: "The epic of Lord Rama",
    image: "/stories/ramayana.jpg",
  },
  {
    title: "Mahabharata",
    subtitle: "The great Indian epic",
    image: "/stories/mahabharata.jpg",
  },
  {
    title: "The Legend of Krishna",
    subtitle: "The untold stories",
    image: "/stories/krishna.jpg",
  },
  {
    title: "Samudra Manthan",
    subtitle: "The cosmic churning",
    image: "/stories/samudra.jpg",
  },
];

const EpicTales = () => {
  return (
    <section className="max-w-7xl mx-auto px-5 py-10">

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-serif text-heritage-gold">
          Epic Tales
        </h2>

        <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-heritage-gold transition">
          View All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        {stories.map((story, index) => (
          <div
            key={index}
            className="group relative rounded-2xl overflow-hidden border border-heritage-gold/20"
          >
            <img
              src={story.image}
              alt=""
              className="h-52 w-full object-cover group-hover:scale-110 transition duration-500"
            />

            <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />

            <div className="absolute bottom-0 p-4 w-full">

              <h3 className="font-semibold text-lg">
                {story.title}
              </h3>

              <p className="text-sm text-gray-300 mt-1">
                {story.subtitle}
              </p>

              <button className="absolute bottom-4 right-4 h-10 w-10 rounded-full border border-white/30 flex items-center justify-center hover:border-heritage-gold">
                <ArrowRight size={18} />
              </button>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EpicTales;