import api from "../api/api";

const getCategories = async () => {
  const response = await api.get("/categories", {
    params: {
      usage_type: "PLACE",
      limit: 20,
    },
  });

  return response.data;
};

export default {
  getCategories,
};