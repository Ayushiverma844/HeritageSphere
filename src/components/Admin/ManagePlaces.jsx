import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  MapPin,
  Image as ImageIcon,
  Save,
  Send,
  Trash2,
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

const ManagePlaces = () => {
  const [tab, setTab] = useState("form");
  const [form, setForm] = useState(initialForm);

  // ✅ Published Places (ONLY shows in Existing Places)
  const [publishedPlaces, setPublishedPlaces] = useState([
    { id: 1, name: "Taj Mahal", type: "Monument", country: "India" },
    { id: 2, name: "Amer Fort", type: "Fort", country: "India" },
    { id: 3, name: "Khajuraho Temple", type: "Temple", country: "India" },
  ]);
  

 const [drafts, setDrafts] = useState([
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
]);

  const [galleryImages, setGalleryImages] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🟡 Save Draft (NOT published)
  const handleSaveDraft = () => {
    setDrafts([
      ...drafts,
      {
        id: Date.now(),
        ...form,
        gallery: galleryImages,
      },
    ]);

    setForm(initialForm);
    setGalleryImages([]);
    console.log("Draft Saved");
  };
  const handleApproveDraft = (draft) => {
  setPublishedPlaces([
    ...publishedPlaces,
    {
      id: Date.now(),
      name: draft.title,
      type: draft.category,
      country: draft.state,
      gallery: draft.gallery,
    },
  ]);

  setDrafts(drafts.filter((d) => d.id !== draft.id));
}; 
const handleDeleteDraft = (id) => {
  setDrafts(drafts.filter((d) => d.id !== id));
};
const handleEditDraft = (draft) => {
  setForm({
    title: draft.title,
    category: draft.category,
    state: draft.state,
    city: draft.city,
    description: draft.description,
    era: draft.era,
    builtBy: draft.builtBy,
    style: draft.style,
    year: draft.year,
    address: draft.address,
    latitude: draft.latitude,
    longitude: draft.longitude,
    mapUrl: draft.mapUrl,
  });

  setGalleryImages(draft.gallery || []);
  setTab("form");

  setDrafts(drafts.filter((d) => d.id !== draft.id));
};

  // 🔥 Publish (ONLY here goes Existing Places)
  const handlePublish = () => {
    setPublishedPlaces([
      ...publishedPlaces,
      {
        id: Date.now(),
        name: form.title,
        type: form.category,
        country: form.state,
        gallery: galleryImages,
      },
    ]);

    setForm(initialForm);
    setGalleryImages([]);
    setTab("Existing Places");
  };

  const handleDelete = (id) => {
    setPublishedPlaces(publishedPlaces.filter((p) => p.id !== id));
  };

  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files);

    const images = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setGalleryImages((prev) => [...prev, ...images]);
  };

  return (
    <div className="min-h-screen px-6 py-10 text-white">

      {/* BACK */}
      <Link
        to="/admin"
        className="inline-flex items-center gap-2 text-gray-300 mb-6"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </Link>

      {/* HEADER */}
      <h1 className="text-4xl font-bold">Manage Heritage Places</h1>

      {/* TABS */}
      <div className="flex gap-4 my-6">
        {["Add Place", "Drafts", "Existing Places"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-xl ${
              tab === t ? "bg-yellow-500 text-black" : "bg-white/10"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* FORM */}
      {tab === "form" && (
        <div className="grid lg:grid-cols-3 gap-6">

          {/* LEFT FORM */}
           {/* FORM */}

        {tab === "form" && (

          <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6">



            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>



            <input

              name="title"

              value={form.title}

              onChange={handleChange}

              placeholder="Place Title"

              className="w-full mb-4 p-3 rounded-xl bg-white/5 border border-white/10"

            />



            <div className="grid md:grid-cols-3 gap-4 mb-4">

              <select

  name="category"

  value={form.category}

  onChange={handleChange}

  className="p-3 rounded-xl border border-white/20 text-white cursor-pointer"

>

  <option value=""disabled hidden className="bg-gray-200 text-black">Select Category</option>

  <option value="Monument" className="bg-gray-200 text-black">Monument</option>

  <option value="Temple" className="bg-gray-200 text-black">Temple</option>

  <option value="Fort" className="bg-gray-200 text-black">Fort</option>

</select>



              <select

  name="state"

  value={form.state}

  onChange={handleChange}

  className="p-3 rounded-xl  border border-white/20 text-white cursor-pointer"

>

  <option value="" disabled hidden className="bg-gray-200 text-black">Select State</option>

  <option value="Madhya Pradesh" className="bg-gray-200 text-black">Madhya Pradesh</option>

  <option value="Rajasthan" className="bg-gray-200 text-black">Rajasthan</option>

  <option value="Uttar Pradesh" className="bg-gray-200 text-black">Uttar Pradesh</option>

  <option value="Maharashtra" className="bg-gray-200 text-black">Maharashtra</option>

  <option value="Gujarat" className="bg-gray-200 text-black">Gujarat</option>

</select>

              <select

  name="city"

  value={form.city}

  onChange={handleChange}

  className="p-3 rounded-xl border border-white/20 text-white cursor-pointer"

>

  <option value="" disabled hidden className="bg-gray-200 text-black">Select City</option>

  <option value="Bhopal" className="bg-gray-200 text-black">Bhopal</option>

  <option value="Indore" className="bg-gray-200 text-black">Indore</option>

  <option value="Jaipur" className="bg-gray-200 text-black">Jaipur</option>

  <option value="Agra" className="bg-gray-200 text-black">Agra</option>

  <option value="Mumbai" className="bg-gray-200 text-black">Mumbai</option>

</select>

            </div>



            <textarea

              name="description"

              onChange={handleChange}

              rows="4"

              placeholder="Description"

              className="w-full mb-6 p-3 rounded-xl bg-white/5 border border-white/10"

            />



            <h2 className="text-lg font-semibold mb-3">

              Historical Information

            </h2>



            <div className="grid md:grid-cols-3 gap-4 mb-4">

              <input

                name="era"

                onChange={handleChange}

                placeholder="Era"

                className="p-3 rounded-xl bg-white/5 border border-white/10"

              />

              <input

                name="builtBy"

                onChange={handleChange}

                placeholder="Built By"

                className="p-3 rounded-xl bg-white/5 border border-white/10"

              />

              <input

                name="style"

                onChange={handleChange}

                placeholder="Style"

                className="p-3 rounded-xl bg-white/5 border border-white/10"

              />

            </div>



            <input

              name="year"

              onChange={handleChange}

              placeholder="Year"

              className="w-full mb-6 p-3 rounded-xl bg-white/5 border border-white/10"

            />



            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">

              <MapPin size={18} /> Location

            </h2>



            <input

              name="address"

              onChange={handleChange}

              placeholder="Address"

              className="w-full mb-3 p-3 rounded-xl bg-white/5 border border-white/10"

            />



            <div className="grid md:grid-cols-2 gap-4 mb-3">

              <input

                name="latitude"

                onChange={handleChange}

                placeholder="Latitude"

                className="p-3 rounded-xl bg-white/5 border border-white/10"

              />

              <input

                name="longitude"

                onChange={handleChange}

                placeholder="Longitude"

                className="p-3 rounded-xl bg-white/5 border border-white/10"

              />

            </div>



            <input

              name="mapUrl"

              onChange={handleChange}

              placeholder="Map URL"

              className="w-full p-3 rounded-xl bg-white/5 border border-white/10"

            />

          </div>

        )}


          {/* RIGHT PANEL */}
          <div className="space-y-4">

            {/* COVER */}
            <div className="bg-white/5 p-4 rounded-2xl">
              <h2 className="mb-2">Cover Image</h2>
              <div className="h-32 bg-white/10 rounded mb-2"></div>
              <button className="w-full bg-yellow-500 text-black py-2 rounded">
                Upload Cover
              </button>
            </div>

            {/* GALLERY */}
            <div className="bg-white/5 p-4 rounded-2xl">
              <h2 className="mb-2">Gallery</h2>

              <label className="block cursor-pointer bg-white/10 p-2 rounded text-center">
                <ImageIcon className="inline" /> Upload Images
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleGalleryUpload}
                />
              </label>

              <div className="grid grid-cols-2 gap-2 mt-2">
                {galleryImages.map((img, i) => (
                  <img
                    key={i}
                    src={img.url}
                    className="h-20 w-full object-cover rounded"
                  />
                ))}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="bg-white/5 p-4 rounded-2xl">
              <button
                onClick={handleSaveDraft}
                className="w-full bg-gray-700 py-2 mb-2 rounded flex items-center justify-center gap-2"
              >
                <Save size={16} /> Save Draft
              </button>

              <button
                onClick={handlePublish}
                className="w-full bg-yellow-500 text-black py-2 rounded flex items-center justify-center gap-2"
              >
                <Send size={16} /> Publish
              </button>
            </div>

          </div>
        </div>
      )}

      
      {/* Draft Section */}
{tab === "draft" && (
  <div className="grid md:grid-cols-3 gap-5 mt-6">

    {drafts.length === 0 ? (
      <p className="text-gray-400">No Drafts Available</p>
    ) : (
      drafts.map((item) => (
        <div key={item.id} className="bg-white/5 p-4 rounded-2xl">

          <div className="h-28 bg-white/10 rounded mb-2"></div>

          <h3 className="font-bold">{item.title}</h3>

          <p className="text-sm text-gray-400">
            {item.category} • {item.state}
          </p>

          <div className="flex justify-between mt-3">

            <button
              onClick={() => handleEditDraft(item)}
              className="text-blue-400"
            >
              Edit
            </button>

            <button
              onClick={() => handleApproveDraft(item)}
              className="text-green-400"
            >
              Approve
            </button>

            <button
              onClick={() => handleDeleteDraft(item.id)}
              className="text-red-400"
            >
              Delete
            </button>

          </div>

        </div>
      ))
    )}

  </div>
)}

      {/* Existing Places (ONLY PUBLISHED) */}
      {tab === "Existing Places" && (
        <div className="grid md:grid-cols-3 gap-5 mt-6">

          {publishedPlaces.map((item) => (
            <div key={item.id} className="bg-white/5 p-4 rounded-2xl">

              <div className="h-28 bg-white/10 rounded mb-2"></div>

              <h3 className="font-bold">{item.name}</h3>
              <p className="text-sm text-gray-400">
                {item.type} • {item.country}
              </p>

              <div className="flex justify-between mt-3">
                <button className="text-sm">Edit</button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-sm text-red-400"
                >
                  Delete
                </button>
              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default ManagePlaces;