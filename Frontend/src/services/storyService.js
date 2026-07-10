import api from "../api/api";

// ======================================
// Public
// ======================================

// Get Stories

const getStories = async (params = {}) => {

  const response = await api.get(
    "/stories",
    {
      params,
    }
  );

  return response.data;

};

// Get Story Details

const getStoryDetails = async (slug) => {

  const response = await api.get(
    `/stories/${slug}`
  );

  return response.data;

};

// ======================================
// Admin
// ======================================

// Get All Stories (Admin)

const getAdminStories = async (
  params = {}
) => {

  const response = await api.get(
    "/stories/admin",
    {
      params,
    }
  );

  return response.data;

};

// Get Story By Id

const getAdminStoryById = async (
  storyId
) => {

  const response = await api.get(
    `/stories/admin/${storyId}`
  );

  return response.data;

};

// ======================================
// Create Story
// ======================================

const createStory = async (
  formData
) => {

  const response = await api.post(

    "/stories/admin",

    formData,

    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }

  );

  return response.data;

};

// ======================================
// Update Story
// ======================================

const updateStory = async (
  storyId,
  formData
) => {

  const response = await api.put(

    `/stories/admin/${storyId}`,

    formData,

    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }

  );

  return response.data;

};

// ======================================
// Delete Story
// ======================================

const deleteStory = async (
  storyId
) => {

  const response = await api.delete(
    `/stories/admin/${storyId}`
  );

  return response.data;

};

export default {

  // Public

  getStories,
  getStoryDetails,

  // Admin

  getAdminStories,
  getAdminStoryById,

  createStory,
  updateStory,
  deleteStory,

};