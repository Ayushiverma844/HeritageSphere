import api from "../api/api";

// ==============================
// Public APIs
// ==============================

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

// ==============================
// Admin APIs
// ==============================

const getAdminPlaces = async (
  page = 1,
  limit = 30
) => {

  const response = await api.get(

    `/places/admin?page=${page}&limit=${limit}`

  );

  return response.data;

};

const getAdminPlaceById = async (id) => {
  const response = await api.get(
    `/places/admin/${id}`
  );

  return response.data;
};

const createPlace = async (formData) => {
  const response = await api.post(
    "/places/admin",
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

const updatePlace = async (
  id,
  formData
) => {
  const response = await api.put(
    `/places/admin/${id}`,
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

const deletePlace = async (id) => {
  const response = await api.delete(
    `/places/admin/${id}`
  );

  return response.data;
};

export default {
  // Public
  getPlaces,
  getPlaceDetails,
  getSimilarPlaces,

  // Admin
  getAdminPlaces,
  getAdminPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
};