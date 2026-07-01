import React, { useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowLeft,
  Sparkles,
  Wand2,
  MapPinned,
  Languages,
  BookOpen,
} from "lucide-react";

const AIStoryGenerator = () => {
  // ======================================================
  // FORM
  // ======================================================

  const [form, setForm] = useState({
    place: "",
    category: "",
    era: "",
    language: "English",
    style: "Narrative",
    tone: "Inspirational",
    keywords: "",
    creativity: 70,
    length: "Medium",
  });

  // ======================================================
  // OUTPUT
  // ======================================================

  const [generatedStory, setGeneratedStory] = useState("");
  const [loading, setLoading] = useState(false);

  const [history, setHistory] = useState([]);

  // ======================================================
  // HANDLE INPUT
  // ======================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ======================================================
  // TEMPLATE
  // ======================================================

  const useTemplate = (style) => {
    setForm((prev) => ({
      ...prev,
      style,
    }));
  };

  // ======================================================
  // GENERATE STORY
  // Gemini API will come later
  // ======================================================

  const generateStory = () => {
    setLoading(true);
    setGeneratedStory("");

    setTimeout(() => {
      const story = `

Title : ${form.place}

Category : ${form.category}

Era : ${form.era}

Language : ${form.language}

Style : ${form.style}

Tone : ${form.tone}

Length : ${form.length}

Keywords :

${form.keywords}

------------------------------------------

This is a placeholder story.

Later this content will be generated
using Gemini AI API.

`;

      setGeneratedStory(story);

      setHistory((prev) => [
        {
          id: Date.now(),
          place: form.place || "Untitled Story",
          date: new Date().toLocaleString(),
        },
        ...prev,
      ]);

      setLoading(false);
    }, 1800);
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto text-white px-6 py-10">

      {/* ========================================= */}
      {/* BACK */}
      {/* ========================================= */}

      <Link
        to="/admin"
        className="
        inline-flex
        items-center
        gap-2
        text-gray-400
        hover:text-yellow-400
        transition
        mb-8
        "
      >
        <ArrowLeft size={18} />
        Back
      </Link>

      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}

      <div className="mb-10">

        <div
          className="
          inline-flex
          items-center
          gap-2
          px-4
          py-2
          rounded-full
          bg-yellow-500/10
          border
          border-yellow-500/20
          text-yellow-400
          "
        >
          <Sparkles size={18} />
          AI Story Generator
        </div>

        <h1
          className="
          text-5xl
          font-bold
          mt-5
          "
        >
          Generate Heritage Stories
        </h1>

        <p className="text-gray-400 mt-3">
          Generate Heritage Stories with AI
        </p>

      </div>

      {/* ========================================= */}
      {/* MAIN GRID */}
      {/* ========================================= */}

      <div
        className="
        grid
        lg:grid-cols-2
        gap-8
        items-stretch
        "
      >

        {/* ========================================= */}
        {/* LEFT PANEL */}
        {/* ========================================= */}

        <div
          className="
          bg-white/5
          border
          border-white/10
          rounded-3xl
          p-7
          h-fit
          sticky
          top-5
          "
        >

          <h2 className="text-2xl font-bold mb-7">
            Prompt Builder
          </h2>

          {/* PLACE */}

          <label className="text-sm text-gray-400">
            Heritage Place
          </label>

          <div className="relative mt-2 mb-5">

            <MapPinned
              size={18}
              className="
              absolute
              left-4
              top-4
              text-gray-400
              "
            />

            <input
              type="text"
              name="place"
              value={form.place}
              onChange={handleChange}
              placeholder="Example : Taj Mahal"
              className="
              w-full
              pl-11
              pr-4
              py-3
              rounded-xl
              bg-[#141D2B]
              border
              border-white/10
              outline-none
              focus:border-yellow-400
              "
            />

          </div>

          {/* CATEGORY */}

          <label className="text-sm text-gray-400">
            Story Category
          </label>

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="
            w-full
            mt-2
            mb-5
            p-3
            rounded-xl
            bg-[#141D2B]
            border
            border-white/10
            "
          >
            <option value="">
              Select Category
            </option>

            <option>History</option>
            <option>Mythology</option>
            <option>Culture</option>
            <option>Freedom Struggle</option>
            <option>Legends</option>

          </select>

          {/* ERA */}

          <label className="text-sm text-gray-400">
            Historical Era
          </label>

          <input
            type="text"
            name="era"
            value={form.era}
            onChange={handleChange}
            placeholder="Example : Mughal Era"
            className="
            w-full
            mt-2
            mb-5
            p-3
            rounded-xl
            bg-[#141D2B]
            border
            border-white/10
            outline-none
            focus:border-yellow-400
            "
          />

          {/* LANGUAGE */}

          <label className="text-sm text-gray-400">
            Language
          </label>

          <div className="relative mt-2 mb-5">

            <Languages
              size={18}
              className="
              absolute
              left-4
              top-4
              text-gray-400
              "
            />

            <select
              name="language"
              value={form.language}
              onChange={handleChange}
              className="
              w-full
              pl-11
              p-3
              rounded-xl
              bg-[#141D2B]
              border
              border-white/10
              "
            >
              <option>English</option>
              <option>Hindi</option>
              <option>Hinglish</option>
            </select>

          </div>

          {/* STYLE */}

          <label className="text-sm text-gray-400">
            Story Style
          </label>

          <select
            name="style"
            value={form.style}
            onChange={handleChange}
            className="
            w-full
            mt-2
            mb-5
            p-3
            rounded-xl
            bg-[#141D2B]
            border
            border-white/10
            "
          >
            <option>Narrative</option>
            <option>Historical</option>
            <option>Documentary</option>
            <option>Adventure</option>
            <option>Kids Friendly</option>
          </select>
                    {/* TONE */}

          <label className="text-sm text-gray-400">
            Story Tone
          </label>

          <select
            name="tone"
            value={form.tone}
            onChange={handleChange}
            className="
            w-full
            mt-2
            mb-5
            p-3
            rounded-xl
            bg-[#141D2B]
            border
            border-white/10
            "
          >
            <option>Inspirational</option>
            <option>Emotional</option>
            <option>Mysterious</option>
            <option>Dramatic</option>
            <option>Educational</option>
          </select>

          {/* KEYWORDS */}

          <label className="text-sm text-gray-400">
            Keywords
          </label>

          <textarea
            rows={4}
            name="keywords"
            value={form.keywords}
            onChange={handleChange}
            placeholder="Kings, Architecture, Battle, Love..."
            className="
            w-full
            mt-2
            mb-5
            p-3
            rounded-xl
            bg-[#141D2B]
            border
            border-white/10
            outline-none
            resize-none
            "
          />

          {/* CREATIVITY */}

          <div className="flex justify-between mb-2">
            <label className="text-sm text-gray-400">
              Creativity
            </label>

            <span className="text-yellow-400">
              {form.creativity}%
            </span>
          </div>

          <input
            type="range"
            name="creativity"
            min="0"
            max="100"
            value={form.creativity}
            onChange={handleChange}
            className="w-full mb-5"
          />

          {/* LENGTH */}

          <label className="text-sm text-gray-400">
            Story Length
          </label>

          <select
            name="length"
            value={form.length}
            onChange={handleChange}
            className="
            w-full
            mt-2
            mb-7
            p-3
            rounded-xl
            bg-[#141D2B]
            border
            border-white/10
            "
          >
            <option>Short</option>
            <option>Medium</option>
            <option>Long</option>
          </select>

          {/* GENERATE */}

          <button
            onClick={generateStory}
            disabled={loading}
            className="
            w-full
            flex
            items-center
            justify-center
            gap-3
            py-4
            rounded-xl
            bg-yellow-500
            hover:bg-yellow-400
            text-black
            font-bold
            transition
            disabled:opacity-50
            "
          >
            <Wand2 size={20} />

            {loading
              ? "Generating..."
              : "Generate Story"}
          </button>

        </div>

        {/* ========================================= */}
        {/* RIGHT PANEL */}
        {/* ========================================= */}

        <div
          className="
          bg-white/5
          border
          border-white/10
          rounded-3xl
          p-7
          h-full
          "
        >

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-2xl font-bold flex items-center gap-3">

              <BookOpen
                size={22}
                className="text-yellow-400"
              />

              Generated Story

            </h2>

            {generatedStory && (

              <div className="flex gap-3">

                <button
                  className="
                  px-4
                  py-2
                  rounded-xl
                  bg-green-500
                  hover:bg-green-600
                  text-white
                  transition
                  "
                >
                  Publish
                </button>

                <button
                  className="
                  px-4
                  py-2
                  rounded-xl
                  bg-yellow-500
                  hover:bg-yellow-400
                  text-black
                  transition
                  "
                >
                  Save
                </button>

                <button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      generatedStory
                    )
                  }
                  className="
                  px-4
                  py-2
                  rounded-xl
                  bg-blue-500
                  hover:bg-blue-600
                  text-white
                  transition
                  "
                >
                  Copy
                </button>

              </div>

            )}

          </div>

          {!generatedStory ? (

            <div
              className="
              min-h-180
              flex
              flex-col
              justify-center
              items-center
              text-center
              "
            >

              <Sparkles
                size={65}
                className="text-gray-500 mb-5"
              />

              <h3 className="text-2xl font-semibold">
                Story appears here
              </h3>

              <p className="text-gray-500 mt-3">
                Fill the prompt and click
                <span className="text-yellow-400">
                  {" "}
                  Generate Story
                </span>
              </p>

            </div>

          ) : (

            <textarea
              rows={28}
              value={generatedStory}
              onChange={(e) =>
                setGeneratedStory(e.target.value)
              }
              className="
              w-full
              rounded-2xl
              bg-[#111827]
              border
              border-white/10
              p-5
              resize-none
              outline-none
              text-gray-200
              "
            />

          )}

        </div>

      </div>

     
      {/* ========================================= */}
      {/* RECENT STORIES */}
      {/* ========================================= */}

      <div
        className="
        mt-8
        bg-white/5
        border
        border-white/10
        rounded-3xl
        p-6
        "
      >
        <h2 className="text-2xl font-bold mb-6">
          Recent Stories
        </h2>

        {history.length === 0 ? (

          <p className="text-gray-500">
            No stories generated yet.
          </p>

        ) : (

          <div className="space-y-4">

            {history.map((item) => (

              <div
                key={item.id}
                className="
                flex
                items-center
                justify-between
                bg-[#141D2B]
                border
                border-white/10
                rounded-xl
                p-4
                "
              >

                {/* Story Info */}

                <div>

                  <h3 className="font-semibold text-lg">
                    {item.place}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {item.date}
                  </p>

                </div>

                {/* Copy Button */}

                <button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      generatedStory
                    )
                  }
                  className="
                  px-5
                  py-2
                  rounded-lg
                  bg-blue-500/20
                  text-blue-400
                  hover:bg-blue-500
                  hover:text-white
                  transition
                  "
                >
                  Copy
                </button>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
};

export default AIStoryGenerator;