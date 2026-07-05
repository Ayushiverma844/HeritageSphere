import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";


import {
  Search,
  User,
  Bell,
  House,
  Compass,
  BookOpenText,
  Heart,
  Menu,
  X,
  Bookmark,
} from "lucide-react";

const notifications = [
  {
    id: 1,
    title: "New Story Added",
    message: "The Legend of Krishna is now available.",
    time: "2h ago",
    icon: "✨",
  },
  {
    id: 2,
    title: "New Place Added",
    message: "Amer Fort has been added.",
    time: "5h ago",
    icon: "🏛",
  },
  {
    id: 3,
    title: "Favorite Update",
    message: "Hawa Mahal received 120 new reviews.",
    time: "1 day ago",
    icon: "❤️",
  },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
const [showNotifications, setShowNotifications] = useState(false);
const notificationRef = useRef(null);
const navigate = useNavigate();

const [user, setUser] = useState(null);
useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target)
    ) {
      setShowNotifications(false);
    }
  };

  document.addEventListener(
    "mousedown",
    handleClickOutside
  );

  return () => {
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
  };
}, []);

useEffect(() => {

  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }

}, []);
const handleLogout = () => {

  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");

  setUser(null);
   setIsOpen(false);
  setShowNotifications(false);

  navigate("/");

};
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
            className="flex items-center gap-2 text-gray-300 hover:text-heritage-gold transition-all duration-300 hover:-translate-y-1.5"
          >
            <House size={18} />
            Home
          </Link>

          <Link
            to="/places"
            className="flex items-center gap-2 text-gray-300 hover:text-heritage-gold transition-all duration-300 hover:-translate-y-1"
          >
            <Compass size={18} />
            Explore Places
          </Link>

          <Link
            to="/knowledge-hub"
            className="flex items-center gap-2 text-gray-300 hover:text-heritage-gold transition-all duration-300 hover:-translate-y-1"
          >
            <BookOpenText size={18} />
            Knowledge Hub
          </Link>

          <Link
            to={user ? "/my-collection" : "/auth"}
            className="flex items-center gap-2 text-gray-300 hover:text-heritage-gold transition-all duration-300 hover:-translate-y-1"
          >
            <Bookmark size={18} />
            My Collection
          </Link>
        </div>

        {/* Right Section */}
       <div
  ref={notificationRef}
  className="relative flex items-center gap-2 md:gap-4"
>
          
          {/* Desktop notification */}
  {user && (        
           <button
  onClick={() =>
    setShowNotifications(!showNotifications)
  }
  className="
  relative
  hidden
  md:flex
  h-10
  w-10
  rounded-full
  bg-white/5
  border
  border-white/10
  items-center
  justify-center
  text-white
  hover:text-heritage-gold
  hover:scale-110
  transition-all
  duration-300
  
  "
>
  <Bell size={20} />

  {/* Notification Dot */}
  <span
    className="
    absolute
    top-2
    right-2
    h-2
    w-2
    rounded-full
    bg-red-500
    animate-pulse
    "
  />
</button>
)}
{user && showNotifications && (
  <div
    className="
    absolute
    top-15
    right-0
    w-85
    rounded-3xl
    bg-heritage-dark/50
    backdrop-blur-xl
    border
    border-white/10
    shadow-2xl
    overflow-hidden
    animate-in fade-in zoom-in-95 duration-200
    "
  >
    <div className="p-5 border-b border-white/10">

      <h3 className="text-lg font-semibold text-white">
        Notifications
      </h3>

    </div>

    <div className="max-h-96 overflow-y-auto">

      {notifications.map((item) => (
        <div
          key={item.id}
          className="
          p-4
          border-b
          border-white/5
          hover:bg-white/5
          transition-all
          cursor-pointer
          "
        >
          <div className="flex gap-3">

            <div className="text-xl">
              {item.icon}
            </div>

            <div>

              <h4 className="font-medium text-white">
                {item.title}
              </h4>

              <p className="text-sm text-gray-400 mt-1">
                {item.message}
              </p>

              <span className="text-xs text-gray-500">
                {item.time}
              </span>

            </div>

          </div>
        </div>
      ))}

    </div>

    <button
      className="
      w-full
      py-4
      text-center
      text-heritage-gold
      hover:bg-white/5
      transition-all
      "
    >
      View All Notifications
    </button>
  </div>
)} 



          {/* Desktop Profile */}
      {user && (

<Link to="/profile">

<button
className="hidden md:flex h-10 w-10 rounded-full bg-white/5 border border-white/10
items-center justify-center text-white
hover:text-heritage-gold hover:scale-120 transition-all duration-300"
>

{user.profile_image ? (

<img
src={user.profile_image}
alt="profile"
className="h-10 w-10 rounded-full object-cover"
/>

) : (

<User size={20}/>

)}

</button>

</Link>

)}
          {/* Desktop Login */}
         {!user && (

<Link to="/auth">

<button
className="hidden md:block px-6 py-2 rounded-xl bg-heritage-gold text-black font-semibold
hover:bg-heritage-light-gold hover:scale-110
hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]
transition-all duration-300"
>

Login

</button>

</Link>

)}

{/* admin dashboard */}
{user?.role === "admin" && (

<Link

to="/admin"

onClick={() => setIsOpen(false)}

className="flex items-center gap-3 text-gray-300 hover:text-heritage-gold"

>

Dashboard

</Link>

)}

{/* logout */}
{user && (

<button

onClick={handleLogout}

className="hidden md:block px-6 py-2 rounded-xl border border-red-500
text-red-400 hover:bg-red-500 hover:text-white
transition-all duration-300"

>

Logout

</button>

)}

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
        className={`fixed top-20 right-0 h-[calc(100vh-80px)] w-72 max-w-[85vw]
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
            to="/places"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 text-gray-300 hover:text-heritage-gold transition-colors"
          >
            <Compass size={20} />
            Explore Places
          </Link>

          <Link
            to="/knowledge-hub"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 text-gray-300 hover:text-heritage-gold transition-colors"
          >
            <BookOpenText size={20} />
            Knowledge Hub
          </Link>

          <Link
            to={user ? "/my-collection" : "/auth"}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 text-gray-300 hover:text-heritage-gold transition-colors"
          >
            <Bookmark size={20} />
            My Collection
          </Link>

          <hr className="border-heritage-gold/20" />

          {/* Mobile Actions */}
         
           
         {user && (

<Link
to="/profile"
onClick={() => setIsOpen(false)}
className="flex items-center gap-3 text-gray-300 hover:text-heritage-gold"
>

<User size={20}/>

Profile

</Link>

)}
          {!user && (

<Link to="/auth" onClick={() => setIsOpen(false)}>

<button
className="mt-2 px-4 py-2 rounded-xl bg-heritage-gold text-black font-semibold hover:bg-heritage-light-gold transition-all duration-300"
>

Login

</button>

</Link>

)}

{/* admin dashboard */}
{user?.role === "admin" && (

<Link

to="/admin"

onClick={() => setIsOpen(false)}

className="flex items-center gap-3 text-gray-300 hover:text-heritage-gold"

>

Dashboard

</Link>

)}

{user && (

<button

onClick={() => {

handleLogout();

setIsOpen(false);

}}

className="mt-2 px-4 py-2 rounded-xl border border-red-500
text-red-400 hover:bg-red-500 hover:text-white
transition-all duration-300"

>

Logout

</button>

)}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;