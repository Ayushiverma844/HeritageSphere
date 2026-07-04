import React, { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";

const ManageCategories = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("place");

  const [newCategory, setNewCategory] = useState("");

  const [placeCategories, setPlaceCategories] = useState([
    "Monument",
    "Temple",
    "Fort",
    "Palace",
    "Museum",
    "UNESCO Site",
  ]);

  const [storyCategories, setStoryCategories] = useState([
    "History",
    "Mythology",
    "Culture",
    "Freedom Struggle",
    "Legends",
  ]);

  // ======================
  // Add Category
  // ======================

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;

    if (activeTab === "place") {
      setPlaceCategories((prev) => [
        ...prev,
        newCategory.trim(),
      ]);
    } else {
      setStoryCategories((prev) => [
        ...prev,
        newCategory.trim(),
      ]);
    }

    setNewCategory("");
  };

  // ======================
  // Delete Category
  // ======================

  const handleDeleteCategory = (index) => {
    if (activeTab === "place") {
      setPlaceCategories((prev) =>
        prev.filter((_, i) => i !== index)
      );
    } else {
      setStoryCategories((prev) =>
        prev.filter((_, i) => i !== index)
      );
    }
  };

  return (
    <div className="
fixed
inset-0
z-50
bg-black/75
backdrop-blur-md
flex
items-center
justify-center
px-8
py-10

">

      <div
  className="
  w-full
  max-w-6xl
  max-h-[90vh]
  overflow-y-auto
  hide-scrollbar
  rounded-4xl
  border
  border-white/10
  bg-[#0A101C]/95
  backdrop-blur-2xl
  shadow-[0_20px_80px_rgba(0,0,0,0.55)]
  "
>

        {/* HEADER */}

        <div className="flex justify-between items-center px-8 py-6 border-b border-white/5">

          <div>

            <h2 className="text-3xl font-bold text-white">
              Manage Categories
            </h2>

           

          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-red-500 hover:bg-red-600 transition"
          >
            <X size={20} />
          </button>

        </div>

        {/* TABS */}

        <div className="flex gap-3 px-8 pt-6">

          <button
            onClick={() => setActiveTab("place")}
            className={`px-5 py-2 rounded-xl transition ${
              activeTab === "place"
                ? "bg-heritage-gold text-black"
                : "bg-[#141D2B] text-gray-300"
            }`}
          >
            Place Categories
          </button>

          <button
            onClick={() => setActiveTab("story")}
            className={`px-5 py-2 rounded-xl transition ${
              activeTab === "story"
                ? "bg-heritage-gold text-black"
                : "bg-white/10 text-gray-300"
            }`}
          >
            Story Categories
          </button>

        </div>

        {/* BODY */}

        <div className="grid lg:grid-cols-3 gap-8 p-8">

          {/* LEFT */}

          <div className="lg:col-span-2">

            <div className="flex gap-3 mb-8">

              <input
                value={newCategory}
                onChange={(e) =>
                  setNewCategory(e.target.value)
                }
                placeholder={`New ${
                  activeTab === "place"
                    ? "Place"
                    : "Story"
                } Category`}
                className="flex-1 rounded-xl bg-[#141D2B] border border-white/10 px-4 py-3 outline-none text-white 
focus:border-heritage-gold
focus:ring-2
focus:ring-heritage-gold/20"
              />

              <button
                onClick={handleAddCategory}
                className="px-6 rounded-xl bg-heritage-gold text-black font-semibold hover:scale-105 transition bg-linear-to-r
from-yellow-400
to-amber-500
hover:from-yellow-300
hover:to-amber-400
shadow-lg
shadow-yellow-500/20"
              >
                <Plus size={18} />
              </button>

            </div>

            <div className="grid md:grid-cols-2 gap-4">

              {(activeTab === "place"
                ? placeCategories
                : storyCategories
              ).map((cat, index) => (

                <div
                  key={index}
                  className="flex justify-between items-center rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white/90 hover:border-heritage-gold transition"
                >

                  <div>

                    <h3 className="font-semibold">
                      {cat}
                    </h3>

                    <p className="text-sm text-gray-500">

                      {activeTab === "place"
                        ? "Place Category"
                        : "Story Category"}

                    </p>

                  </div>

                  <button
                    onClick={() =>
                      handleDeleteCategory(index)
                    }
                    className="p-2 rounded-lg bg-red-500/10
text-red-400
hover:bg-red-500
hover:text-white transition"
                  >
                    <Trash2 size={17} />
                  </button>

                </div>

              ))}

            </div>

          </div>

          {/* RIGHT */}

          <div className="rounded-2xl border border-heritage-gold/20 bg-linear-to-br from-[#111C2C]
via-[#0E1826]
to-[#08111D] p-4">

            <h3 className="text-xl font-semibold text-heritage-gold mb-6">
              Statistics
            </h3>

            <div className="space-y-5">

              <div className="rounded-xl bg-[#141D2B] p-4 hover:bg-[#1A2537]
hover:border-heritage-gold
hover:-translate-y-1
transition-all
duration-300">

                <p className="text-gray-400">
                  Place Categories
                </p>

                <h2 className="text-4xl font-bold text-heritage-gold mt-2">
                  {placeCategories.length}
                </h2>

              </div>

              <div className="rounded-xl bg-[#141D2B] p-4 hover:bg-[#1A2537]
hover:border-heritage-gold
hover:-translate-y-1
transition-all
duration-300">

                <p className="text-gray-400">
                  Story Categories
                </p>

                <h2 className="text-4xl font-bold text-heritage-gold mt-2">
                  {storyCategories.length}
                </h2>

              </div>

              <div className="rounded-xl bg-white/5 p-4">

                <p className="text-gray-400">
                  Total Categories
                </p>

                <h2 className="text-4xl font-bold text-green-400 mt-2">
                  {placeCategories.length +
                    storyCategories.length}
                </h2>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ManageCategories;