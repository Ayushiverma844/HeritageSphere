import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Star,
  BookOpen,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import collectionService from "../services/collectionService";

const MyCollection = () => {
  const navigate = useNavigate();

  const [collection, setCollection] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchCollection();
  }, []);

  const fetchCollection = async () => {
    try {
      setLoading(true);

      const data = await collectionService.getMyCollection();

      const places = (data.places || []).map((item) => ({
        ...item,
        item_type: "PLACE",
      }));

      const stories = (data.stories || []).map((item) => ({
        ...item,
        item_type: "STORY",
      }));

      const merged = [...places, ...stories].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setCollection(merged);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (item) => {



    try {
      await collectionService.removeItem(
        item.item_type,
        item.item_type === "PLACE"
          ? item.place_id
          : item.story_id
      );

      setCollection((prev) =>
        prev.filter(
          (saved) => saved.saved_id !== item.saved_id
        )
      );
    } catch (err) {
      console.log(err);
      alert("Failed to remove item.");
    }
  };

  const filteredData = useMemo(() => {
    if (activeTab === "all") return collection;
    return collection.filter((item) => item.item_type === activeTab);
  }, [collection, activeTab]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-xl">
        Loading...
      </div>
    );
  }

  if (!loading && filteredData.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white">
        <BookOpen size={70} className="text-heritage-gold mb-6" />

        <h2 className="text-4xl font-bold">
          Your Collection is Empty
        </h2>

        <p className="text-gray-400 mt-4">
          Save places and stories to build your own heritage collection.
        </p>

        <button
          onClick={() => navigate("/places")}
          className="mt-8 px-6 py-3 rounded-xl bg-heritage-gold text-black font-semibold hover:scale-105 transition"
        >
          Explore Heritage
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white px-4 md:px-10 py-10">

      {/* Back */}
      <div className="max-w-6xl mx-auto mb-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-heritage-gold hover:-translate-x-1 transition"
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
          Places and stories you've saved.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-16 flex-wrap">
        {["all", "PLACE", "STORY"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-xl transition ${
              activeTab === tab
                ? "bg-heritage-gold text-black"
                : "bg-white/5 border border-heritage-gold/20"
            }`}
          >
            {tab === "all" ? "All" : tab === "PLACE" ? "Places" : "Stories"}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-heritage-gold mb-10">
          Heritage Collection
        </h2>

        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-heritage-gold/40" />

          {filteredData.map((item) => (
            <div
              key={`${item.item_type}-${item.saved_id}`}
              className="relative flex flex-col lg:flex-row gap-6 mb-14 pl-12"
            >

              {/* Dot */}
              <div className="absolute left-0 top-4 w-8 h-8 rounded-full bg-heritage-gold flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.8)]">
                {item.item_type === "PLACE" ? (
                  <MapPin size={16} className="text-black" />
                ) : (
                  <BookOpen size={16} className="text-black" />
                )}
              </div>

              {/* Left meta */}
              <div className="lg:w-1/3">
                <div className="bg-white/5 backdrop-blur-md border border-heritage-gold/20 rounded-2xl p-5">
                  <p className="text-heritage-gold text-sm mb-2">
                    {item.created_at
                      ? new Date(item.created_at).toLocaleDateString()
                      : "N/A"}
                  </p>

                  <h3 className="font-semibold text-lg">
                    {item.item_type === "PLACE"
                      ? "Saved Place"
                      : "Saved Story"}
                  </h3>
                </div>
              </div>

              {/* Main card */}
              <div className="relative lg:w-2/3 bg-white/5 backdrop-blur-md border border-heritage-gold/20 rounded-3xl overflow-hidden hover:border-heritage-gold/50 transition-all duration-300">

                <div className="flex flex-col md:flex-row">

                  {/* Image */}
                  <img
                    src={item.cover_image || "/fallback.jpg"}
                    alt={item.name || item.title || "item"}
                    className="md:w-72 h-60 object-cover"
                  />

                  {/* Content */}
                  <div className="p-6 flex-1">

                    <h3 className="text-2xl font-bold">
                      {item.item_type === "PLACE"
                        ? item.name
                        : item.title}
                    </h3>

                    {/* PLACE */}
                    {item.item_type === "PLACE" && (
                      <>
                        <div className="flex items-center gap-2 text-gray-400 mt-3">
                          <MapPin size={16} />
                          {item.city}, {item.state}
                        </div>

                        <div className="flex items-center gap-2 text-yellow-400 mt-3">
                          <Star size={16} fill="currentColor" />
                          {item.average_rating || "N/A"}
                        </div>
                      </>
                    )}

                    {/* STORY */}
                    {item.item_type === "STORY" && (
                      <div className="mt-3">
                        <span className="inline-block px-3 py-1 rounded-full bg-heritage-gold/20 text-heritage-gold text-sm">
                          {item.category_name}
                        </span>
                      </div>
                    )}

                    <p className="text-gray-400 mt-5 leading-7">
                      {item.item_type === "PLACE"
                        ? item.short_description || "No description available"
                        : item.summary}
                    </p>

                    <button
                      onClick={() =>
                        navigate(
                          item.item_type === "PLACE"
                            ? `/places/${item.place_id}`
                            : `/stories/${item.story_id}`
                        )
                      }
                      className="mt-5 px-5 py-2.5 rounded-xl bg-heritage-gold text-black font-semibold hover:scale-105 transition"
                    >
                      View Details
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => handleRemove(item)}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-500/20 hover:bg-red-500 flex items-center justify-center transition z-10"
                  >
                    <Trash2 size={16} className="text-red-400 hover:text-white" />
                  </button>

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default MyCollection;