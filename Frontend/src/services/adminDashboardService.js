import api from "../api/api";

// ========================================
// DASHBOARD
// ========================================

export const getDashboardStats = () =>
  api.get("/admin/dashboard/stats");

export const getDashboardAnalytics = () =>
  api.get("/admin/dashboard/analytics");


// ========================================
// USERS
// ========================================

export const getRecentUsers = (params = {}) =>
  api.get("/admin/dashboard/users", { params });


// ========================================
// PLACES
// ========================================

export const getRecentPlaces = (params = {}) =>
  api.get("/admin/dashboard/places", { params });


// ========================================
// STORIES
// ========================================

export const getRecentStories = (params = {}) =>
  api.get("/admin/dashboard/stories", { params });