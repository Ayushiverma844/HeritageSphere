import React, { useState } from "react";
import { Link } from "react-router-dom";
import Explore from "../pages/Explore"
import {
  Search,
  User,
  House,
  Compass,
  BookOpenText,
  Heart,
  Menu,
  X,
} from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 z-50 w-full bg-heritage-dark/40 backdrop-blur-xl border-b border-heritage-gold/10">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group min-w-0">
          <img
            src="/Logo.png"
            alt="logo"
            className="h-12 w-12 md:h-14 md:w-14 object-contain transition-transform duration-500 group-hover:rotate-12"
          />

          <h1 className="text-lg md:text-xl font-bold text-white whitespace-nowrap">
  Heritage
  <span className="text-heritage-gold">Sphere</span>
</h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-300 hover:text-heritage-gold transition-all duration-300 hover:-translate-y-1"
          >
            <House size={18} />
            Home
          </Link>

          <Link
            to="Explore"
            className="flex items-center gap-2 text-gray-300 hover:text-heritage-gold transition-all duration-300 hover:-translate-y-1"
          >
            <Compass size={18} />
            Explore Places
          </Link>

          <Link
            to="/knowledgehub"
            className="flex items-center gap-2 text-gray-300 hover:text-heritage-gold transition-all duration-300 hover:-translate-y-1"
          >
            <BookOpenText size={18} />
            Knowledge Hub
          </Link>

          <Link
            to="/favorites"
            className="flex items-center gap-2 text-gray-300 hover:text-heritage-gold transition-all duration-300 hover:-translate-y-1"
          >
            <Heart size={18} />
            Favorites
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 md:gap-4">

          {/* Desktop Search */}
          <button
           className="hidden md:flex h-10 w-10 rounded-full bg-white/5 border border-white/10
items-center justify-center text-white
hover:text-heritage-gold hover:scale-110 transition-all duration-300"
          >
            <Search size={20} />
          </button>

          {/* Desktop Profile */}
          <button
           className="hidden md:flex h-10 w-10 rounded-full bg-white/5 border border-white/10
items-center justify-center text-white
hover:text-heritage-gold hover:scale-110 transition-all duration-300"
          >
            <User size={20} />
          </button>

          {/* Desktop Login */}
          <Link to="/auth">
          <button
            className="hidden md:block px-6 py-2 rounded-xl bg-heritage-gold text-black font-semibold
hover:bg-heritage-light-gold hover:scale-105
hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]
transition-all duration-300"
          >
            Login
          </button>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-white p-1"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 lg:hidden"
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-20 right-0 h-screen w-72 max-w-[85vw]
        bg-heritage-dark/95 backdrop-blur-lg border-l border-heritage-gold/20
        transform transition-transform duration-300 z-50
        ${isOpen ? "translate-x-0" : "translate-x-full"}
        lg:hidden`}
      >
        <div className="flex flex-col p-6 gap-6">

          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 text-gray-300 hover:text-heritage-gold transition-colors"
          >
            <House size={20} />
            Home
          </Link>

          <Link
            to="/explore"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 text-gray-300 hover:text-heritage-gold transition-colors"
          >
            <Compass size={20} />
            Explore Places
          </Link>

          <Link
            to="/knowledgehub"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 text-gray-300 hover:text-heritage-gold transition-colors"
          >
            <BookOpenText size={20} />
            Knowledge Hub
          </Link>

          <Link
            to="/favorites"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 text-gray-300 hover:text-heritage-gold transition-colors"
          >
            <Heart size={20} />
            Favorites
          </Link>

          <hr className="border-heritage-gold/20" />

          {/* Mobile Actions */}
          <button className="flex items-center gap-3 text-gray-300 hover:text-heritage-gold">
            <Search size={20} />
            Search
          </button>

          <button className="flex items-center gap-3 text-gray-300 hover:text-heritage-gold">
            <User size={20} />
            Profile
          </button>
          <Link to="/auth">
          <button className="mt-2 px-4 py-2 rounded-xl bg-heritage-gold text-black font-semibold hover:bg-heritage-light-gold transition-all duration-300">
  Login
</button>
</Link>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;