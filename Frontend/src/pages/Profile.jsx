import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  MapPin,
  Calendar,
  Pencil,
  ArrowLeft,
  BookOpen,
  Landmark,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import img from "../assests/1.jpg";

import profileService from "../services/profileService";




const Profile = () => {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [user, setUser] = useState({});

  const [stats, setStats] = useState({
    totalCollection: 0,
    savedPlaces: 0,
    savedStories: 0,
  });

  const [formData, setFormData] = useState({
    name: "",
    mobile_number: "",
    date_of_birth: "",
    city: "",
    state: "",
    country: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {

    try {

      setLoading(true);

      const data = await profileService.getProfile();

      setUser(data.user);

      setStats(data.stats);

      setFormData({

        name: data.user.name || "",

        mobile_number:
          data.user.mobile_number || "",

        date_of_birth:
          data.user.date_of_birth
            ? data.user.date_of_birth.slice(0, 10)
            : "",

        city: data.user.city || "",

        state: data.user.state || "",

        country: data.user.country || "",

      });

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value,

    });

  };

  const handleSave = async () => {

    try {

      const data = await profileService.updateProfile(
        formData
      );

      setUser(data.user);

      setShowModal(false);

    } catch (err) {

      console.log(err);

      alert("Unable to update profile");

    }

  };

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center text-white">

        Loading Profile...

      </div>

    );

  }

  return (

    <div className="min-h-screen text-white px-4 md:px-10 py-10">

      {/* Back Button */}

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

      {/* Header */}

      <div className="flex flex-col items-center">

        <img

          src={
            user.profile_image
              ? `http://localhost:5000/uploads/${user.profile_image}`
              : img
          }

          alt={user.name}

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

          {user.name}

        </h1>

        <p className="mt-2 text-gray-400 capitalize">

          {user.role}

        </p>

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

      {/* Stats */}

      <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto mt-12">

        
        {/* total collection */}

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

            {stats.totalCollection}

          </h2>

          <p className="text-gray-300 mt-1">

            Collection

          </p>

        </div>

        {/* places */}
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

            {stats.savedPlaces}

          </h2>

          <p className="text-gray-300 mt-1">

            Places

          </p>

        </div>
        {/* stories */}

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

            {stats.savedStories}

          </h2>

          <p className="text-gray-300 mt-1">

            Stories

          </p>

        </div>

      </div>

      {/* Cards */}

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

              <span>{user.name}</span>

            </div>

            <div className="flex items-center gap-3">

              <Mail size={18} />

              <span>{user.email}</span>

            </div>

            <div className="flex items-center gap-3">

              <MapPin size={18} />

              <span>

                {[
                  user.city,
                  user.state,
                  user.country,
                ]
                  .filter(Boolean)
                  .join(", ") || "Not Provided"}

              </span>

            </div>

            <div className="flex items-center gap-3">

              <Calendar size={18} />

              <span>

                {user.date_of_birth || "Not Provided"}

              </span>

            </div>

          </div>

        </div>

        {/* Account Overview */}

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

            Account Overview

          </h2>

          <div className="space-y-5">

            <div className="flex items-center gap-3">

              <Landmark size={18} />

              <span>

                Saved Heritage Places :
                {" "}
                <span className="text-heritage-gold">

                  {stats.savedPlaces}

                </span>

              </span>

            </div>

            <div className="flex items-center gap-3">

              <BookOpen size={18} />

              <span>

                Saved Stories :
                {" "}
                <span className="text-heritage-gold">

                  {stats.savedStories}

                </span>

              </span>

            </div>

            <div className="flex items-center gap-3">

              <User size={18} />

              <span>

                Total Collection :
                {" "}
                <span className="text-heritage-gold">

                  {stats.totalCollection}

                </span>

              </span>

            </div>

            <div className="flex items-center gap-3">

              <Calendar size={18} />

              <span>

                Joined{" "}

                {new Date(user.created_at)
                  .toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                  })}

              </span>

            </div>

          </div>

        </div>

      </div>

      {/* ================= Edit Modal ================= */}

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
          onClick={() => setShowModal(false)}
        >

          <div
  onClick={(e) => e.stopPropagation()}
  className="
    w-full
    max-w-xl
    max-h-[90vh]
    overflow-y-auto
    bg-heritage-dark
    border
    border-heritage-gold/30
    rounded-3xl
    p-6
    shadow-xl
    scrollbar-none 
    
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

            <div className="space-y-4">

              <div>

                <label className="block mb-2">

                  Name

                </label>

                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
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

              <div>

                <label className="block mb-2">

                  Mobile Number

                </label>

                <input
                  name="mobile_number"
                  value={formData.mobile_number}
                  onChange={handleChange}
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

              <div>

                <label className="block mb-2">

                  Date Of Birth

                </label>

                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
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
                            <div>

                <label className="block mb-2">

                  City

                </label>

                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
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

              <div>

                <label className="block mb-2">

                  State

                </label>

                <input
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
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

              <div>

                <label className="block mb-2">

                  Country

                </label>

                <input
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
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

              {/* Email (Read Only) */}

              <div>

                <label className="block mb-2">

                  Email

                </label>

                <input
                  value={user.email || ""}
                  readOnly
                  className="
                  w-full
                  px-4
                  py-3
                  rounded-xl
                  bg-white/10
                  border
                  border-white/10
                  text-gray-400
                  cursor-not-allowed
                  "
                />

              </div>

            </div>

            {/* Buttons */}

            <div className="flex gap-3 mt-8">

              <button

                onClick={() => setShowModal(false)}

                className="
                flex-1
                py-3
                rounded-xl
                border
                border-heritage-gold
                text-heritage-gold
                hover:bg-white/5
                transition-all
                "

              >

                Cancel

              </button>

              <button

                onClick={handleSave}

                className="
                flex-1
                py-3
                rounded-xl
                bg-heritage-gold
                text-black
                font-semibold
                hover:scale-105
                transition-all
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
    
      