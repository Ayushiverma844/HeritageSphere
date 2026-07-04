// both login and signup page

import { useState } from "react";
import {
  Mail,
  Lock,
  User,
  Eye,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import img from "../assests/auth_bg.jpg";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#050816] text-white flex">

      {/* Left Image */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden">
        <img
          src={img}
          alt=""
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute bottom-16 left-12 max-w-lg">
          <span className="px-4 py-2 rounded-full border border-heritage-gold/30 text-heritage-gold text-sm">
            India's Heritage Platform
          </span>

          <h1 className="mt-6 text-5xl font-bold leading-tight">
            Discover the stories
            <br />
            <span className="text-heritage-gold">
              of a civilization
            </span>
          </h1>

          <p className="mt-4 text-gray-300">
            Join thousands of explorers who uncover India's timeless heritage.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex justify-center items-center p-6">
        <div className="w-full max-w-xl">

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-heritage-gold transition"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>

          {/* Logo */}
          <div className="flex items-center gap-3 mt-8">
            <div className="h-12 w-12 rounded-full  flex items-center justify-center">
              <img src="Logo.png" alt="" className="object-cover" />
            </div>

            <h2 className="text-3xl font-bold">
              Heritage
              <span className="text-heritage-gold">Sphere</span>
            </h2>
          </div>

          {/* Heading */}
          <div className="mt-10">
            <h1 className="text-5xl font-bold">
              {isLogin ? "Welcome back" : "Create an account"}
            </h1>

            <p className="text-gray-400 mt-3 text-lg">
              {isLogin
                ? "Sign in to continue your heritage journey"
                : "Join the HeritageSphere community today"}
            </p>
          </div>

          {/* Toggle */}
          <div className="mt-10 relative bg-white/5 border border-white/10 rounded-2xl p-1 flex overflow-hidden">

  {/* Sliding Gold Background */}
  <div
    className={`
      absolute top-1 bottom-1 w-[calc(50%-4px)]
      rounded-xl bg-heritage-gold
      transition-all duration-500 ease-in-out
      ${isLogin ? "left-1" : "left-[calc(50%+2px)]"}
    `}
  />

  {/* Login Button */}
  <button
    onClick={() => setIsLogin(true)}
    className={`
      relative z-10 w-1/2 py-3 text-lg font-medium
      transition-all duration-300
      ${isLogin ? "text-black" : "text-gray-400"}
    `}
  >
    Login
  </button>

  {/* Signup Button */}
  <button
    onClick={() => setIsLogin(false)}
    className={`
      relative z-10 w-1/2 py-3 text-lg font-medium
      transition-all duration-300
      ${!isLogin ? "text-black" : "text-gray-400"}
    `}
  >
    Sign Up
  </button>

</div>
          {/* Animated Form */}
          <form
            key={isLogin ? "login" : "signup"}
            className="
mt-8
animate-[fadeIn_.5s_ease]
transition-all
duration-500
"
          >

            {!isLogin && (
              <div className="mb-5">
                <label className="text-gray-400 block mb-2">
                  Full Name
                </label>

                <div className="
flex items-center gap-3
bg-white/5
border border-white/10
rounded-2xl
px-4 py-4
transition-all duration-300
hover:border-heritage-gold/40
focus-within:border-heritage-gold
focus-within:shadow-[0_0_20px_rgba(212,175,55,0.15)]
">
                  <User size={20} />
                  <input
                    type="text"
                    placeholder="Your full name"
                    className="bg-transparent outline-none w-full"
                  />
                </div>
              </div>
            )}

            

            <div className="mb-5">
              <label className="text-gray-400 block mb-2">
                Email Address
              </label>

              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-4">
                <Mail size={20} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="bg-transparent outline-none w-full"
                />
              </div>
            </div>

           
            <div className="mb-5">
  <label className="text-gray-400 block mb-2">
    Password
  </label>

  <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-4">
    <Lock size={20} />

    <input
      type={showPassword ? "text" : "password"}
      placeholder="At least 6 characters"
      className="bg-transparent outline-none w-full"
    />

    <Eye
      size={18}
      onClick={() => setShowPassword(!showPassword)}
      className="cursor-pointer"
    />
  </div>
  {isLogin && (
  <div className="text-right mb-5 mt-2">
    <button className="text-heritage-gold hover:underline">
      Forgot Password?
    </button>
  </div>
)}
</div>

{!isLogin && (
  <div className="mb-5">
    <label className="text-gray-400 block mb-2">
      Confirm Password
    </label>

    <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-4">
      <Lock size={20} />

      <input
        type={showPassword ? "text" : "password"}
        placeholder="Confirm password"
        className="bg-transparent outline-none w-full"
      />

      <Eye
        size={18}
        onClick={() => setShowPassword(!showPassword)}
        className="cursor-pointer"
      />
    </div>
  </div>
)}

            <button
              className="
                w-full py-4 rounded-2xl
                bg-heritage-gold
                text-black font-semibold text-lg
                hover:bg-heritage-light-gold
                hover:scale-[1.02]
                transition-all duration-300
              "
            >
              {isLogin ? "Login" : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;