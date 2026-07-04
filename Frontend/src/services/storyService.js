import api from "../api/api";

const getStories = async (params = {}) => {
  const response = await api.get("/stories", {
    params,
  });

  return response.data;
};

const getStoryDetails = async (id) => {
  const response = await api.get(`/stories/${id}`);

  return response.data;
};

export default {
  getStories,
  getStoryDetails,
};