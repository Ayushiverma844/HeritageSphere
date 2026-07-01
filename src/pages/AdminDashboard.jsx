import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import {
  MapPinned,
  BookOpen,
  Users,
  Layers3,
  Sparkles,
  Plus,
  Clock3,
  Landmark,
} from "lucide-react";


const stats = [
  {
    title: "Heritage Places",
    value: "1250",
    icon: MapPinned,
  },
  {
    title: "Stories",
    value: "850",
    icon: BookOpen,
  },
  {
    title: "Categories",
    value: "48",
    icon: Layers3,
  },
  {
    title: "Users",
    value: "12.5K",
    icon: Users,
  },
];

const actions = [
  {
    title: "Manage Places",
    icon: MapPinned,
    path : "/admin/manage-places",
  },
  {
    title: "Manage Stories",
    icon: BookOpen,
    path : "/admin/manage-stories"
  },
  {
    title: "Manage Categories",
    icon: Layers3,
    path : "/admin/manage-categories"
  },
  {
    title: "Manage Users",
    icon: Users,
    path : "/admin/manage-users"
  },
  {
    title: "AI Story Generator",
    icon: Sparkles,
    path : "/admin/ai-story-generator"
  },
];

const activities = [
  "New Place Added - Hampi",
  "Story Updated - Ramayana",
  "New User Registered",
  "Category Added - Temples",
  "Story Published - Mahabharata",
];
const approvals = [
  {
    type: "Place",
    title: "Amer Fort",
  },
  {
    type: "Story",
    title: "The Legend of Krishna",
  },
  {
    type: "Place",
    title: "Golconda Fort",
  },
];

const AdminDashboard = () => {
  return (
    <div className="min-h-screen pt-12 px-6">
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

        {/* Header */}

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
            Manage places, stories, categories and users.
          </p>
        </div>

        {/* Top Grid */}

        <div className="grid lg:grid-cols-[280px_1fr] gap-6">

          {/* Left Panel */}

          <div
            className="
            bg-white/5
            backdrop-blur-xl
            border border-white/10
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
                  alt=""
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

            {/* Progress */}

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
                Heritage Coverage
              </p>

              <h2 className="text-4xl font-bold text-heritage-gold mt-3">
                68%
              </h2>

              <p className="text-gray-300 text-sm mt-2">
                Cultural heritage data added to platform.
              </p>

              <div className="mt-4 h-3 rounded-full bg-white/10">
                <div
                  className="
                  h-full
                  rounded-full
                  bg-heritage-gold
                  "
                  style={{ width: "68%" }}
                />
              </div>

            </div>

          </div>

          {/* Right Content */}

          <div>

            {/* Stats */}

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">

              {stats.map((item) => (
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
                        {item.value}
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
                      <item.icon
                        size={24}
                        className="text-heritage-gold"
                      />
                    </div>

                  </div>

                </div>
              ))}

            </div>

            {/* Recent Activity */}

            <div
              className="
              mt-6
              bg-white/5
              backdrop-blur-xl
              border border-white/10
              rounded-3xl
              p-6
              "
            >

              <h2 className="text-2xl font-semibold text-white mb-6">
                Recent Activity
              </h2>

              <div className="space-y-5">

                {activities.map((activity, index) => (
                  <div
                    key={index}
                    className="
                    flex
                    items-start
                    gap-3
                    "
                  >

                    <div
                      className="
                      h-9
                      w-9
                      rounded-full
                      bg-heritage-gold/10
                      flex
                      items-center
                      justify-center
                      "
                    >
                      <Clock3
                        size={16}
                        className="text-heritage-gold"
                      />
                    </div>

                    <div>

                      <p className="text-gray-300">
                        {activity}
                      </p>

                      <span className="text-xs text-gray-500">
                        Just now
                      </span>

                    </div>

                  </div>
                ))}

              </div>

            </div>

            <div
  className="
  mt-6
  bg-white/5
  backdrop-blur-xl
  border
  border-white/10
  rounded-3xl
  p-6
  "
>
  <h2 className="text-2xl font-semibold text-white mb-6">
    Pending Approvals
  </h2>

  <div className="space-y-4">

    {approvals.map((item, index) => (
      <div
        key={index}
        className="
        flex
        items-center
        justify-between
        p-4
        rounded-2xl
        bg-white/5
        border
        border-white/5
        "
      >
        <div>

          <span
            className="
            text-xs
            px-2
            py-1
            rounded-full
            bg-heritage-gold/10
            text-heritage-gold
            "
          >
            {item.type}
          </span>

          <h3 className="text-white mt-2">
            {item.title}
          </h3>

        </div>

        <div className="flex gap-2">

          <button
            className="
            px-4
            py-2
            rounded-xl
            bg-green-500/20
            text-green-400
            hover:bg-green-500/30
            transition-all
            "
          >
            Approve
          </button>

          <button
            className="
            px-4
            py-2
            rounded-xl
            bg-red-500/20
            text-red-400
            hover:bg-red-500/30
            transition-all
            "
          >
            Reject
          </button>

        </div>

      </div>
    ))}

  </div>
</div>

          </div>

        </div>

        {/* Quick Actions */}

        <div className="mt-12">

          <h2 className="text-3xl font-semibold text-white mb-6">
            Quick Actions
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

            {actions.map((action) => (
  <Link
    key={action.title}
    to={action.path}
    className="
    block
    text-left
    bg-white/5
    border border-white/10
    rounded-3xl
    p-6
    hover:border-heritage-gold
    hover:-translate-y-1
    transition-all
    duration-300
    "
  >

                <action.icon
                  size={28}
                  className="text-heritage-gold mb-4"
                />

                <h3 className="text-lg text-white font-medium">
                  {action.title}
                </h3>

                <div className="mt-5 flex items-center gap-2 text-heritage-gold">
                  <Plus size={16} />
                  Open
                </div>

              </Link>
            ))}

          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;