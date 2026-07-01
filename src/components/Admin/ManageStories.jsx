import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Image as ImageIcon,
  Save,
  Send,
} from "lucide-react";

const initialForm = {
  title: "",
  category: "",
  relatedPlace: "",
  author: "",
  era: "",
  summary: "",
  content: "",
};

const initialPublishedStories = [
  {
    id: 1,
    title: "The Legend of Taj Mahal",
    category: "History",
    relatedPlace: "Taj Mahal",
    author: "Admin",
    era: "Mughal Era",
    summary:
      "The famous love story behind the Taj Mahal.",
    content:
      "The Taj Mahal was built by Emperor Shah Jahan in memory of Mumtaz Mahal.",
    cover: null,
    gallery: [],
  },

  {
    id: 2,
    title: "Mystery of Amer Fort",
    category: "Mythology",
    relatedPlace: "Amer Fort",
    author: "Admin",
    era: "Rajput Era",
    summary:
      "Hidden legends of Amer Fort.",
    content:
      "Amer Fort has many secret tunnels and mysterious stories.",
    cover: null,
    gallery: [],
  },
];

const initialDrafts = [
  {
    id: 101,
    title: "Konark Sun Temple",
    category: "History",
    relatedPlace: "Konark Temple",
    author: "Admin",
    era: "13th Century",
    summary:
      "History of Konark Temple.",
    content:
      "Konark Temple is dedicated to the Sun God.",
    cover: null,
    gallery: [],
  },
];

const ManageStories = () => {

  const [tab, setTab] = useState("Add Story");

  const [form, setForm] =
    useState(initialForm);

  const [publishedStories,
    setPublishedStories] =
    useState(initialPublishedStories);

  const [drafts,
    setDrafts] =
    useState(initialDrafts);

  const [coverImage,
    setCoverImage] =
    useState(null);

  const [galleryImages,
    setGalleryImages] =
    useState([]);

  const [editingType,
    setEditingType] =
    useState(null);

  const [editingId,
    setEditingId] =
    useState(null);

  // ==========================
  // Handle Input
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

    const files = Array.from(
      e.target.files
    );

    const images = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setGalleryImages((prev) => [
      ...prev,
      ...images,
    ]);

  };

  // ==========================
  // Reset Form
  // ==========================

  const resetForm = () => {

    setForm(initialForm);

    setCoverImage(null);

    setGalleryImages([]);

    setEditingId(null);

    setEditingType(null);

  };

  // ==========================
  // Save Draft
  // ==========================

  const handleSaveDraft = () => {

    const draft = {

      id: editingId || Date.now(),

      ...form,

      cover: coverImage,

      gallery: galleryImages,

    };

    if (editingType === "draft") {

      setDrafts((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? draft
            : item
        )
      );

    } else {

      setDrafts((prev) => [
        ...prev,
        draft,
      ]);

    }

    resetForm();

    setTab("Drafts");

  };

  // ==========================
  // Publish Story
  // ==========================

  const handlePublish = () => {

    const story = {

      id: editingId || Date.now(),

      ...form,

      cover: coverImage,

      gallery: galleryImages,

    };

    if (editingType === "published") {

      setPublishedStories((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? story
            : item
        )
      );

    } else {

      setPublishedStories((prev) => [
        ...prev,
        story,
      ]);

    }

    resetForm();

    setTab("Existing Stories");

  };

  // ==========================
  // Delete Published Story
  // ==========================

  const handleDelete = (id) => {

    setPublishedStories((prev) =>
      prev.filter(
        (item) => item.id !== id
      )
    );

  };

  // ==========================
  // Delete Draft Story
  // ==========================

  const handleDeleteDraft = (id) => {

    setDrafts((prev) =>
      prev.filter(
        (item) => item.id !== id
      )
    );

  };

  // ==========================
// Edit Story
// ==========================

const handleEdit = (story, type) => {

  setEditingType(type);

  setEditingId(story.id);

  setForm({
    title: story.title,
    category: story.category,
    relatedPlace: story.relatedPlace,
    author: story.author,
    era: story.era,
    summary: story.summary,
    content: story.content,
  });

  setCoverImage(story.cover || null);

  setGalleryImages(story.gallery || []);

  setTab("Add Story");
};

// ==========================
// Approve Draft
// ==========================

const handleApproveDraft = (draft) => {

  const story = {
    ...draft,
    id: Date.now(),
  };

  setPublishedStories((prev) => [
    ...prev,
    story,
  ]);

  setDrafts((prev) =>
    prev.filter(
      (item) => item.id !== draft.id
    )
  );

};

  return (
  <div className="min-h-screen px-6 py-10 text-white">

    {/* BACK BUTTON */}

    <Link
      to="/admin"
      className="inline-flex items-center gap-2 text-gray-300 mb-6 hover:text-heritage-gold transition"
    >
      <ArrowLeft size={18} />
      Back to Dashboard
    </Link>

    {/* PAGE TITLE */}

    <h1 className="text-4xl font-bold">
      Manage Stories
    </h1>

  

    {/* TABS */}

    <div className="flex gap-4 my-6">

      {[
        "Add Story",
        "Drafts",
        "Existing Stories",
      ].map((item) => (

        <button
          key={item}
          onClick={() => setTab(item)}
          className={`px-5 py-2 rounded-xl transition ${
            tab === item
              ? "bg-heritage-gold text-black"
              : "bg-white/10 hover:bg-white/20"
          }`}
        >
          {item}
        </button>

      ))}

    </div>

    {/* ================================================= */}
    {/* ADD STORY */}
    {/* ================================================= */}

    {tab === "Add Story" && (

      <div className="grid lg:grid-cols-3 gap-6">

        {/* LEFT SIDE */}

        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6">

          <h2 className="text-xl font-semibold mb-5">
            Story Information
          </h2>

          {/* Story Title */}

          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Story Title"
            className="w-full mb-4 p-3 rounded-xl bg-white/5 border border-white/10 outline-none"
          />

          {/* Category + Related Place */}

          <div className="grid md:grid-cols-2 gap-4 mb-4">

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="p-3 rounded-xl bg-white/5 border border-white/10"
            >

              <option value="" 
                  disabled
                  hidden
                  className="bg-gray-200 text-black">
                Select Category
              </option>

              <option value="History" className="bg-gray-200 text-black">
                History
              </option>

              <option value="Mythology" className="bg-gray-200 text-black">
                Mythology
              </option>

              <option value="Culture" className="bg-gray-200 text-black">
                Culture
              </option>

              <option value="Freedom" className="bg-gray-200 text-black">
                Freedom
              </option>

            </select>

            <input
              type="text"
              name="relatedPlace"
              value={form.relatedPlace}
              onChange={handleChange}
              placeholder="Related Heritage Place"
              className="p-3 rounded-xl bg-white/5 border border-white/10"
            />

          </div>

          {/* Author + Era */}

          <div className="grid md:grid-cols-2 gap-4 mb-4">

            <input
              type="text"
              name="author"
              value={form.author}
              onChange={handleChange}
              placeholder="Author Name"
              className="p-3 rounded-xl bg-white/5 border border-white/10"
            />

            <input
              type="text"
              name="era"
              value={form.era}
              onChange={handleChange}
              placeholder="Historical Era"
              className="p-3 rounded-xl bg-white/5 border border-white/10"
            />

          </div>

          {/* Summary */}

          <textarea
            rows={4}
            name="summary"
            value={form.summary}
            onChange={handleChange}
            placeholder="Short Summary"
            className="w-full mb-5 p-3 rounded-xl bg-white/5 border border-white/10 outline-none"
          />

          {/* Story */}

          <h2 className="text-xl font-semibold mb-3">
            Story Content
          </h2>

          <textarea
            rows={14}
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="Write the complete story..."
            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 outline-none resize-none"
          />

          {/* Clear */}

          <button
            onClick={resetForm}
            className="mt-5 text-red-400 hover:text-red-300 transition cursor-pointer"
          >
            {editingType
              ? "Cancel Editing"
              : "Clear Form"}
          </button>

        </div>

        {/* ===================================== */}
        {/* RIGHT PANEL */}
        {/* ===================================== */}

        <div className="space-y-5">

          {/* Cover */}

          <div className="bg-white/5 border border-white/10 rounded-3xl p-5">

            <h2 className="font-semibold mb-3">
              Cover Image
            </h2>

            <div className="h-40 rounded-xl bg-white/10 overflow-hidden flex items-center justify-center">

              {coverImage ? (

                <img
                  src={coverImage.url}
                  alt="cover"
                  className="w-full h-full object-cover"
                />

              ) : (

                <span className="text-gray-400 text-sm">
                  No Cover Selected
                </span>

              )}

            </div>

            <label className="block mt-4 cursor-pointer">

              <div className="bg-heritage-gold text-black py-2 rounded-xl text-center font-semibold">
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

          {/* Gallery */}

          <div className="bg-white/5 border border-white/10 rounded-3xl p-5">

            <h2 className="font-semibold mb-3">
              Story Gallery
            </h2>

            <label className="cursor-pointer block">

              <div className="bg-white/10 rounded-xl py-3 text-center">

                <ImageIcon
                  size={18}
                  className="inline mr-2"
                />

                Upload Images

              </div>

              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleGalleryUpload}
              />

            </label>

            <div className="grid grid-cols-2 gap-2 mt-4">

              {galleryImages.map((image, index) => (

                <img
                  key={index}
                  src={image.url}
                  alt=""
                  className="h-20 rounded-lg object-cover"
                />

              ))}

            </div>

          </div>

          {/* Publish */}

          <div className="bg-white/5 border border-white/10 rounded-3xl p-5">

            <button
              onClick={handleSaveDraft}
              className="w-full mb-3 py-2 rounded-xl bg-gray-700 flex items-center justify-center gap-2 cursor-pointer"
            >

              <Save size={16} />

              {editingType === "draft"
                ? "Update Draft"
                : "Save Draft"}

            </button>

            <button
              onClick={handlePublish}
              className="w-full py-2 rounded-xl bg-heritage-gold text-black flex items-center justify-center gap-2 cursor-pointer"
            >

              <Send size={16} />

              {editingType === "published"
                ? "Update Story"
                : "Publish Story"}

            </button>

          </div>

        </div>

      </div>

    )}

    {/* ========================= */}
{/* DRAFT STORIES */}
{/* ========================= */}

{tab === "Drafts" && (

<div className="grid md:grid-cols-3 gap-5 mt-6">

  {drafts.length === 0 ? (

    <p className="text-gray-400">
      No Draft Stories
    </p>

  ) : (

    drafts.map((story) => (

      <div
        key={story.id}
        className="bg-white/5 border border-white/10 rounded-2xl p-4"
      >

        <div className="h-36 bg-white/10 rounded-xl overflow-hidden flex items-center justify-center mb-4">

          {story.cover ? (

            <img
              src={story.cover.url}
              alt={story.title}
              className="w-full h-full object-cover"
            />

          ) : (

            <span className="text-gray-400">
              No Cover
            </span>

          )}

        </div>

        <h3 className="font-semibold text-lg">
          {story.title}
        </h3>

        <p className="text-gray-400 text-sm">
          {story.category}
        </p>

        <div className="flex justify-between mt-5">

          <button
            onClick={() => handleEdit(story,"draft")}
            className="text-blue-400 cursor-pointer"
          >
            Edit
          </button>

          <button
            onClick={() => handleApproveDraft(story)}
            className="text-green-400 cursor-pointer"
          >
            Approve
          </button>

          <button
            onClick={() => handleDeleteDraft(story.id)}
            className="text-red-400 cursor-pointer"
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
      {/* EXISTING STORIES */}
      {/* ========================= */}

      {tab === "Existing Stories" && (
        <div className="grid md:grid-cols-3 gap-5 mt-6">

          {publishedStories.length === 0 ? (

            <p className="text-gray-400">
              No Published Stories
            </p>

          ) : (

            publishedStories.map((story) => (

              <div
                key={story.id}
                className="
                  bg-white/5
                  border
                  border-white/10
                  rounded-2xl
                  p-4
                "
              >

                {/* Cover */}

                <div className="
                  h-36
                  bg-white/10
                  rounded-xl
                  overflow-hidden
                  flex
                  items-center
                  justify-center
                  mb-4
                ">

                  {story.cover ? (

                    <img
                      src={story.cover.url}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />

                  ) : (

                    <span className="text-gray-400 text-sm">
                      No Cover
                    </span>

                  )}

                </div>

                <h3 className="text-lg font-semibold">
                  {story.title}
                </h3>

               <div className="flex items-center justify-between"> <p className="text-sm text-gray-400 mt-1">
                  {story.category}
                </p>

                <p className="text-sm text-gray-500">
                  {story.relatedPlace}
                </p></div>

                <div className="flex justify-between mt-5">

                  <button
                    onClick={() =>
                      handleEdit(story, "published")
                    }
                    className="
                      text-blue-400
                      hover:text-blue-300
                      transition
                      cursor-pointer
                    "
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(story.id)
                    }
                    className="
                      text-red-400
                      hover:text-red-300
                      transition
                      cursor-pointer
                    "
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

export default ManageStories;