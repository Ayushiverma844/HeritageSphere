import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  X,
  Plus,
  Trash2,
} from "lucide-react";

import api from "../../api/api";

const ManageCategories = ({ onClose }) => {

  const [activeTab, setActiveTab] =
    useState("place");

  const [newCategory, setNewCategory] =
    useState("");

  const [usageType, setUsageType] =
    useState("PLACE");

  const [categories, setCategories] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  // ======================
  // Fetch Categories
  // ======================

  const fetchCategories = async () => {

    try {

      setLoading(true);

      const res = await api.get(
        "/categories",
        {
          params: {
            limit: 100,
          },
        }
      );

      if (res.data.success) {

        setCategories(
          res.data.categories || []
        );

      }

    } catch (error) {

      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load categories."
      );

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchCategories();

  }, []);

 
   // ======================
  // Filter Categories
  // ======================

  const placeCategories = useMemo(() => {

    return categories.filter(

      (cat) =>
        cat.usage_type === "PLACE" ||
        cat.usage_type === "BOTH"

    );

  }, [categories]);

  const storyCategories = useMemo(() => {

    return categories.filter(

      (cat) =>
        cat.usage_type === "STORY" ||
        cat.usage_type === "BOTH"

    );

  }, [categories]);

  // ======================
  // Add Category
  // ======================

  const handleAddCategory = async () => {

    if (!newCategory.trim()) {

      toast.error("Category name is required.");

      return;

    }

    try {

      setSaving(true);

      const res = await api.post(

        "/categories",

        {

          category_name: newCategory.trim(),

          usage_type: usageType

        }

      );

      if (res.data.success) {

        toast.success(res.data.message);

        setNewCategory("");

        setUsageType(

          activeTab === "place"

            ? "PLACE"

            : "STORY"

        );

        fetchCategories();

      }

    }

    catch (error) {

      console.log(error);

      toast.error(

        error.response?.data?.message ||

        "Unable to create category."

      );

    }

    finally {

      setSaving(false);

    }

  };

  // ======================
  // Delete Category
  // ======================

  const handleDeleteCategory = async (

    categoryId

  ) => {

    const confirmDelete = window.confirm(

      "Delete this category?"

    );

    if (!confirmDelete) return;

    try {

      const res = await api.delete(

        `/categories/${categoryId}`

      );

      if (res.data.success) {

        toast.success(res.data.message);

        fetchCategories();

      }

    }

    catch (error) {

      console.log(error);

      toast.error(

        error.response?.data?.message ||

        "Unable to delete category."

      );

    }

  };

  return (

    <div
      className="
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
"
    >

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

        {/* ================= HEADER ================= */}

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

        {/* ================= Tabs ================= */}

        <div className="flex gap-3 px-8 pt-6">

          <button
            onClick={() => {

              setActiveTab("place");

              setUsageType("PLACE");

            }}
            className={`px-5 py-2 rounded-xl transition ${
              activeTab === "place"
                ? "bg-heritage-gold text-black"
                : "bg-[#141D2B] text-gray-300"
            }`}
          >
            Place Categories
          </button>

          <button
            onClick={() => {

              setActiveTab("story");

              setUsageType("STORY");

            }}
            className={`px-5 py-2 rounded-xl transition ${
              activeTab === "story"
                ? "bg-heritage-gold text-black"
                : "bg-[#141D2B] text-gray-300"
            }`}
          >
            Story Categories
          </button>

        </div>

        {/* ================= BODY ================= */}

        <div className="grid lg:grid-cols-3 gap-8 p-8">

          {/* ================= LEFT ================= */}

          <div className="lg:col-span-2">

            {/* Add Category */}

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
                className="
flex-1
rounded-xl
bg-[#141D2B]
border
border-white/10
px-4
py-3
outline-none
text-white
focus:border-heritage-gold
focus:ring-2
focus:ring-heritage-gold/20"
              />

              <select
                value={usageType}
                onChange={(e) =>
                  setUsageType(e.target.value)
                }
                className="
w-44
rounded-xl
bg-[#141D2B]
border
border-white/10
px-4
py-3
text-white
outline-none
focus:border-heritage-gold
focus:ring-2
focus:ring-heritage-gold/20"
              >

                <option value="PLACE">
                  Place
                </option>

                <option value="STORY">
                  Story
                </option>

                <option value="BOTH">
                  Both
                </option>

              </select>

              <button
                disabled={saving}
                onClick={handleAddCategory}
                className="
px-6
rounded-xl
bg-linear-to-r
from-yellow-400
to-amber-500
text-black
font-semibold
hover:scale-105
transition
shadow-lg
shadow-yellow-500/20
disabled:opacity-60"
              >
                <Plus size={18} />
              </button>

            </div>

            {/* Category List */}

            {loading ? (

              <div className="text-center text-gray-400 py-20">
                Loading Categories...
              </div>

            ) : (

              <div className="grid md:grid-cols-2 gap-4">

                {(activeTab === "place"
                  ? placeCategories
                  : storyCategories
                ).map((cat) => (

                  <div
                    key={cat.category_id}
                    className="
flex
justify-between
items-center
rounded-2xl
border
border-white/10
bg-white/5
px-5
py-4
text-white
hover:border-heritage-gold
transition"
                  >

                    <div>

                      <h3 className="font-semibold">
                        {cat.category_name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {cat.usage_type}
                      </p>

                    </div>

                    <button
                      onClick={() =>
                        handleDeleteCategory(
                          cat.category_id
                        )
                      }
                      className="
p-2
rounded-lg
bg-red-500/10
text-red-400
hover:bg-red-500
hover:text-white
transition"
                    >
                      <Trash2 size={17} />
                    </button>

                  </div>

                ))}

              </div>

            )}

          </div>
                    {/* ================= RIGHT ================= */}

          <div
            className="
rounded-2xl
border
border-heritage-gold/20
bg-linear-to-br
from-[#111C2C]
via-[#0E1826]
to-[#08111D]
p-6
h-fit
"
          >

            <h3 className="text-xl font-semibold text-heritage-gold mb-6">
              Statistics
            </h3>

            <div className="space-y-5">

              {/* Place */}

              <div
                className="
rounded-xl
bg-[#141D2B]
p-4
transition-all
duration-300
hover:-translate-y-1
hover:bg-[#1A2537]
"
              >

                <p className="text-gray-400">
                  Place Categories
                </p>

                <h2 className="text-4xl font-bold text-heritage-gold mt-2">
                  {placeCategories.length}
                </h2>

              </div>

              {/* Story */}

              <div
                className="
rounded-xl
bg-[#141D2B]
p-4
transition-all
duration-300
hover:-translate-y-1
hover:bg-[#1A2537]
"
              >

                <p className="text-gray-400">
                  Story Categories
                </p>

                <h2 className="text-4xl font-bold text-heritage-gold mt-2">
                  {storyCategories.length}
                </h2>

              </div>

              {/* Total */}

              <div
                className="
rounded-xl
bg-[#141D2B]
p-4
transition-all
duration-300
hover:-translate-y-1
hover:bg-[#1A2537]
"
              >

                <p className="text-gray-400">
                  Total Categories
                </p>

                <h2 className="text-4xl font-bold text-green-400 mt-2">
                  {categories.length}
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