import StorySidebar from "../components/story/StorySidebar";
import StoryBook from "../components/story/StoryBook";
import ChapterNavigation from "../components/story/ChapterNavigation";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const Story = () => {
  return (
    <div className="min-h-screen pt-10 px-4 md:px-6 overflow-hidden">

      <div className="max-w-7xl mx-auto">

        {/* Back Button */}

        <Link
          to="/knowledgehub"
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

        {/* Page Header */}

        <div className="text-center mt-10 mb-12">

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
            Ramayana
          </h1>

          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Journey through one of the greatest epics of
            ancient India and discover the timeless lessons
            of duty, devotion and righteousness.
          </p>
        </div>

        {/* Main Content */}

        <div className="relative">

          {/* Background Glow */}

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

            <StorySidebar />

            {/* Book Area */}

            <div>
              <StoryBook />
              <ChapterNavigation />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Story;