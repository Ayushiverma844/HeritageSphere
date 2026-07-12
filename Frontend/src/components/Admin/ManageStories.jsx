import React, {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import toast from "react-hot-toast";

import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
} from "lucide-react";

import storyService from "../../services/storyService";
import placeService from "../../services/placeService";
import categoryService from "../../services/categoryService";

const initialForm = {

  place_id: "",

  category_id: "",

  title: "",

  summary: "",

  source_name: "",

  source_url: "",

};

const initialChapter = {

  chapter_number: 1,

  title: "",

  content: "",

  quote: "",

  image: null,

  imagePreview: "",

  image_url: "",

  public_id: "",

  isExisting: false,

};

const ManageStories = () => {

  // ==========================
  // Tabs
  // ==========================

  const [activeTab, setActiveTab] =
    useState("add");

  // ==========================
  // Form
  // ==========================

  const [form, setForm] =
    useState(initialForm);

  // ==========================
  // Cover Image
  // ==========================

  const [coverImage, setCoverImage] =
    useState(null);

  const [coverPreview, setCoverPreview] =
    useState("");

  // ==========================
  // Chapters
  // ==========================

  const [

    chapters,

    setChapters,

  ] = useState([

    initialChapter,

  ]);

  // pagination 
  const [pagination, setPagination] = useState({

  currentPage: 1,

  totalPages: 1,

  totalStories: 0,

  hasNextPage: false,

  hasPreviousPage: false,

});

  // ==========================
  // Places
  // ==========================

  const [

    places,

    setPlaces,

  ] = useState([]);

  // ==========================
  // Categories
  // ==========================

  const [

    categories,

    setCategories,

  ] = useState([]);

  // ==========================
  // Stories
  // ==========================

  const [

    stories,

    setStories,

  ] = useState([]);

  // ==========================
  // Edit
  // ==========================

  const [

    editingId,

    setEditingId,

  ] = useState(null);

  // ==========================
  // Loading
  // ==========================

  const [

    loading,

    setLoading,

  ] = useState(false);

  const [

    saving,

    setSaving,

  ] = useState(false);

  // ==========================
  // Handle Input
  // ==========================

  const handleChange = (e) => {

    const {

      name,

      value,

    } = e.target;

    setForm((prev) => ({

      ...prev,

      [name]: value,

    }));

  };

  // ==========================
  // Cover Image
  // ==========================

  const handleCoverImage = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setCoverImage(file);

    setCoverPreview(

      URL.createObjectURL(file)

    );

  };
  const handleChapterImage = (index, e) => {

  const file = e.target.files[0];

  if (!file) return;

  setChapters((prev) =>

    prev.map((chapter, i) =>

      i === index
        ? {
            ...chapter,
            image: file,
            imagePreview: URL.createObjectURL(file),
          }
        : chapter

    )

  );

};

  // ==========================
  // Reset
  // ==========================

  const resetForm = () => {

    setForm(initialForm);

    setCoverImage(null);

    setCoverPreview("");

    setEditingId(null);

   setChapters([
  {
    ...initialChapter,
  },
]);

  };
    // ==========================
  // Chapter Change
  // ==========================

  const handleChapterChange = (

    index,

    e

  ) => {

    const {

      name,

      value,

    } = e.target;

    setChapters((prev) =>

      prev.map((chapter, i) =>

        i === index

          ? {

              ...chapter,

              [name]: value,

            }

          : chapter

      )

    );

  };

  // ==========================
  // Add Chapter
  // ==========================

  const handleAddChapter = () => {

    setChapters((prev) => [

      ...prev,

      {

        chapter_number: prev.length + 1,
      title: "",
      content: "",
      quote: "",
      image: null,
      imagePreview: "",
      image_url: "",
      isExisting: false,

      },

    ]);

  };

  // ==========================
  // Delete Chapter
  // ==========================

  const handleDeleteChapter = (

    index

  ) => {

    if (

      chapters.length === 1

    ) {

      toast.error(

        "At least one chapter is required."

      );

      return;

    }

    const updated = chapters

      .filter(

        (_, i) => i !== index

      )

      .map((chapter, i) => ({

        ...chapter,

        chapter_number: i + 1,

      }));

    setChapters(updated);

  };

  // ==========================
  // Load Categories
  // ==========================

  const loadCategories = async () => {

    try {

      const res =

        await categoryService.getCategories();

      if (res.success) {

        const storyCategories =

          res.categories.filter(

            (category) =>

              category.usage_type ===

                "STORY" ||

              category.usage_type ===

                "BOTH"

          );

        setCategories(

          storyCategories

        );

      }

    }

    catch (error) {

      console.log(error);

      toast.error(

        "Unable to load categories."

      );

    }

  };

  // ==========================
  // Load Places
  // ==========================

  const loadPlaces = async () => {

    try {

      const res =

        await placeService.getAdminPlaces({

          limit: 1000,

        });

      if (res.success) {

        setPlaces(

          res.places

        );

      }

    }

    catch (error) {

      console.log(error);

      toast.error(

        "Unable to load places."

      );

    }

  };

  // ==========================
  // Load Stories
  // ==========================

  const loadStories = async (

    page = 1

  ) => {

    try {

      setLoading(true);

      const res =

        await storyService.getAdminStories({

          page,

          limit: 30,

        });

      if (res.success) {

       setStories(res.stories);

setPagination(res.pagination);

      }

    }

    catch (error) {

      console.log(error);

      toast.error(

        "Unable to load stories."

      );

    }

    finally {

      setLoading(false);

    }

  };

  // ==========================
  // Initial Load
  // ==========================

  useEffect(() => {

    loadCategories();

    loadPlaces();

    loadStories();

  }, []);

    // ==========================
  // Create / Update Story
  // ==========================

  const handleSubmit = async () => {

    if (

      

      !form.category_id ||

      !form.title

    ) {

      toast.error(

        "Please fill all required fields."

      );

      return;

    }

    if (

      chapters.some(

        (chapter) =>

          !chapter.title ||

          !chapter.content

      )

    ) {

      toast.error(

        "Every chapter must have title and content."

      );

      return;

    }

    if (

      !editingId &&

      !coverImage

    ) {

      toast.error(

        "Please select cover image."

      );

      return;

    }

    try {

      setSaving(true);

      const formData = new FormData();

      // ======================
      // Story
      // ======================

      Object.keys(form).forEach(

        (key) => {

          formData.append(

            key,

            form[key]

          );

        }

      );

 // ======================
// Chapters
// ======================

const chapterData = [];

let imageIndex = 0;

chapters.forEach((chapter) => {

  chapterData.push({

    chapter_number: chapter.chapter_number,

    title: chapter.title,

    content: chapter.content,

    quote: chapter.quote,

    imageIndex: chapter.image ? imageIndex : null,

    image_url: chapter.image_url || "",

    public_id: chapter.public_id || ""

  });

  if (chapter.image) {

    formData.append(
      "chapterImages",
      chapter.image
    );

    imageIndex++;

  }

});

formData.append(
  "chapters",
  JSON.stringify(chapterData)
);



chapters.forEach((chapter) => {

  if (chapter.image) {

    formData.append(

      "chapterImages",

      chapter.image

    );

  }

});
      // ======================
      // Cover
      // ======================

      if (coverImage) {

        formData.append(

          "cover_image",

          coverImage

        );

      }

      let res;

      if (editingId) {

        res =

          await storyService.updateStory(

            editingId,

            formData

          );

      }

      else {

        res =

          await storyService.createStory(

            formData

          );

      }

      if (res.success) {

        toast.success(

          res.message

        );

        resetForm();

        loadStories();

        setActiveTab(

          "manage"

        );

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

  // ==========================
  // Edit Story
  // ==========================

  const handleEdit = async (

    storyId

  ) => {

    try {

      const res =

        await storyService.getAdminStoryById(

          storyId

        );

      if (!res.success) return;

      const story = res.story;

      setEditingId(

        story.story_id

      );

      setForm({

        place_id:

          story.place_id || "",

        category_id:

          story.category_id,

        title:

          story.title,

        summary:

          story.summary || "",

        source_name:

          story.source_name || "",

        source_url:

          story.source_url || "",

      });

      setCoverPreview(

        story.cover_image

      );

      setCoverImage(

        null

      );

  setChapters(

  res.chapters.map((chapter) => ({

    chapter_number: chapter.chapter_number,

    title: chapter.title,

    content: chapter.content,

    quote: chapter.quote || "",

    image: null,

    imagePreview: "",

    image_url: chapter.image_url || "",

    public_id: chapter.public_id || "",

    isExisting: true,

  }))

);

      setActiveTab(

        "add"

      );

      window.scrollTo({

        top: 0,

        behavior: "smooth",

      });

    }

    catch (error) {

      console.log(error);

      toast.error(

        "Unable to load story."

      );

    }

  };
    // ==========================
  // Delete Story
  // ==========================

  const handleDelete = async (
    storyId
  ) => {

    const confirmDelete =
      window.confirm(
        "Delete this story?"
      );

    if (!confirmDelete) return;

    try {

      const res =
        await storyService.deleteStory(
          storyId
        );

      if (res.success) {

        toast.success(
          res.message
        );

        loadStories();

      }

    }

    catch (error) {

      console.log(error);

      toast.error(

        error.response?.data?.message ||

        "Unable to delete story."

      );

    }

  };

  return (

    <div className="min-h-screen px-6 py-10 text-white">

      {/* ================= HEADER ================= */}

      <Link

        to="/admin"

        className="

          inline-flex

          items-center

          gap-2

          text-gray-300

          mb-6

          hover:text-white

          transition

        "

      >

        <ArrowLeft size={18} />

        Back to Dashboard

      </Link>

      <div className="flex items-center justify-between mb-8">

        <div>

          <h1 className="text-4xl font-bold">

            Manage Stories

          </h1>

          <p className="text-gray-400 mt-2">

            Create, update and manage heritage stories.

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
            cursor-pointer

            ${

              activeTab === "add"

                ? "bg-yellow-500 text-black"

                : "bg-white/10 hover:bg-white/20"

            }

          `}

        >

          <Plus

            size={18}

            className="inline mr-2"

          />

          {

            editingId

              ? "Edit Story"

              : "Add Story"

          }

        </button>

        <button

          onClick={() =>

            setActiveTab("manage")

          }

          className={`

            px-6

            py-3

            rounded-xl

            transition
            cursor-pointer

            ${

              activeTab === "manage"

                ? "bg-yellow-500 text-black"

                : "bg-white/10 hover:bg-white/20"

            }

          `}

        >

          Manage Stories

        </button>

      </div>

      {/* =======================================================
          ADD / EDIT STORY
      ======================================================= */}

      {

        activeTab === "add" && (

          <div className="grid lg:grid-cols-3 gap-8">

            {/* =======================================
                LEFT
            ======================================= */}

            <div className="

              lg:col-span-2

              rounded-3xl

              bg-white/5

              border

              border-white/10

              p-6

            ">

              <h2 className="

                text-xl

                font-semibold

                mb-6

              ">

                Story Information

              </h2>
                            {/* Story Title */}

              <div className="mb-5">

                <label className="block mb-2">

                  Story Title

                </label>

                <input

                  type="text"

                  name="title"

                  value={form.title}

                  onChange={handleChange}

                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3"

                />

              </div>

              {/* Category + Place */}

              <div className="grid md:grid-cols-2 gap-4 mb-5">

                <div>

                  <label className="block mb-2">

                    Category

                  </label>

                  <select

                    name="category_id"

                    value={form.category_id}

                    onChange={handleChange}

                    className="w-full rounded-xl bg-[#111827] border border-white/10 px-4 py-3"

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

                    Related Place (Optional)

                  </label>

                  <select

                    name="place_id"

                    value={form.place_id}

                    onChange={handleChange}

                    className="w-full rounded-xl bg-[#111827] border border-white/10 px-4 py-3"

                  >

                    <option value="">

                      No Related Place

                    </option>

                    {places.map((place) => (

                      <option

                        key={place.place_id}

                        value={place.place_id}

                      >

                        {place.name}

                      </option>

                    ))}

                  </select>

                </div>

              </div>

              {/* Summary */}

              <div className="mb-5">

                <label className="block mb-2">

                  Summary

                </label>

                <textarea

                  rows={4}

                  name="summary"

                  value={form.summary}

                  onChange={handleChange}

                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3"

                />

              </div>

              {/* Source */}

              <div className="grid md:grid-cols-2 gap-4 mb-8">

                <div>

                  <label className="block mb-2">

                    Source Name

                  </label>

                  <input

                    type="text"

                    name="source_name"

                    value={form.source_name}

                    onChange={handleChange}

                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3"

                  />

                </div>

                <div>

                  <label className="block mb-2">

                    Source URL

                  </label>

                  <input

                    type="text"

                    name="source_url"

                    value={form.source_url}

                    onChange={handleChange}

                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3"

                  />

                </div>

              </div>

              {/* Chapters */}

              <div className="flex items-center justify-between mb-5">

                <h2 className="text-2xl font-semibold">

                  Chapters

                </h2>

                <button

                  type="button"

                  onClick={handleAddChapter}

                  className="px-4 py-2 rounded-xl bg-yellow-500 text-black font-semibold cursor-pointer"

                >

                  + Add Chapter

                </button>

              </div>

              {chapters.map((chapter, index) => (

                <div

                  key={index}

                  className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-5"

                >

                  <div className="flex items-center justify-between mb-5">

                    <h3 className="font-semibold text-lg">

                      Chapter {index + 1}

                    </h3>

                    {chapters.length > 1 && (

                      <button

                        type="button"

                        onClick={() =>

                          handleDeleteChapter(index)

                        }

                        className="text-red-400"

                      >

                        <Trash2 size={18} />

                      </button>

                    )}

                  </div>

                  <div className="mb-4">

                    <label className="block mb-2">

                      Chapter Title

                    </label>

                    <input

                      type="text"

                      name="title"

                      value={chapter.title}

                      onChange={(e) =>

                        handleChapterChange(index, e)

                      }

                      className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3"

                    />

                  </div>

                  <div className="mb-4">

                    <label className="block mb-2">

                      Quote

                    </label>

                    <textarea

                      rows={2}

                      name="quote"

                      value={chapter.quote}

                      onChange={(e) =>

                        handleChapterChange(index, e)

                      }

                      className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3"

                    />

                  </div>

                  <div>

                    <label className="block mb-2">

                      Chapter Content

                    </label>

                    <textarea

                      rows={10}

                      name="content"

                      value={chapter.content}

                      onChange={(e) =>

                        handleChapterChange(index, e)

                      }

                      className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3"

                    />

                  </div>

                  <div className="mt-5">

  <label className="block mb-2">

    Chapter Image

  </label>

  <div className="border border-dashed border-white/20 rounded-xl p-3">

    {(chapter.imagePreview || chapter.image_url) && (

      <img
        src={
          chapter.imagePreview ||
          chapter.image_url
        }
        alt=""
        className="h-44 w-full object-cover rounded-lg mb-3"
      />

    )}

    <label className="block">

      <div className="bg-white/10 rounded-xl py-2 text-center cursor-pointer">

        Upload Chapter Image

      </div>

      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e)=>
          handleChapterImage(index,e)
        }
      />

    </label>

  </div>

</div>

                </div>


              ))}

            </div>

            {/* ========================= RIGHT PANEL ========================= */}

            <div className="space-y-6">

              <div className="rounded-3xl bg-white/5 border border-white/10 p-6">

                <h2 className="text-xl font-semibold mb-4">

                  Cover Image

                </h2>

                <div className="h-64 rounded-2xl border border-dashed border-white/20 overflow-hidden flex items-center justify-center bg-white/5">

                  {coverPreview ? (

                    <img

                      src={coverPreview}

                      alt=""

                      className="w-full h-full object-cover"

                    />

                  ) : (

                    <span className="text-gray-400">

                      No Cover Selected

                    </span>

                  )}

                </div>

                <label className="mt-4 block">

                  <div className="w-full text-center cursor-pointer rounded-xl bg-yellow-500 text-black py-3 font-semibold ">

                    Upload Cover

                  </div>

                  <input

                    type="file"

                    accept="image/*"

                    className="hidden"

                    onChange={handleCoverImage}

                  />

                </label>

              </div>

              <div className="rounded-3xl bg-white/5 border border-white/10 p-6">

               <button
  onClick={handleSubmit}
  disabled={saving}
  className={`
    w-full
    py-3
    rounded-xl
    font-semibold
    flex
    justify-center
    items-center
    gap-2
    transition-all
    duration-200
    cursor-pointer

    ${
      saving
        ? "bg-yellow-300 text-gray-700 cursor-not-allowed opacity-80"
        : "bg-yellow-500 hover:bg-yellow-400 active:scale-95 text-black"
    }
  `}
>
  <Save size={18} />

  {saving
    ? editingId
      ? "Updating..."
      : "Creating..."
    : editingId
    ? "Update Story"
    : "Create Story"}
</button>

                {editingId && (

                  <button

                    onClick={resetForm}

                    className="w-full mt-3 py-3 rounded-xl cursor-pointer bg-red-500 hover:bg-red-700 transition"

                  >

                    Cancel Editing

                  </button>

                )}

              </div>

            </div>

          </div>

        )

      }
                {/* ========================================= */}
      {/* MANAGE STORIES */}
      {/* ========================================= */}

      {activeTab === "manage" && (

        <div className="rounded-3xl bg-white/5 border border-white/10 p-6">

          <div className="flex items-center justify-between mb-6">

            <div>

              <h2 className="text-2xl font-semibold">

                Existing Stories

              </h2>

              <p className="text-gray-400 mt-1">

                Total Stories : {pagination.totalStories}

              </p>

            </div>

          </div>

          {loading ? (

            <div className="py-16 text-center text-gray-400">

              Loading Stories...

            </div>

          ) : stories.length === 0 ? (

            <div className="py-16 text-center text-gray-400">

              No Stories Found.

            </div>

          ) : (

            <>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

                {stories.map((story) => (

                  <div

                    key={story.story_id}

                    className="rounded-3xl overflow-hidden bg-[#111827] border border-white/10"

                  >

                    {/* Cover */}

                    <div className="h-56 overflow-hidden">

                      <img

                        src={story.cover_image}

                        alt={story.title}

                        className="w-full h-full object-cover"

                      />

                    </div>

                    {/* Body */}

                    <div className="p-5">

                      <h3 className="text-xl font-semibold">

                        {story.title}

                      </h3>

                      <p className="text-gray-400 mt-2 line-clamp-2">

                        {story.summary}

                      </p>

                      <p className="text-sm text-yellow-400 mt-3">

                        {story.category_name}

                      </p>

                      <p className="text-sm text-gray-500 mt-1">

                        {story.place_name}

                      </p>

                      <p className="text-xs text-gray-500 mt-2">

                        Chapters : {story.total_chapters}

                      </p>

                      <div className="flex gap-3 mt-6">

                        <button

                          onClick={() =>
                            handleEdit(story.story_id)
                          }

                          className="flex-1 py-2 rounded-xl bg-blue-600 cursor-pointer hover:bg-blue-700 transition "

                        >

                          Edit

                        </button>

                        <button

                          onClick={() =>
                            handleDelete(story.story_id)
                          }

                          className="flex-1 py-2 rounded-xl bg-red-600 cursor-pointer hover:bg-red-700 transition"

                        >

                          Delete

                        </button>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

              {/* ===================== */}
              {/* Pagination */}
              {/* ===================== */}

              <div className="flex justify-center items-center gap-4 mt-10">

                <button

                  disabled={!pagination.hasPreviousPage}

                  onClick={() =>
                    loadStories(

  pagination.currentPage - 1

)
                  }

                  className="px-5 py-2 rounded-lg bg-white/10 disabled:opacity-40"

                >

                  Previous

                </button>

                <span>

                  Page {pagination.currentPage} of{" "}

                  {pagination.totalPages}

                </span>

                <button

                  disabled={!pagination.hasNextPage}

                  onClick={() =>
                    loadStories(

  pagination.currentPage + 1

)
                  }

                  className="px-5 py-2 rounded-lg bg-white/10 disabled:opacity-40"

                >

                  Next

                </button>

              </div>

            </>

          )}

        </div>

      )}

    </div>

  );

};

export default ManageStories;