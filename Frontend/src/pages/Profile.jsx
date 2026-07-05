import React from "react";
import {useState} from "react"
import {
  User,
  Mail,
  MapPin,
  Calendar,
  Pencil,
} from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import img from "../assests/1.jpg"

const Profile = () => {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
  return (
    
    <div className="min-h-screen text-white px-4 md:px-10 py-10">

       <div className="mb-8">
  <button
    onClick={() => navigate("/")}
    className="
      flex
      items-center
      gap-2
      px-4
      py-2
      rounded-xl
      border
      border-heritage-gold/30
      bg-white/5
      text-heritage-gold
      hover:bg-heritage-gold
      hover:text-black
      transition-all
      duration-300
    "
  >
    <ArrowLeft size={18} />
    Back to Home
  </button>
</div>

      {/* Profile Header */}
      <div className="flex flex-col items-center">

        <img
          src={img}
          alt="Profile"
          className="
            w-60
            h-60
            rounded-full
            object-cover
            border-4
            border-heritage-gold
            shadow-[0_0_25px_rgba(212,175,55,0.3)]
          "
        />

        <h1 className="text-3xl md:text-4xl font-bold mt-5">
          Ayushi Verma
        </h1>

       

        <button
  onClick={() => setShowModal(true)}
  className="
    flex
    items-center
    gap-2
    mt-5
    px-5
    py-2.5
    rounded-xl
    bg-heritage-gold
    text-black
    font-semibold
    hover:scale-105
    transition
  "
>
  <Pencil size={18} />
  Edit Profile
</button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto mt-12">

        <div
          className="
            backdrop-blur-md
            bg-white/5
            border
            border-heritage-gold/20
            rounded-2xl
            p-5
            text-center
          "
        >
          <h2 className="text-3xl font-bold text-heritage-gold">
            12
          </h2>

          <p className="text-gray-300 mt-1">
            Visited
          </p>
        </div>

        <div
          className="
            backdrop-blur-md
            bg-white/5
            border
            border-heritage-gold/20
            rounded-2xl
            p-5
            text-center
          "
        >
          <h2 className="text-3xl font-bold text-heritage-gold">
            34
          </h2>

          <p className="text-gray-300 mt-1">
            Collection
          </p>
        </div>

        <div
          className="
            backdrop-blur-md
            bg-white/5
            border
            border-heritage-gold/20
            rounded-2xl
            p-5
            text-center
          "
        >
          <h2 className="text-3xl font-bold text-heritage-gold">
            8
          </h2>

          <p className="text-gray-300 mt-1">
            Saved
          </p>
        </div>

      </div>

      {/* Cards Section */}
      <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto mt-10">

        {/* Personal Information */}
        <div
          className="
            backdrop-blur-md
            bg-white/5
            border
            border-heritage-gold/20
            rounded-3xl
            p-6
          "
        >
          <h2 className="text-2xl font-semibold text-heritage-gold mb-6">
            Personal Information
          </h2>

          <div className="space-y-5">

            <div className="flex items-center gap-3">
              <User size={18} />
              <span>Ayushi Verma</span>
            </div>

            <div className="flex items-center gap-3">
              <Mail size={18} />
              <span>ayushi@gmail.com</span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin size={18} />
              <span>Bhopal, India</span>
            </div>

            <div className="flex items-center gap-3">
              <Calendar size={18} />
              <span>Joined January 2025</span>
            </div>

          </div>
        </div>

        {/* Favorite Categories */}
        <div
          className="
            backdrop-blur-md
            bg-white/5
            border
            border-heritage-gold/20
            rounded-3xl
            p-6
          "
        >
          <h2 className="text-2xl font-semibold text-heritage-gold mb-6">
            Favorite Categories
          </h2>

          <div className="flex flex-wrap gap-3">

            {[
              "Temples",
              "Forts",
              "Palaces",
              "Museums",
              "Nature",
            ].map((item) => (
              <span
                key={item}
                className="
                  px-4
                  py-2
                  rounded-full
                  border
                  border-heritage-gold
                  text-heritage-gold
                  hover:bg-heritage-gold
                  hover:text-black
                  transition
                  cursor-pointer
                "
              >
                {item}
              </span>
            ))}

          </div>
        </div>

      </div>
      {showModal && (
  <div
    className="
      fixed
      inset-0
      bg-black/60
      backdrop-blur-sm
      flex
      items-center
      justify-center
      z-50
      p-4
    "
  >
    <div
      className="
        w-full
        max-w-md
        bg-heritage-dark
        border
        border-heritage-gold/30
        rounded-3xl
        p-6
        shadow-xl
      "
    >
      <h2
        className="
          text-2xl
          font-bold
          text-center
          text-heritage-gold
          mb-6
        "
      >
        Edit Profile
      </h2>

      {/* Profile Picture */}

      <div className="flex flex-col items-center mb-6">

        <img
          src={img}
          alt="Profile"
          className="
            w-24
            h-24
            rounded-full
            object-cover
            border-2
            border-heritage-gold
          "
        />

        <button
          className="
            mt-3
            text-sm
            text-heritage-gold
          "
        >
          Change Photo
        </button>

      </div>

      {/* Name */}

      <div className="mb-4">

        <label className="block mb-2 text-sm">
          Name
        </label>

        <input
          type="text"
          defaultValue="Ayushi Verma"
          className="
            w-full
            px-4
            py-3
            rounded-xl
            bg-white/5
            border
            border-heritage-gold/20
            outline-none
            focus:border-heritage-gold
          "
        />

      </div>

      {/* Email */}

      <div className="mb-4">

        <label className="block mb-2 text-sm">
          Email
        </label>

        <input
          type="email"
          defaultValue="ayushi@gmail.com"
          className="
            w-full
            px-4
            py-3
            rounded-xl
            bg-white/5
            border
            border-heritage-gold/20
            outline-none
            focus:border-heritage-gold
          "
        />

      </div>

      {/* Password */}

      <div className="mb-4">

        <label className="block mb-2 text-sm">
          Password
        </label>

        <input
          type="password"
          placeholder="Enter new password"
          className="
            w-full
            px-4
            py-3
            rounded-xl
            bg-white/5
            border
            border-heritage-gold/20
            outline-none
            focus:border-heritage-gold
          "
        />

      </div>

      {/* Confirm Password */}

      <div className="mb-6">

        <label className="block mb-2 text-sm">
          Confirm Password
        </label>

        <input
          type="password"
          placeholder="Confirm password"
          className="
            w-full
            px-4
            py-3
            rounded-xl
            bg-white/5
            border
            border-heritage-gold/20
            outline-none
            focus:border-heritage-gold
          "
        />

      </div>

      {/* Buttons */}

      <div className="flex gap-3">

        <button
          onClick={() => setShowModal(false)}
          className="
            flex-1
            py-3
            rounded-xl
            border
            border-heritage-gold
            text-heritage-gold
          "
        >
          Cancel
        </button>

        <button
          className="
            flex-1
            py-3
            rounded-xl
            bg-heritage-gold
            text-black
            font-semibold
          "
        >
          Save Changes
        </button>

      </div>

    </div>
  </div>
)}

    </div>
  );
};

export default Profile;