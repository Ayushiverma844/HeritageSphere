import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import storyService from "../../services/storyService";

const EpicTales = () => {

  const navigate = useNavigate();

  const [stories, setStories] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {

    try {

      const res = await storyService.getStories({
        limit: 4,
        sort: "newest",
      });

      setStories(res.stories);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  return (

    <section className="max-w-7xl mx-auto px-5 py-10 mb-8">

      {/* Heading */}

      <div className="flex items-center justify-between mb-6">

        <h2 className="text-3xl font-serif text-heritage-gold">

          Epic Tales

        </h2>

        <button
          onClick={() => navigate("/knowledge-hub")}
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

      {/* Cards */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        {loading ? (

          [...Array(4)].map((_, index) => (

            <div
              key={index}
              className="
              h-72
              rounded-2xl
              bg-white/5
              animate-pulse
              "
            />

          ))

        ) : (

          stories.map((story) => (

            <div

              key={story.story_id}

              onClick={() => navigate(`/stories/${story.slug}`)}

              className="
              group
              relative
              rounded-2xl
              overflow-hidden
              border
              border-heritage-gold/20
              cursor-pointer
              "

            >

              <img

                src={story.cover_image}

                alt={story.title}

                className="
                h-65
                w-full
                object-cover
                group-hover:scale-110
                transition
                duration-500
                "

              />

              <div className="absolute inset-0 " />
              
{/* Dark Gradient */}
<div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent"></div>

              <div className="absolute bottom-0 p-5 w-full">

                <h3 className="font-semibold text-mauve-50 text-sm">

                  {story.title}

                </h3>

               

                <button

                  onClick={(e) => {

                    e.stopPropagation();

                    navigate(`/stories/${story.slug}`);

                  }}

                  className="
                  absolute
                  bottom-4
                  right-4
                  h-10
                  w-10                  rounded-full
                  border
                  border-white/30
                  flex
                  items-center
                  justify-center
                  hover:border-heritage-gold
                  cursor-pointer
                  "

                >

                  <ArrowRight size={16} className="text-mauve-50" />

                </button>

              </div>

            </div>

          ))

        )}

      </div>

    </section>

  );

};

export default EpicTales;