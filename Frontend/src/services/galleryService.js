import api from "../api/api";

// ======================================
// Get Gallery Images
// ======================================

const getGalleryImages = async (placeId) => {

  const response = await api.get(
    `/gallery/${placeId}`
  );

  return response.data;

};

// ======================================
// Upload Gallery Images
// ======================================

const uploadGalleryImages = async (
  placeId,
  images
) => {

  const formData = new FormData();

  images.forEach((image) => {

    formData.append(
      "gallery",
      image
    );

  });

  const response = await api.post(

    `/gallery/admin/${placeId}`,

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
// Update Gallery Caption
// ======================================

const updateGalleryCaption = async (
  imageId,
  caption
) => {

  const response = await api.put(

    `/gallery/admin/${imageId}`,

    {
      caption,
    }

  );

  return response.data;

};

// ======================================
// Delete Gallery Image
// ======================================

const deleteGalleryImage = async (
  imageId
) => {

  const response = await api.delete(
    `/gallery/admin/${imageId}`
  );

  return response.data;

};



export default {

  getGalleryImages,

  uploadGalleryImages,

  updateGalleryCaption,

  deleteGalleryImage,
  

};