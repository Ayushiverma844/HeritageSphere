import React from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const stories = [
  {
    story_id: 1,
    title: "Ramayana",
    subtitle: "The epic of Lord Rama",
    image: "/stories/ramayana.jpg",
  },
  {
    story_id: 2,
    title: "Mahabharata",
    subtitle: "The great Indian epic",
    image: "/stories/mahabharata.jpg",
  },
  {
    story_id: 3,
    title: "The Legend of Krishna",
    subtitle: "The untold stories",
    image: "/stories/krishna.jpg",
  },
  {
    story_id: 4,
    title: "Samudra Manthan",
    subtitle: "The cosmic churning",
    image: "/stories/samudra.jpg",
  },
];

const EpicTales = () => {
  const navigate = useNavigate();
  return (
    <section className="max-w-7xl mx-auto px-5 py-10">

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-serif text-heritage-gold">
          Epic Tales
        </h2>

         <button
            onClick={() => navigate("/knowledge-hub")}
            className="px-4 py-2 rounded-xl bg-heritage-light-gold/30 border border-white/10
  hover:border-heritage-gold transition hover:scale-105 cursor-pointer">
  View All
</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 cursor-pointer">

        {stories.map((story, index) => (
          <div
            key={story.story_id}
             onClick={() => navigate(`/stories/${story.story_id}`)}
            className="group relative rounded-2xl overflow-hidden border border-heritage-gold/20"
          >
            <img
              src={story.image}
              alt={story.title}
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

              <button
  onClick={(e)=>{
    e.stopPropagation();
    navigate(`/stories/${story.story_id}`);
}}
  className="
  absolute
  bottom-4
  right-4
  h-10
  w-10
  rounded-full
  border
  border-white/30
  flex
  items-center
  justify-center
  hover:border-heritage-gold
  "
>
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