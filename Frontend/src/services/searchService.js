import api from "../api/api";

const search = async (query) => {

  const response = await api.get("/search", {
    params: {
      q: query,
    },
  });

  return response.data;
};

export default {
  search,
};