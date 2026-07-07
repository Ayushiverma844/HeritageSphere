import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  MapPinned,
  BookOpen,
  Users,
  Layers3,
  Sparkles,
  Plus,
  Clock3,
  Landmark,
  Heart,
  TrendingUp,
} from "lucide-react";

import ManageCategories from "../components/Admin/ManageCategories";

import {
  getDashboardStats,
  getDashboardAnalytics,
} from "../services/adminDashboardService";



const actions = [
  {
    title: "Manage Places",
    icon: MapPinned,
    path: "/admin/manage-places",
    description: "Add, edit and remove heritage places.",
    color: "from-blue-500/20 to-cyan-500/10",
    badge: "Places",
  },
  {
    title: "Manage Stories",
    icon: BookOpen,
    path: "/admin/manage-stories",
    description: "Manage stories and chapters.",
    color: "from-purple-500/20 to-pink-500/10",
    badge: "Stories",
  },
  {
    title: "Manage Categories",
    icon: Layers3,
    description: "Create, edit and organize categories.",
    color: "from-yellow-500/20 to-orange-500/10",
    badge: "Categories",
  },
  {
    title: "User Management",
    icon: Users,
    path: "/admin/users",
    description: "View users and manage their accounts.",
    color: "from-green-500/20 to-emerald-500/10",
    badge: "Users",
  },
  {
    title: "AI Story Generator",
    icon: Sparkles,
    path: "/admin/ai-story-generator",
    description: "Generate heritage stories using AI.",
    color: "from-pink-500/20 to-violet-500/10",
    badge: "AI",
  },
];
const AdminDashboard = () => {

  // ==========================================
  // States
  // ==========================================

  const [showCategoryModal, setShowCategoryModal] =
    useState(false);

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState([]);

  const [analytics, setAnalytics] = useState({
    mostSavedPlaces: [],
    mostReadStories: [],
    recentUsers: [],
  });

  const [error, setError] = useState("");

  // ==========================================
  // Dashboard Data
  // ==========================================

  const loadDashboard = async () => {

    try {

      setLoading(true);

      const [statsRes, analyticsRes] =
        await Promise.all([
          getDashboardStats(),
          getDashboardAnalytics(),
        ]);

      // ==========================
      // Statistics
      // ==========================

      const statistics =
        statsRes.statistics || statsRes.data?.statistics;

      setStats([
        {
          title: "Heritage Places",
          value: statistics.totalPlaces,
          icon: MapPinned,
        },
        {
          title: "Stories",
          value: statistics.totalStories,
          icon: BookOpen,
        },
        {
          title: "Categories",
          value: statistics.totalCategories,
          icon: Layers3,
        },
        {
          title: "Users",
          value: statistics.totalUsers,
          icon: Users,
        },
      ]);

      // ==========================
      // Analytics
      // ==========================

      const analyticsData =
        analyticsRes.analytics || analyticsRes.data?.analytics;

      setAnalytics({
        mostSavedPlaces:
          analyticsData?.mostSavedPlaces || [],

        mostReadStories:
          analyticsData?.mostReadStories || [],

        recentUsers:
          analyticsData?.recentUsers || [],
      });

      setError("");

    } catch (err) {

      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to load dashboard."
      );

    } finally {

      setLoading(false);

    }

  };

  // ==========================================
  // Load Dashboard
  // ==========================================

  useEffect(() => {

    loadDashboard();

  }, []);

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        <div className="text-center">

          <div
            className="
            h-14
            w-14
            rounded-full
            border-4
            border-heritage-gold
            border-t-transparent
            animate-spin
            mx-auto
            "
          />

          <p className="text-white mt-5">
            Loading Dashboard...
          </p>

        </div>

      </div>

    );

  }

  // ==========================================
  // Error
  // ==========================================

  if (error) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        <div
          className="
          bg-red-500/10
          border
          border-red-500/30
          rounded-2xl
          p-8
          text-center
          "
        >

          <h2 className="text-red-400 text-2xl font-bold">
            Error
          </h2>

          <p className="text-gray-300 mt-3">
            {error}
          </p>

          <button
            onClick={loadDashboard}
            className="
            mt-6
            px-6
            py-3
            rounded-xl
            bg-heritage-gold
            text-black
            font-semibold
            "
          >
            Retry
          </button>

        </div>

      </div>

    );

  }

return (
  <div className="min-h-screen p-8  px-6">

    {/* ==========================
        Back Button
    ========================== */}

    <Link
      to="/"
      className="
      inline-flex
      items-center
      gap-2
      px-4
      py-2
      mb-8
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
      Back to Home
    </Link>

    <div className="max-w-7xl mx-auto">

      {/* ==========================
          Header
      ========================== */}

      <div className="mb-12">

        <span
          className="
          inline-flex
          items-center
          gap-2
          px-4
          py-2
          rounded-full
          bg-heritage-gold/10
          border
          border-heritage-gold/20
          text-heritage-gold
          text-sm
          "
        >
          <Landmark size={16} />
          HeritageSphere Admin
        </span>

        <h1 className="text-5xl font-bold text-white mt-5">
          Dashboard
        </h1>

        <p className="text-gray-400 mt-3">
          Welcome back! Manage places, stories,
          categories and monitor platform activity.
        </p>

      </div>

      {/* ==========================
          Main Layout
      ========================== */}

      <div className="grid lg:grid-cols-[280px_1fr] gap-6">

        {/* ==========================
            Left Sidebar
        ========================== */}

        <div
          className="
          bg-white/5
          backdrop-blur-xl
          border
          border-white/10
          rounded-3xl
          p-6
          h-fit
          sticky
          top-28
          "
        >

          <div className="flex flex-col items-center">

            <div
              className="
              h-24
              w-24
              rounded-full
              border-2
              border-heritage-gold
              p-1
              "
            >
              <img
                src="/admin.jpg"
                alt="Admin"
                className="
                h-full
                w-full
                rounded-full
                object-cover
                "
              />
            </div>

            <h2 className="mt-4 text-xl font-semibold text-white">
              Admin User
            </h2>

            <p className="text-gray-400 text-sm">
              Super Administrator
            </p>

            <div className="mt-3 flex items-center gap-2">

              <span className="h-3 w-3 rounded-full bg-green-500"></span>

              <span className="text-green-400 text-sm">
                Online
              </span>

            </div>

          </div>

          {/* ==========================
              Dashboard Summary
          ========================== */}

          <div
            className="
            mt-8
            rounded-2xl
            border
            border-heritage-gold/20
            bg-heritage-gold/5
            p-5
            "
          >

            <p className="text-gray-400 text-sm">
              Platform Overview
            </p>

            <h2 className="text-4xl font-bold text-heritage-gold mt-2">
              {stats.reduce(
                (sum, item) => sum + Number(item.value),
                0
              )}
            </h2>

            <p className="text-gray-300 mt-2 text-sm">
              Total records available across the
              HeritageSphere platform.
            </p>

            <div className="mt-5 flex items-center gap-2 text-green-400">

              <TrendingUp size={18} />

              <span className="text-sm">
                Dashboard Connected Successfully
              </span>

            </div>

          </div>

        </div>

        {/* ==========================
            Right Side
        ========================== */}

        <div>

          {/* ==========================
              Statistics Cards
          ========================== */}

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">

            {stats.map((item) => {

              const Icon = item.icon;

              return (

                <div
                  key={item.title}
                  className="
                  bg-white/5
                  backdrop-blur-xl
                  border
                  border-white/10
                  rounded-3xl
                  p-6
                  hover:border-heritage-gold
                  transition-all
                  duration-300
                  "
                >

                  <div className="flex justify-between">

                    <div>

                      <p className="text-gray-400">
                        {item.title}
                      </p>

                      <h2 className="text-4xl font-bold text-white mt-2">

                        {Number(item.value).toLocaleString()}

                      </h2>

                    </div>

                    <div
                      className="
                      h-14
                      w-14
                      rounded-2xl
                      bg-heritage-gold/10
                      flex
                      items-center
                      justify-center
                      "
                    >

                      <Icon
                        size={24}
                        className="text-heritage-gold"
                      />

                    </div>

                  </div>

                </div>

              );

            })}

          </div>

          {/* ==========================
              Recent Users
          ========================== */}

          <div
            className="
            mt-6
            bg-white/5
            backdrop-blur-xl
            border
            border-white/10
            rounded-3xl
            p-5
            "
          >

            <div className="flex items-center gap-2 mb-6">

              <Users
                size={22}
                className="text-heritage-gold"
              />

              <h2 className="text-2xl font-semibold text-white">
                Recent Users
              </h2>

            </div>

            <div className="space-y-4">

              {analytics.recentUsers.length === 0 ? (

                <p className="text-gray-400">
                  No users found.
                </p>

              ) : (

                analytics.recentUsers.map((user) => (

                  <div
                    key={user.user_id}
                    className="
                    flex
                    justify-between
                    items-center
                    bg-white/5
                    rounded-2xl
                    p-4
                    "
                  >

                    <div>

                      <h3 className="text-white font-semibold">
                        {user.name}
                      </h3>

                      <p className="text-gray-400 text-sm">
                        {user.email}
                      </p>

                    </div>

                    <div className="text-right">

                      <p className="text-gray-300 text-sm">
                        {user.city}, {user.state}
                      </p>

                      <span className="text-xs text-gray-500">
                        {new Date(
                          user.created_at
                        ).toLocaleDateString()}
                      </span>

                    </div>

                  </div>

                ))

              )}

            </div>

          </div>

       {/* ==========================================
    Most Saved Places
========================================== */}

<div
  className="
  mt-6
  bg-white/5
  backdrop-blur-xl
  border
  border-white/10
  rounded-3xl
  p-5
  "
>

  <div className="flex items-center gap-2 mb-6">

    <Heart
      size={22}
      className="text-heritage-gold"
    />

    <h2 className="text-2xl font-semibold text-white">
      Most Saved Places
    </h2>

  </div>

  <div className="space-y-4">

    {analytics.mostSavedPlaces.length === 0 ? (

      <p className="text-gray-400">
        No saved places found.
      </p>

    ) : (

      analytics.mostSavedPlaces.map((place) => (

        <div
          key={place.place_id}
          className="
          flex
          items-center
          justify-between
          rounded-2xl
          bg-white/5
          border
          border-white/10
          p-4
          hover:border-heritage-gold/30
          transition
          "
        >

          <div className="flex items-center gap-4">

            <img
              src={
                place.image_url ||
                "/placeholder-place.jpg"
              }
              alt={place.name}
              className="
              w-16
              h-16
              rounded-xl
              object-cover
              "
            />

            <div>

              <h3 className="text-white font-semibold">
                {place.name}
              </h3>

              <p className="text-sm text-gray-400">
                {place.city}, {place.state}
              </p>

            </div>

          </div>

          <div
            className="
            flex
            items-center
            gap-2
            text-red-400
            font-semibold
            "
          >

            <Heart size={18} fill="currentColor" />

            {place.total_saves}

          </div>

        </div>

      ))

    )}

  </div>

</div>

{/* ==========================================
    Most Read Stories
========================================== */}

<div
  className="
  mt-6
  bg-white/5
  backdrop-blur-xl
  border
  border-white/10
  rounded-3xl
  p-5
  "
>

  <div className="flex items-center gap-2 mb-6">

    <BookOpen
      size={22}
      className="text-heritage-gold"
    />

    <h2 className="text-2xl font-semibold text-white">
      Latest Stories
    </h2>

  </div>

  <div className="space-y-4">

    {analytics.mostReadStories.length === 0 ? (

      <p className="text-gray-400">
        No stories available.
      </p>

    ) : (

      analytics.mostReadStories.map((story) => (

        <div
          key={story.story_id}
          className="
          flex
          items-center
          justify-between
          rounded-2xl
          bg-white/5
          border
          border-white/10
          p-4
          hover:border-heritage-gold/30
          transition
          "
        >

          <div className="flex items-center gap-4">

            <img
              src={
                story.cover_image ||
                "/placeholder-story.jpg"
              }
              alt={story.title}
              className="
              h-16
              w-16
              rounded-xl
              object-cover
              "
            />

            <div>

              <h3 className="text-white font-semibold">
                {story.title}
              </h3>

              <p className="text-gray-400 text-sm">
                {story.total_chapters} Chapters
              </p>

            </div>

          </div>

          <div className="text-right">

            <span
              className="
              text-xs
              text-gray-500
              "
            >

              {new Date(
                story.created_at
              ).toLocaleDateString()}

            </span>

          </div>

        </div>

      ))

    )}

  </div>

</div>

{/* ==========================================
    Quick Actions
========================================== */}

<div className="mt-14">

  <div className="flex items-center justify-between mb-8">

    <div>

      <h2 className="text-3xl font-bold text-white">
        Quick Actions
      </h2>

      <p className="text-gray-400 mt-1">
        Manage your HeritageSphere platform.
      </p>

    </div>

  </div>

  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">

    {actions.map((action) =>

      action.title === "Manage Categories" ? (

        <button
          key={action.title}
          onClick={() => setShowCategoryModal(true)}
          className="
          group
          text-left
          rounded-3xl
          border
          border-white/10
          bg-linear-to-br
          bg-white/5
          backdrop-blur-xl
          p-6
          hover:border-heritage-gold
          hover:-translate-y-2
          hover:shadow-2xl
          hover:shadow-heritage-gold/10
          transition-all
          duration-300
          h-full
          "
        >

          <div className="flex items-center justify-between">

            <span
              className="
              px-3
              py-1
              rounded-full
              text-xs
              bg-heritage-gold/10
              text-heritage-gold
              "
            >
              {action.badge}
            </span>

            <div
              className="
              h-14
              w-14
              rounded-2xl
              bg-heritage-gold/10
              flex
              items-center
              justify-center
              "
            >
              <action.icon
                size={28}
                className="text-heritage-gold"
              />
            </div>

          </div>

          <h3 className="text-xl font-semibold text-white mt-6">
            {action.title}
          </h3>

          <p className="text-gray-400 mt-3 text-sm leading-6">
            {action.description}
          </p>

          <div
            className="
            mt-8
            flex
            items-center
            gap-2
            text-heritage-gold
            font-medium
            group-hover:gap-3
            transition-all
            "
          >

            Open

            <ArrowRight size={18} />

          </div>

        </button>

      ) : (

        <Link
          key={action.title}
          to={action.path}
          className="
          group
          text-left
          rounded-3xl
          border
          border-white/10
          bg-white/5
          backdrop-blur-xl
          p-6
          hover:border-heritage-gold
          hover:-translate-y-2
          hover:shadow-2xl
          hover:shadow-heritage-gold/10
          transition-all
          duration-300
          h-full
          "
        >

          <div className="flex items-center justify-between">

            <span
              className="
              px-3
              py-1
              rounded-full
              text-xs
              bg-heritage-gold/10
              text-heritage-gold
              "
            >
              {action.badge}
            </span>

            <div
              className="
              h-14
              w-14
              rounded-2xl
              bg-heritage-gold/10
              flex
              items-center
              justify-center
              "
            >

              <action.icon
                size={28}
                className="text-heritage-gold"
              />

            </div>

          </div>

          <h3 className="text-xl font-semibold text-white mt-6">
            {action.title}
          </h3>

          <p className="text-gray-400 mt-3 text-sm leading-6">
            {action.description}
          </p>

          <div
            className="
            mt-8
            flex
            items-center
            gap-2
            text-heritage-gold
            font-medium
            group-hover:gap-3
            transition-all
            "
          >

            Open

            <ArrowRight size={18} />

          </div>

        </Link>

      )

    )}

  </div>

</div>


        </div>
        {/* End Right Side */}

      </div>
      {/* End Main Layout */}

      {/* ==========================================
          Category Modal
      ========================================== */}

      {showCategoryModal && (
        <ManageCategories
          onClose={() => setShowCategoryModal(false)}
        />
      )}

    </div>
  </div>
);

};

export default AdminDashboard;