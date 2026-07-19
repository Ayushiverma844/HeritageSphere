import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen ,  Bookmark, } from "lucide-react";

import StorySidebar from "../components/Story/StorySidebar";
import StoryBook from "../components/Story/StoryBook";
import ChapterNavigation from "../components/Story/ChapterNavigation";

import storyService from "../services/storyService";
import collectionService from "../services/collectionService";

const Story = () => {
  const { slug } = useParams();

  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}, [currentChapter]);
  useEffect(() => {
    fetchStory();
  }, [slug]);

  useEffect(() => {

  if (story) {

    fetchSavedStatus();

  }

}, [story]);

  const fetchStory = async () => {
    try {
      setLoading(true);

      const data = await storyService.getStoryDetails(slug);

      setStory(data.story);
      setChapters(data.chapters || []);
      setCurrentChapter(0);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedStatus = async () => {
  try {

    const res =
      await collectionService.getMyCollection();

    const saved = (res.stories || []).some(
      (item) =>
        item.story_id === story.story_id
    );

    setIsSaved(saved);

  } catch (err) {

    console.log(err);

  }
};

const handleSave = async () => {
  try {

    if (isSaved) {

      await collectionService.removeItem(
        "STORY",
        story.story_id
      );

      setIsSaved(false);

    } else {

      await collectionService.saveItem(
        "STORY",
        story.story_id
      );

      setIsSaved(true);

    }

  } catch (err) {

    console.log(err);

  }
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading story...
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Story not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 px-2 md:px-4 overflow-hidden">

      <div className="max-w-7xl mx-auto">

        {/* Back Button */}

        <Link
          to="/knowledge-hub"
          className="
          inline-flex
          items-center
          gap-2
          px-4
          py-2
          rounded-xl
          bg-white/5
          border
          border-white/10
          text-gray-300
          hover:text-heritage-gold
          hover:border-heritage-gold
          transition-all
          duration-300
          "
        >
          <ArrowLeft size={18} />
          Back to Knowledge Hub
        </Link>

        {/* Header */}

        <div className="relative text-center mt-10 mb-12">
          <button
  onClick={handleSave}
  className="
  absolute
  right-0
  top-0
  h-15
  w-15
  rounded-full
  bg-white/5
  border
  border-heritage-gold/20
  backdrop-blur-md
  flex
  items-center
  justify-center
  hover:scale-110
  hover:border-heritage-gold
  transition-all
  duration-300
  cursor-pointer
  "
>
  <Bookmark
    size={25}
    className={
      isSaved
        ? "text-heritage-gold fill-heritage-gold"
        : "text-white"
    }
  />
</button>

          <div
            className="
            inline-flex
            items-center
            gap-2
            px-4
            py-2
            rounded-full
            bg-white/5
            border
            border-white/10
            text-heritage-gold
            "
          >
            <BookOpen size={16} />
            Ancient Manuscript
          </div>

          <h1
            className="
            mt-6
            text-4xl
            md:text-6xl
            font-serif
            text-white
            "
          >
            {story.title}
          </h1>

          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            {story.summary}
          </p>

        </div>

        {/* Main Content */}

        <div className="relative">

          <div
            className="
            absolute
            left-1/2
            top-20
            -translate-x-1/2
            w-175
            h-175
            bg-amber-400/5
            blur-[180px]
            rounded-full
            pointer-events-none
            "
          />

          <div
            className="
            relative
            grid
            lg:grid-cols-[280px_1fr]
            gap-8
            "
          >

            {/* Sidebar */}

            <StorySidebar
              chapters={chapters}
              currentChapter={currentChapter}
              setCurrentChapter={setCurrentChapter}
            />

            {/* Book */}

            <div>

              <StoryBook
                story={story}
                chapter={chapters[currentChapter]}
              />

              <ChapterNavigation
                chapters={chapters}
                currentChapter={currentChapter}
                setCurrentChapter={setCurrentChapter}
              />

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Story;