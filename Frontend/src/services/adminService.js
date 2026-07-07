import api from "../api/api";

// ========================================
// PLACE CRUD
// ========================================

export const createPlace = (data) =>
  api.post("/admin/places", data);

export const updatePlace = (id, data) =>
  api.put(`/admin/places/${id}`, data);

export const deletePlace = (id) =>
  api.delete(`/admin/places/${id}`);


// ========================================
// PLACE DETAILS
// ========================================

export const createPlaceDetails = (data) =>
  api.post("/admin/place-details", data);

export const updatePlaceDetails = (placeId, data) =>
  api.put(`/admin/place-details/${placeId}`, data);

export const deletePlaceDetails = (placeId) =>
  api.delete(`/admin/place-details/${placeId}`);


// ========================================
// STORIES
// ========================================

export const createStory = (data) =>
  api.post("/admin/stories", data);

export const updateStory = (id, data) =>
  api.put(`/admin/stories/${id}`, data);

export const deleteStory = (id) =>
  api.delete(`/admin/stories/${id}`);


// ========================================
// STORY CHAPTERS
// ========================================

export const createChapter = (data) =>
  api.post("/admin/chapters", data);

export const updateChapter = (id, data) =>
  api.put(`/admin/chapters/${id}`, data);

export const deleteChapter = (id) =>
  api.delete(`/admin/chapters/${id}`);