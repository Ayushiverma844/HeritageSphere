import api from "../api/api";

const getPlaces = async (params = {}) => {
  const response = await api.get("/places", {
    params,
  });

  return response.data;
};

const getPlaceDetails = async (id) => {
  const response = await api.get(`/places/${id}`);

  return response.data;
};

const getSimilarPlaces = async (id) => {
  const response = await api.get(
    `/places/${id}/similar`
  );

  return response.data;
};

export default {
  getPlaces,
  getPlaceDetails,
  getSimilarPlaces,
};