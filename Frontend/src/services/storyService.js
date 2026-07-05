import api from "../api/api";

const getStories = async (params = {}) => {
  const response = await api.get("/stories", {
    params,
  });

  return response.data;
};

const getStoryDetails = async (slug) => {
  const response = await api.get(`/stories/${slug}`);
  return response.data;
};

export default {
  getStories,
  getStoryDetails,
};