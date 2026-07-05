import api from "../api/api";


// ==============================
// Save Item
// ==============================

const saveItem = async (item_type, item_id) => {
  const response = await api.post(
    "/collection/save",
    {
      item_type,
      item_id,
    }
  );

  return response.data;
};


// ==============================
// Get My Collection
// ==============================

const getMyCollection = async () => {
  const response = await api.get("/collection");

  return response.data;
};


// ==============================
// Remove Item
// ==============================

const removeItem = async (item_type, item_id) => {
  const response = await api.delete(
    "/collection",
    {
      data: {
        item_type,
        item_id,
      },
    }
  );

  return response.data;
};


const collectionService = {
  saveItem,
  getMyCollection,
  removeItem,
};

export default collectionService;