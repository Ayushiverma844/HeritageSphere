import React, { useEffect, useState } from "react";
import { Star, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import collectionService from "../../services/collectionService";

const HeritageHighlights = () => {
  const navigate = useNavigate();

  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedItems, setSavedItems] = useState([]);

  // =========================
  // FETCH PLACES
  // =========================
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/places?page=1&limit=4"
        );

        if (res.data.success) {
          setPlaces(res.data.places);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  // =========================
  // FETCH SAVED ITEMS
  // =========================
  useEffect(() => {
    fetchSavedItems();
  }, []);

  const fetchSavedItems = async () => {
    try {
      const res = await collectionService.getMyCollection();

      const placeIds = (res.places || []).map(
        (p) => p.place_id
      );

      setSavedItems(placeIds);
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // SAVE / UNSAVE
  // =========================
  const handleSave = async (place) => {
    try {
      const isSaved = savedItems.includes(place.place_id);

      if (isSaved) {
        await collectionService.removeItem(
          "PLACE",
          place.place_id
        );

        setSavedItems((prev) =>
          prev.filter((id) => id !== place.place_id)
        );
      } else {
        await collectionService.saveItem(
          "PLACE",
          place.place_id
        );

        setSavedItems((prev) => [
          ...prev,
          place.place_id,
        ]);
      }
    } catch (err) {
      console.log("Save error:", err);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-5 py-10 ">

      <div className="flex items-center justify-between mb-6 ">
        <h2 className="text-3xl font-serif text-heritage-gold">
          Heritage Highlights
        </h2>

        <button
          onClick={() => navigate("/places")}
          className="
          px-4 py-2 rounded-xl
          bg-heritage-light-gold/30
          border border-white/10
          hover:border-heritage-gold
          transition hover:scale-105 cursor-pointer
          "
        >
          View All
        </button>
      </div>

      {loading ? (
        <div className="text-white/60">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 cursor-pointer">

          {places.map((place) => (
            <div
              key={place.place_id}
              onClick={() =>
                navigate(`/places/${place.place_id}`, {
                  state: { place },
                })
              }
              className="group rounded-2xl overflow-hidden border border-heritage-gold/20 bg-white/5 hover:border-heritage-gold/50 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative overflow-hidden">

                <img
                  src={place.image_url}
                  alt={place.name}
                  className="h-52 w-full object-cover group-hover:scale-110 transition duration-500"
                />

                {/* BOOKMARK BUTTON */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSave(place);
                  }}
                  className="absolute top-3 right-3 h-9 w-9 rounded-full bg-black/40 backdrop-blur flex items-center justify-center cursor-pointer"
                >
                  <Bookmark
                    size={18}
                    className={
                      savedItems.includes(place.place_id)
                        ? "text-heritage-gold fill-heritage-gold"
                        : "text-white"
                    }
                  />
                </button>

              </div>

              {/* Content */}
              <div className="p-4">

                <h3 className="font-semibold text-lg">
                  {place.name}
                </h3>

                <div className="flex items-center justify-between mt-2 text-sm text-gray-300">
                  <span>{place.state}</span>

                  <span className="flex items-center gap-1 text-heritage-gold">
                    <Star size={14} fill="currentColor" />
                    {place.average_rating || "0.0"}
                  </span>
                </div>

              </div>

            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default HeritageHighlights;