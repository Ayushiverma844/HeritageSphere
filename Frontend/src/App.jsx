import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import PlaceDetails from "./pages/PlaceDetails";
import Collection from "./pages/MyCollection";
import KnowledgeHub from "./pages/KnowledgeHub";
import Story from "./pages/Story";
import Admin from "./pages/AdminDashboard";
import AdminManagePlaces from "./components/Admin/ManagePlaces";
import AdminManageStories from "./components/Admin/ManageStories";
import AdminManageCategories from "./components/Admin/ManageCategories";
import AiStoryGenerator from "./components/Admin/AiStoryGenerator";
const App = () => {
  return (
   
    <div className="relative min-h-screen">

  {/* Background Image */}
  <div
    className="
    fixed
    inset-0
    -z-20
    bg-cover
    bg-center
    "
    style={{
      backgroundImage:
        "url('/bg/heritage-bg.jpg')",
    }}
  />

  {/* Dark Overlay */}
  <div
    className="
    fixed
    inset-0
    -z-10
    bg-heritage-dark/85
    "
  />

  {/* Blue Glows */}
  <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">

    <div className="absolute top-20 left-20 h-112.5 w-112.5 rounded-full bg-cyan-500/10 blur-[150px]" />

    <div className="absolute bottom-20 right-20 h-87.5 w-87.5 rounded-full bg-blue-500/10 blur-[140px]" />

  </div>

 
<Routes>
  <Route path="/" element={<Home />} />

  <Route path="/auth" element={<Auth />} />

  <Route path="/places" element={<Explore />} />

  <Route path="/places/:id" element={<PlaceDetails />} />

  <Route path="/knowledge-hub" element={<KnowledgeHub />} />

  <Route path="/stories/:slug" element={<Story />} />

  <Route path="/my-collection" element={<Collection />} />

  <Route path="/profile" element={<Profile />} />

  <Route path="/admin" element={<Admin />} />
  <Route path="/admin/manage-places" element={<AdminManagePlaces />} />
  <Route path="/admin/manage-stories" element={<AdminManageStories />} />
  <Route path="/admin/manage-categories" element={<AdminManageCategories />} />
  <Route path="/admin/ai-story-generator" element={<AiStoryGenerator />} />
</Routes>
</div>
  )
}

export default App