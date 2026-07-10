import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import toast from "react-hot-toast";

import {
  ArrowLeft,
  Save,
  Plus,
} from "lucide-react";

import placeService from "../../services/placeService";
import categoryService from "../../services/categoryService";
import galleryService from "../../services/galleryService";

const initialForm = {

  // Place Table

  category_id: "",

  name: "",

  city: "",

  state: "",

  country: "India",

  entry_fee: "",

  latitude: "",

  longitude: "",

  // Place Detail Table

  short_description: "",

  why_famous: "",

  history: "",

  architecture: "",

  significance: "",

  best_time_to_visit: "",

  visiting_hours: "",

  rituals: "",

  how_to_reach: "",

  travel_tips: "",

  dress_code: "",

  photography_allowed: "Yes",

};

const ManagePlaces = () => {

  // ===========================
  // Tabs
  // ===========================

  const [activeTab, setActiveTab] = useState("add");

  // ===========================
  // Form
  // ===========================

  const [form, setForm] = useState(initialForm);

  // ===========================
  // Cover Image
  // ===========================

  const [image, setImage] = useState(null);

  const [preview, setPreview] = useState("");

  // ===========================
// Gallery Images
// ===========================

const [galleryImages, setGalleryImages] = useState([]);
const [galleryPreview, setGalleryPreview] = useState([]);

  // ===========================
  // Categories
  // ===========================

  const [categories, setCategories] = useState([]);

  // ===========================
  // Places
  // ===========================

  const [places, setPlaces] = useState([]);

  // ===========================
  // Edit
  // ===========================

  const [editingId, setEditingId] = useState(null);

  // ===========================
  // Loading
  // ===========================

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  // ===========================
// Pagination
// ===========================

const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [limit] = useState(30);
const [totalPlaces, setTotalPlaces] = useState(0);

  // ===========================
  // Handle Input
  // ===========================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm((prev) => ({

      ...prev,

      [name]: value,

    }));

  };

  // ===========================
  // Handle Image
  // ===========================

  const handleImage = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setImage(file);

    setPreview(URL.createObjectURL(file));

  };

  // ===========================
// Handle Gallery Images
// ===========================

const handleGallery = (e) => {

  const files = Array.from(e.target.files);

  if (!files.length) return;

  setGalleryImages((prev) => [

    ...prev,

    ...files,

  ]);

  const previews = files.map((file) => ({

    file,

    url: URL.createObjectURL(file),

    isExisting: false,

  }));

  setGalleryPreview((prev) => [

    ...prev,

    ...previews,

  ]);

};

const handleDeleteGalleryImage = async (image) => {

  // New image
  if (!image.isExisting) {

    setGalleryPreview((prev) =>
      prev.filter((img) => img.url !== image.url)
    );

    setGalleryImages((prev) =>
      prev.filter((file) => file !== image.file)
    );

    return;
  }

  try {

    const res = await galleryService.deleteGalleryImage(
      image.image_id
    );

    if (res.success) {

      toast.success(res.message);

      setGalleryPreview((prev) =>
        prev.filter(
          (img) => img.image_id !== image.image_id
        )
      );

    }
 

  } catch (error) {

    console.log(error);

    toast.error("Unable to delete image.");

  }

};
  // ===========================
  // Reset Form
  // ===========================

  const resetForm = () => {

    setForm(initialForm);

    setImage(null);

    setPreview("");
    setGalleryImages([]);
setGalleryPreview([]);

    setEditingId(null);

  };

    // ===========================
  // Load Categories
  // ===========================

  const loadCategories = async () => {

    try {

      const res = await categoryService.getCategories();

      if (res.success) {

        const placeCategories = res.categories.filter(

          (category) =>

            category.usage_type === "PLACE" ||

            category.usage_type === "BOTH"

        );

        setCategories(placeCategories);

      }

    }

    catch (error) {

      console.log(error);

      toast.error("Unable to load categories.");

    }

  };

  // ===========================
  // Load Places
  // ===========================

  const loadPlaces = async () => {

    try {

      setLoading(true);

    const res = await placeService.getAdminPlaces(
  currentPage,
  limit
);

if (res.success) {

  setPlaces(res.places);

  setCurrentPage(res.pagination.currentPage);

  setTotalPages(res.pagination.totalPages);

  setTotalPlaces(res.pagination.totalPlaces);

}

    }

    catch (error) {

      console.log(error);

      toast.error("Unable to load places.");

    }

    finally {

      setLoading(false);

    }

  };

  // ===========================
  // Create / Update
  // ===========================

  const handleSubmit = async () => {
    

    if (

      !form.category_id ||

      !form.name ||

      !form.city ||

      !form.state ||

      !form.country

    ) {

      toast.error(

        "Please fill all required fields."

      );
      for (const [key, value] of formData.entries()) {
  console.log(key, value);
}

      return;

    }

    if (!editingId && !image) {

      toast.error("Please select cover image.");

      return;

    }

    try {

      setSaving(true);

      const formData = new FormData();

      Object.keys(form).forEach((key) => {

        formData.append(key, form[key]);

      });

      if (image) {

        formData.append("image", image);

      }

    let res;
let placeId;

if (editingId) {

  res = await placeService.updatePlace(
    editingId,
    formData
  );

  placeId = editingId;

} else {

  res = await placeService.createPlace(
    formData
  );

  placeId = res.placeId;
}

if (res.success) {

  // ==========================
  // Upload Gallery Images
  // ==========================

  if (galleryImages.length > 0) {


    await galleryService.uploadGalleryImages(
      placeId,
       galleryImages
    );

  }

 toast.success(res.message);

resetForm();

if (!editingId) {

  const lastPage = Math.ceil((totalPlaces + 1) / limit);

  if (lastPage !== currentPage) {

    setCurrentPage(lastPage);

  } else {

    await loadPlaces();

  }

} else {

  await loadPlaces();

}

setActiveTab("manage");

}

    }

    catch (error) {

      console.log(error);

      toast.error(

        error.response?.data?.message ||

        "Something went wrong."

      );

    }

    finally {

      setSaving(false);

    }

  };

  // ===========================
  // Edit
  // ===========================

  const handleEdit = async (placeId) => {

    try {

      const res = await placeService.getAdminPlaceById(

        placeId

      );

      if (!res.success) return;

      const place = res.place;

      setEditingId(place.place_id);

      setForm({

        category_id: place.category_id,

        name: place.name,

        city: place.city,

        state: place.state,

        country: place.country,

        entry_fee: place.entry_fee || "",

        latitude: place.latitude || "",

        longitude: place.longitude || "",

        short_description:

          place.short_description || "",

        why_famous:

          place.why_famous || "",

        history:

          place.history || "",

        architecture:

          place.architecture || "",

        significance:

          place.significance || "",

        best_time_to_visit:

          place.best_time_to_visit || "",

        visiting_hours:

          place.visiting_hours || "",

        rituals:

          place.rituals || "",

        how_to_reach:

          place.how_to_reach || "",

        travel_tips:

          place.travel_tips || "",

        dress_code:

          place.dress_code || "",

        photography_allowed:

          place.photography_allowed ||

          "Yes",

      });

      setPreview(place.image_url);

setImage(null);

// ======================
// Load Gallery Images
// ======================

const galleryRes =
  await galleryService.getGalleryImages(placeId);

if (galleryRes.success) {

  setGalleryPreview(

    galleryRes.gallery.map((img) => ({

      image_id: img.image_id,

      url: img.image_url,

      caption: img.caption,

      isExisting: true,

    }))

  );

}

else {

  setGalleryPreview([]);

}

setGalleryImages([]);

setActiveTab("add");
 
     

      window.scrollTo({

        top: 0,

        behavior: "smooth",

      });

    }

    catch (error) {

      console.log(error);

      toast.error("Unable to load place.");

    }

  };

  // ===========================
  // Delete
  // ===========================

  const handleDelete = async (placeId) => {

    const confirmDelete = window.confirm(

      "Delete this place?"

    );

    if (!confirmDelete) return;

    try {

      const res = await placeService.deletePlace(

        placeId

      );

      if (res.success) {

    toast.success(res.message);

    if (
        places.length === 1 &&
        currentPage > 1
    ) {

        setCurrentPage(prev => prev - 1);

    } else {

        await loadPlaces();

    }

}

    }

    catch (error) {

      console.log(error);

      toast.error(

        error.response?.data?.message ||

        "Unable to delete place."

      );

    }

  };

  // ===========================
  // Initial Load
  // ===========================

useEffect(() => {

  loadCategories();

}, []);

useEffect(() => {

  loadPlaces();

}, [currentPage]);

  return (

    <div className="min-h-screen px-6 py-10 text-white">

      {/* ================= HEADER ================= */}

      <Link
        to="/admin"
        className="inline-flex items-center gap-2 text-gray-300 mb-6 hover:text-white transition"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </Link>

      <div className="flex items-center justify-between mb-8">

        <div>

          <h1 className="text-4xl font-bold">
            Manage Heritage Places
          </h1>

          <p className="text-gray-400 mt-2">
            Create, update and manage heritage places.
          </p>

        </div>

      </div>

      {/* ================= Tabs ================= */}

      <div className="flex gap-4 mb-8">

        <button

          onClick={() => {

            resetForm();

            setActiveTab("add");

          }}

          className={`

          px-6
          py-3
          rounded-xl
          transition

          ${
            activeTab === "add"

              ? "bg-yellow-500 text-black"

              : "bg-white/10 hover:bg-white/20"

          }

          `}

        >

          <Plus size={18} className="inline mr-2" />

          {editingId ? "Edit Place" : "Add Place"}

        </button>

        <button

          onClick={() => setActiveTab("manage")}

          className={`

          px-6
          py-3
          rounded-xl
          transition

          ${
            activeTab === "manage"

              ? "bg-yellow-500 text-black"

              : "bg-white/10 hover:bg-white/20"

          }

          `}

        >

          Manage Places

        </button>

      </div>
  

      {/* =======================================================
          ADD / EDIT PLACE
      ======================================================= */}

      {activeTab === "add" && (

        <div className="grid lg:grid-cols-3 gap-8">

          {/* =======================================
              LEFT
          ======================================= */}

          <div className="lg:col-span-2 rounded-3xl bg-white/5 border border-white/10 p-6">

            <h2 className="text-xl font-semibold mb-6">

              Basic Information

            </h2>

            {/* Name */}

            <div className="mb-5">

              <label className="block mb-2">

                Place Name

              </label>

              <input

                type="text"

                name="name"

                value={form.name}

                onChange={handleChange}

                placeholder="Enter Place Name"

                className="

                w-full

                rounded-xl

                bg-white/5

                border

                border-white/10

                px-4

                py-3

                outline-none

                focus:border-yellow-500

                "

              />

            </div>

            {/* Category / State / City */}

            <div className="grid md:grid-cols-3 gap-4 mb-5">

              <div>

                <label className="block mb-2">

                  Category

                </label>

                <select

                  name="category_id"

                  value={form.category_id}

                  onChange={handleChange}

                  className="

                  w-full

                  rounded-xl

                  bg-[#111827]

                  border

                  border-white/10

                  px-4

                  py-3

                  "

                >

                  <option value="">

                    Select Category

                  </option>

                  {categories.map((category) => (

                    <option

                      key={category.category_id}

                      value={category.category_id}

                    >

                      {category.category_name}

                    </option>

                  ))}

                </select>

              </div>

              <div>

                <label className="block mb-2">

                  State

                </label>

                <input

                  type="text"

                  name="state"

                  value={form.state}

                  onChange={handleChange}

                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3"

                />

              </div>

              <div>

                <label className="block mb-2">

                  City

                </label>

                <input

                  type="text"

                  name="city"

                  value={form.city}

                  onChange={handleChange}

                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3"

                />

              </div>

            </div>

            {/* Country / Entry Fee */}

            <div className="grid md:grid-cols-2 gap-4 mb-5">

              <div>

                <label className="block mb-2">

                  Country

                </label>

                <input

                  type="text"

                  name="country"

                  value={form.country}

                  onChange={handleChange}

                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3"

                />

              </div>

              <div>

                <label className="block mb-2">

                  Entry Fee

                </label>

                <input

                  type="text"

                  name="entry_fee"

                  value={form.entry_fee}

                  onChange={handleChange}

                  placeholder="₹100 / Free"

                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3"

                />

              </div>

            </div>
                        {/* Latitude / Longitude */}

            <div className="grid md:grid-cols-2 gap-4 mb-5">

              <div>

                <label className="block mb-2">

                  Latitude

                </label>

                <input

                  type="text"

                  name="latitude"

                  value={form.latitude}

                  onChange={handleChange}

                  placeholder="26.912434"

                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3"

                />

              </div>

              <div>

                <label className="block mb-2">

                  Longitude

                </label>

                <input

                  type="text"

                  name="longitude"

                  value={form.longitude}

                  onChange={handleChange}

                  placeholder="75.787270"

                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3"

                />

              </div>

            </div>

            {/* Short Description */}

            <div className="mb-5">

              <label className="block mb-2">

                Short Description

              </label>

              <textarea

                rows={3}

                name="short_description"

                value={form.short_description}

                onChange={handleChange}

                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3"

              />

            </div>

            {/* Why Famous */}

            <div className="mb-5">

              <label className="block mb-2">

                Why Famous

              </label>

              <textarea

                rows={3}

                name="why_famous"

                value={form.why_famous}

                onChange={handleChange}

                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3"

              />

            </div>

            {/* History */}

            <div className="mb-5">

              <label className="block mb-2">

                History

              </label>

              <textarea

                rows={5}

                name="history"

                value={form.history}

                onChange={handleChange}

                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3"

              />

            </div>

            {/* Architecture */}

            <div className="mb-5">

              <label className="block mb-2">

                Architecture

              </label>

              <textarea

                rows={5}

                name="architecture"

                value={form.architecture}

                onChange={handleChange}

                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3"

              />

            </div>

            {/* Significance */}

            <div className="mb-5">

              <label className="block mb-2">

                Significance

              </label>

              <textarea

                rows={5}

                name="significance"

                value={form.significance}

                onChange={handleChange}

                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3"

              />

            </div>

            {/* Best Time / Visiting Hours */}

            <div className="grid md:grid-cols-2 gap-4 mb-5">

              <div>

                <label className="block mb-2">

                  Best Time To Visit

                </label>

                <input

                  type="text"

                  name="best_time_to_visit"

                  value={form.best_time_to_visit}

                  onChange={handleChange}

                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3"

                />

              </div>

              <div>

                <label className="block mb-2">

                  Visiting Hours

                </label>

                <input

                  type="text"

                  name="visiting_hours"

                  value={form.visiting_hours}

                  onChange={handleChange}

                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3"

                />

              </div>

            </div>

            {/* Rituals */}

            <div className="mb-5">

              <label className="block mb-2">

                Rituals

              </label>

              <textarea

                rows={4}

                name="rituals"

                value={form.rituals}

                onChange={handleChange}

                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3"

              />

            </div>

            {/* How To Reach */}

            <div className="mb-5">

              <label className="block mb-2">

                How To Reach

              </label>

              <textarea

                rows={4}

                name="how_to_reach"

                value={form.how_to_reach}

                onChange={handleChange}

                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3"

              />

            </div>

            {/* Travel Tips */}

            <div className="mb-5">

              <label className="block mb-2">

                Travel Tips

              </label>

              <textarea

                rows={4}

                name="travel_tips"

                value={form.travel_tips}

                onChange={handleChange}

                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3"

              />

            </div>

            {/* Dress Code */}

            <div className="mb-5">

              <label className="block mb-2">

                Dress Code

              </label>

              <textarea

                rows={3}

                name="dress_code"

                value={form.dress_code}

                onChange={handleChange}

                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3"

              />

            </div>

            {/* Photography */}

            <div>

              <label className="block mb-2">

                Photography Allowed

              </label>

              <select

                name="photography_allowed"

                value={form.photography_allowed}

                onChange={handleChange}

                className="w-full rounded-xl bg-[#111827] border border-white/10 px-4 py-3"

              >

                <option value="Yes">Yes</option>

                <option value="No">No</option>

                <option value="Restricted">

                  Restricted

                </option>

              </select>

            </div>

          </div>

          {/* =======================================
              RIGHT PANEL
          ======================================= */}

          <div className="space-y-6">

            <div className="rounded-3xl bg-white/5 border border-white/10 p-6">

              <h2 className="text-xl font-semibold mb-4">

                Cover Image

              </h2>

              <div className="h-64 rounded-2xl border border-dashed border-white/20 overflow-hidden flex items-center justify-center bg-white/5">

                {preview ? (

                  <img

                    src={preview}

                    alt="Preview"

                    className="h-full w-full object-cover"

                  />

                ) : (

                  <span className="text-gray-400">

                    No Image Selected

                  </span>

                )}

              </div>

              <label className="mt-4 block">

                <div className="w-full text-center cursor-pointer rounded-xl bg-yellow-500 text-black py-3 font-semibold hover:bg-yellow-400 transition">

                  Choose Cover Image

                </div>

                <input

                  type="file"

                  accept="image/*"

                  onChange={handleImage}

                  className="hidden"

                />

              </label>

            </div>

            <div className="rounded-3xl bg-white/5 border border-white/10 p-6">

  <h2 className="text-xl font-semibold mb-4">

    Gallery Images

  </h2>

  <div className="grid grid-cols-2 gap-3 mb-4">

    {galleryPreview.map((img, index) => (
<div
  key={index}
  className="relative group"
>
<img
  src={img.url}
  alt=""
  className="h-28 w-full object-cover rounded-xl"
/>

<button
  type="button"
  onClick={() =>
    handleDeleteGalleryImage(img)
  }
  className="

    absolute

    top-2

    right-2

    w-7

    h-7

    rounded-full

    bg-red-600

    hover:bg-red-700

    opacity-0

    group-hover:opacity-100

    transition

    flex

    items-center

    justify-center

    text-white

  "
>

  ✕

</button>

</div>

    ))}

  </div>

  <label className="block">

    <div className="w-full text-center cursor-pointer rounded-xl bg-white/10 py-3 hover:bg-white/20 transition">

      Upload Gallery Images

    </div>

    <input
      type="file"
      multiple
      accept="image/*"
      className="hidden"
      onChange={handleGallery}
    />

  </label>

</div>

            <div className="rounded-3xl bg-white/5 border border-white/10 p-6">

             <button
  onClick={handleSubmit}
  disabled={saving}
  className="w-full bg-yellow-500 text-black py-3 rounded-xl font-semibold flex justify-center items-center gap-2 disabled:opacity-60"
>

                <Save size={18} />

                {editingId ? "Update Place" : "Create Place"}

              </button>

              {editingId && (

                <button

                  onClick={resetForm}

                  className="w-full mt-3 py-3 rounded-xl bg-red-500 hover:bg-red-600 transition"

                >

                  Cancel Editing

                </button>

              )}

            </div>

          </div>

        </div>

      )}
    {/* =======================================================
    MANAGE PLACES
======================================================= */}

{activeTab === "manage" && (

  <div className="rounded-3xl bg-white/5 border border-white/10 p-5">

    {/* Header */}

    <div className="flex items-center justify-between mb-6">

      <div>

        <h2 className="text-2xl font-semibold">
          Existing Places
        </h2>

        <p className="text-gray-400 mt-1">
          Total Places : {totalPlaces}
        </p>

      </div>

    </div>

    {/* Loading */}

    {loading ? (

      <div className="py-16 text-center text-gray-400">
        Loading Places...
      </div>

    ) : places.length === 0 ? (

      <div className="py-16 text-center text-gray-400">
        No Places Found.
      </div>

    ) : (

      <>

        {/* =======================
            Places Grid
        ======================= */}

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {places.map((place) => (

            <div
              key={place.place_id}
              className="rounded-3xl overflow-hidden bg-[#111827] border border-white/10"
            >

              {/* Image */}

              <div className="h-56 overflow-hidden">

                <img
                  src={place.image_url}
                  alt={place.name}
                  className="w-full h-full object-cover"
                />

              </div>

              {/* Body */}

              <div className="p-5">

                <h3 className="text-xl font-semibold">
                  {place.name}
                </h3>

                <p className="text-gray-400 mt-2">
                  {place.city}, {place.state}
                </p>

                <p className="text-sm text-yellow-400 mt-3">
                  {place.category_name}
                </p>

                <div className="flex gap-3 mt-6">

                  <button
                    onClick={() =>
                      handleEdit(place.place_id)
                    }
                    className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(place.place_id)
                    }
                    className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 transition"
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

        {/* =======================
            Pagination
        ======================= */}

        {totalPages > 1 && (

          <div className="flex justify-center items-center gap-2 flex-wrap mt-10">

            {/* Previous */}

            <button
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((prev) => prev - 1)
              }
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {/* Page Numbers */}

            {Array.from(
              { length: totalPages },
              (_, index) => (

                <button
                  key={index}
                  onClick={() =>
                    setCurrentPage(index + 1)
                  }
                  className={`

                    w-10
                    h-10
                    rounded-lg
                    transition

                    ${
                      currentPage === index + 1
                        ? "bg-yellow-500 text-black"
                        : "bg-white/10 hover:bg-white/20"
                    }

                  `}
                >

                  {index + 1}

                </button>

              )
            )}

            {/* Next */}

            <button
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => prev + 1)
              }
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>

          </div>

        )}

      </>

    )}

  </div>

)}
    </div>

  );

};

export default ManagePlaces;