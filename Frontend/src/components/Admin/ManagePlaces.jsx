import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Image as ImageIcon,
  Save,
  Send,
} from "lucide-react";

const initialForm = {
  title: "",
  category: "",
  state: "",
  city: "",
  description: "",
  era: "",
  builtBy: "",
  style: "",
  year: "",
  address: "",
  latitude: "",
  longitude: "",
  mapUrl: "",
};

const initialPublishedPlaces = [
  {
    id: 1,
    name: "Taj Mahal",
    type: "Monument",
    country: "India",
    gallery: [],
  },
  {
    id: 2,
    name: "Amer Fort",
    type: "Fort",
    country: "India",
    gallery: [],
  },
  {
    id: 3,
    name: "Khajuraho Temple",
    type: "Temple",
    country: "India",
    gallery: [],
  },
];

const initialDrafts = [
  {
    id: 101,
    title: "Gateway of India",
    category: "Monument",
    state: "Maharashtra",
    city: "Mumbai",
    description: "Historic monument in Mumbai.",
    era: "British Era",
    builtBy: "George Wittet",
    style: "Indo-Saracenic",
    year: "1924",
    address: "Apollo Bandar, Mumbai",
    latitude: "18.9220",
    longitude: "72.8347",
    mapUrl: "",
    gallery: [],
  },
];

const ManagePlaces = () => {
  const [tab, setTab] = useState("Add Place");

  const [form, setForm] = useState(initialForm);

  const [publishedPlaces, setPublishedPlaces] = useState(
    initialPublishedPlaces
  );

  const [drafts, setDrafts] = useState(initialDrafts);

  const [galleryImages, setGalleryImages] = useState([]);

  const [coverImage, setCoverImage] = useState(null);

  const [editingType, setEditingType] = useState(null);
// "draft" | "published"

const [editingId, setEditingId] = useState(null);

  // ==========================
  // Handle Input Change
  // ==========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================
  // Cover Upload
  // ==========================

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setCoverImage({
      file,
      url: URL.createObjectURL(file),
    });
  };

  // ==========================
  // Gallery Upload
  // ==========================

  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files);

    const images = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setGalleryImages((prev) => [...prev, ...images]);
  };

  // ==========================
  // Reset Form
  // ==========================

const resetForm = () => {
  setForm(initialForm);
  setGalleryImages([]);
  setCoverImage(null);

  setEditingId(null);
  setEditingType(null);
};

  // ==========================
  // Save Draft
  // ==========================

  const handleSaveDraft = () => {
     const draftData = {
  id: editingId || Date.now(),
  ...form,
  cover: coverImage,
  gallery: galleryImages,
};

   if (editingType === "draft") {
  setDrafts((prev) =>
    prev.map((item) =>
      item.id === editingId ? draftData : item
    )
  );
} else {
  setDrafts((prev) => [...prev, draftData]);
}

    resetForm();

    setTab("Drafts");
  };

  // ==========================
  // Publish Place
  // ==========================

 const handlePublish = () => {
  const place = {
    id: editingId || Date.now(),
    name: form.title,
    type: form.category,
    country: form.state,
    city: form.city,
    description: form.description,

    era: form.era,
    builtBy: form.builtBy,
    style: form.style,
    year: form.year,

    address: form.address,
    latitude: form.latitude,
    longitude: form.longitude,
    mapUrl: form.mapUrl,

    cover: coverImage,
    gallery: galleryImages,
  };

  if (editingType === "published") {
    setPublishedPlaces((prev) =>
      prev.map((item) =>
        item.id === editingId ? place : item
      )
    );
  } else {
    setPublishedPlaces((prev) => [...prev, place]);
  }

  resetForm();
  setTab("Existing Places");
};


  // ==========================
  // Delete Published
  // ==========================

  const handleDelete = (id) => {
    setPublishedPlaces((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  // ==========================
  // Delete Draft
  // ==========================

  const handleDeleteDraft = (id) => {
    setDrafts((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  // ==========================
  // Edit function 
  // ==========================
  
const handleEdit = (item, type) => {

  setEditingType(type);
  setEditingId(item.id);

  setForm({
    title: item.title || item.name,
    category: item.category || item.type,
    state: item.state || item.country,
    city: item.city || "",
    description: item.description || "",
    era: item.era || "",
    builtBy: item.builtBy || "",
    style: item.style || "",
    year: item.year || "",
    address: item.address || "",
    latitude: item.latitude || "",
    longitude: item.longitude || "",
    mapUrl: item.mapUrl || "",
  });

  setCoverImage(item.cover || null);
  setGalleryImages(item.gallery || []);

  setTab("Add Place");
};
  // ==========================
  // Approve Draft
  // ==========================

  const handleApproveDraft = (draft) => {
    const place = {
      ...draft,
      id: Date.now(),
      name: draft.title,
      type: draft.category,
      country: draft.state,
      city: draft.city,
      description: draft.description,
      cover: draft.cover,
      gallery: draft.gallery,
    };


    setPublishedPlaces((prev) => [...prev, place]);

    setDrafts((prev) =>
      prev.filter((item) => item.id !== draft.id)
    );
  };

  return (
        <div className="min-h-screen px-6 py-10 text-white">

      {/* BACK BUTTON */}
      <Link
        to="/admin"
        className="inline-flex items-center gap-2 text-gray-300 mb-6"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </Link>

      {/* PAGE TITLE */}
      <h1 className="text-4xl font-bold">
        Manage Heritage Places
      </h1>

      {/* TABS */}
      <div className="flex gap-4 my-6">
        {["Add Place", "Drafts", "Existing Places"].map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`px-5 py-2 rounded-xl transition ${
              tab === item
                ? "bg-yellow-500 text-black"
                : "bg-white/10 hover:bg-white/20"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* ========================= */}
      {/* ADD PLACE */}
      {/* ========================= */}

      {tab === "Add Place" && (
        <div className="grid lg:grid-cols-3 gap-6">

          {/* LEFT SIDE */}
          <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6">

            <h2 className="text-xl font-semibold mb-4">
              Basic Information
            </h2>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Place Title"
              className="w-full mb-4 p-3 rounded-xl bg-white/5 border border-white/10"
            />

            <div className="grid md:grid-cols-3 gap-4 mb-4">

              {/* CATEGORY */}

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="p-3 rounded-xl border border-white/20 text-white cursor-pointer"
              >
                <option
                  value=""
                  disabled
                  hidden
                  className="bg-gray-200 text-black"
                >
                  Select Category
                </option>

                <option
                  value="Monument"
                  className="bg-gray-200 text-black"
                >
                  Monument
                </option>

                <option
                  value="Temple"
                  className="bg-gray-200 text-black"
                >
                  Temple
                </option>

                <option
                  value="Fort"
                  className="bg-gray-200 text-black"
                >
                  Fort
                </option>

              </select>

              {/* STATE */}

              <select
                name="state"
                value={form.state}
                onChange={handleChange}
                className="p-3 rounded-xl border border-white/20 text-white cursor-pointer"
              >
                <option
                  value=""
                  disabled
                  hidden
                  className="bg-gray-200 text-black"
                >
                  Select State
                </option>

                <option
                  value="Madhya Pradesh"
                  className="bg-gray-200 text-black"
                >
                  Madhya Pradesh
                </option>

                <option
                  value="Rajasthan"
                  className="bg-gray-200 text-black"
                >
                  Rajasthan
                </option>

                <option
                  value="Uttar Pradesh"
                  className="bg-gray-200 text-black"
                >
                  Uttar Pradesh
                </option>

                <option
                  value="Maharashtra"
                  className="bg-gray-200 text-black"
                >
                  Maharashtra
                </option>

                <option
                  value="Gujarat"
                  className="bg-gray-200 text-black"
                >
                  Gujarat
                </option>

              </select>

              {/* CITY */}

              <select
                name="city"
                value={form.city}
                onChange={handleChange}
                className="p-3 rounded-xl border border-white/20 text-white cursor-pointer"
              >
                <option
                  value=""
                  disabled
                  hidden
                  className="bg-gray-200 text-black"
                >
                  Select City
                </option>

                <option
                  value="Bhopal"
                  className="bg-gray-200 text-black"
                >
                  Bhopal
                </option>

                <option
                  value="Indore"
                  className="bg-gray-200 text-black"
                >
                  Indore
                </option>

                <option
                  value="Jaipur"
                  className="bg-gray-200 text-black"
                >
                  Jaipur
                </option>

                <option
                  value="Agra"
                  className="bg-gray-200 text-black"
                >
                  Agra
                </option>

                <option
                  value="Mumbai"
                  className="bg-gray-200 text-black"
                >
                  Mumbai
                </option>

              </select>

            </div>

            {/* DESCRIPTION */}

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Description"
              className="w-full mb-6 p-3 rounded-xl bg-white/5 border border-white/10"
            />

            {/* ========================= */}
            {/* HISTORICAL INFORMATION */}
            {/* ========================= */}

            <h2 className="text-lg font-semibold mb-3">
              Historical Information
            </h2>

            <div className="grid md:grid-cols-3 gap-4 mb-4">

              <input
                type="text"
                name="era"
                value={form.era}
                onChange={handleChange}
                placeholder="Era"
                className="p-3 rounded-xl bg-white/5 border border-white/10"
              />

              <input
                type="text"
                name="builtBy"
                value={form.builtBy}
                onChange={handleChange}
                placeholder="Built By"
                className="p-3 rounded-xl bg-white/5 border border-white/10"
              />

              <input
                type="text"
                name="style"
                value={form.style}
                onChange={handleChange}
                placeholder="Style"
                className="p-3 rounded-xl bg-white/5 border border-white/10"
              />

            </div>

            <input
              type="text"
              name="year"
              value={form.year}
              onChange={handleChange}
              placeholder="Year"
              className="w-full mb-6 p-3 rounded-xl bg-white/5 border border-white/10"
            />
            {/* ========================= */}
            {/* LOCATION */}
            {/* ========================= */}

            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <MapPin size={18} />
              Location
            </h2>

            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Address"
              className="w-full mb-3 p-3 rounded-xl bg-white/5 border border-white/10"
            />

            <div className="grid md:grid-cols-2 gap-4 mb-3">

              <input
                type="text"
                name="latitude"
                value={form.latitude}
                onChange={handleChange}
                placeholder="Latitude"
                className="p-3 rounded-xl bg-white/5 border border-white/10"
              />

              <input
                type="text"
                name="longitude"
                value={form.longitude}
                onChange={handleChange}
                placeholder="Longitude"
                className="p-3 rounded-xl bg-white/5 border border-white/10"
              />

            </div>

            <input
              type="text"
              name="mapUrl"
              value={form.mapUrl}
              onChange={handleChange}
              placeholder="Map URL"
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10"
            />
            <button
  onClick={resetForm}
  className=" border-none text-red-400 py-2  mt-5 rounded-full text-xl font-medium cursor-pointer hover:text-red-300 transition-all"
>
  {editingType ? "Cancel Editing" : "Clear Form"}
</button>
          </div>
           

          {/* ========================= */}
          {/* RIGHT PANEL */}
          {/* ========================= */}

          <div className="space-y-4">

            {/* COVER IMAGE */}

            <div className="bg-white/5 p-4 rounded-2xl">

              <h2 className="mb-2 font-semibold">
                Cover Image
              </h2>

              <div className="h-32 bg-white/10 rounded mb-3 overflow-hidden flex items-center justify-center">

                {coverImage ? (
                  <img
                    src={coverImage.url}
                    alt="Cover"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">
                    No Cover Selected
                  </span>
                )}

              </div>

              <label className="block">

                <div className="w-full bg-yellow-500 text-black py-2 rounded text-center cursor-pointer">
                  Upload Cover
                </div>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCoverUpload}
                />

              </label>

            </div>

            {/* ========================= */}
            {/* GALLERY */}
            {/* ========================= */}

            <div className="bg-white/5 p-4 rounded-2xl">

              <h2 className="mb-2 font-semibold">
                Gallery
              </h2>

              <label className="block cursor-pointer bg-white/10 p-2 rounded text-center">

                <ImageIcon className="inline mr-2" />

                Upload Images

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleGalleryUpload}
                />

              </label>

              <div className="grid grid-cols-2 gap-2 mt-3">

                {galleryImages.map((image, index) => (

                  <img
                    key={index}
                    src={image.url}
                    alt=""
                    className="h-20 w-full object-cover rounded"
                  />

                ))}

              </div>

            </div>

            {/* ========================= */}
            {/* ACTION BUTTONS */}
            {/* ========================= */}

            <div className="bg-white/5 p-4 rounded-2xl">

              <button
                onClick={handleSaveDraft}
                className="w-full bg-gray-700 py-2 mb-2 rounded flex items-center justify-center gap-2"
              >
                <Save size={16} />

              {editingType === "draft"
  ? "Update Draft"
  : "Save Draft"}

              </button>

              <button
                onClick={handlePublish}
                className="w-full bg-yellow-500 text-black py-2 rounded flex items-center justify-center gap-2"
              >
                <Send size={16} />

{editingType === "published"
  ? "Update Place"
  : "Publish"}

              </button>

            </div>

          </div>

        </div>
      )}
            {/* ========================= */}
      {/* DRAFTS */}
      {/* ========================= */}

      {tab === "Drafts" && (
        <div className="grid md:grid-cols-3 gap-5 mt-6">

          {drafts.length === 0 ? (

            <p className="text-gray-400">
              No Drafts Available
            </p>

          ) : (

            drafts.map((item) => (

              <div
                key={item.id}
                className="bg-white/5 p-4 rounded-2xl"
              >

                {/* Cover Preview */}

                <div className="h-28 bg-white/10 rounded mb-3 overflow-hidden flex items-center justify-center">

                  {item.cover ? (
                    <img
                      src={item.cover.url}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">
                      No Cover
                    </span>
                  )}

                </div>

                <h3 className="font-bold text-lg">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-400">
                  {item.category} • {item.state}
                </p>

                <div className="flex justify-between mt-4">

                  <button
                    onClick={() => handleEdit(item, "draft")}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleApproveDraft(item)}
                    className="text-green-400 hover:text-green-300"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => handleDeleteDraft(item.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))

          )}

        </div>
      )}

      {/* ========================= */}
      {/* EXISTING PLACES */}
      {/* ========================= */}

      {tab === "Existing Places" && (

        <div className="grid md:grid-cols-3 gap-5 mt-6">

          {publishedPlaces.length === 0 ? (

            <p className="text-gray-400">
              No Published Places
            </p>

          ) : (

            publishedPlaces.map((item) => (

              <div
                key={item.id}
                className="bg-white/5 p-4 rounded-2xl"
              >

                {/* Cover */}

                <div className="h-28 bg-white/10 rounded mb-3 overflow-hidden flex items-center justify-center">

                  {item.cover ? (

                    <img
                      src={item.cover.url}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />

                  ) : (

                    <span className="text-gray-400 text-sm">
                      No Cover
                    </span>

                  )}

                </div>

                <h3 className="font-bold text-lg">
                  {item.name}
                </h3>

                <p className="text-sm text-gray-400">
                  {item.type} • {item.country}
                </p>

                <div className="flex justify-between mt-4">

                  <button
                    onClick={() => handleEdit(item, "published")}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))

          )}

        </div>

      )}

    </div>
  );
};

export default ManagePlaces;