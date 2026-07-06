import api from "../api/api";

const reviewService = {

  // ===========================
  // Add Review
  // ===========================
  addReview: async (reviewData) => {

    try {

      const response = await api.post(
        "/reviews",
        reviewData
      );

      return response.data;

    } catch (error) {

      throw (
        error.response?.data || {
          success: false,
          message: "Unable to add review",
        }
      );

    }

  },

  // ===========================
  // Update Review
  // ===========================
  updateReview: async (
    reviewId,
    reviewData
  ) => {

    try {

      const response = await api.put(
        `/reviews/${reviewId}`,
        reviewData
      );

      return response.data;

    } catch (error) {

      throw (
        error.response?.data || {
          success: false,
          message: "Unable to update review",
        }
      );

    }

  },

  // ===========================
  // Delete Review
  // ===========================
  deleteReview: async (reviewId) => {

    try {

      const response = await api.delete(
        `/reviews/${reviewId}`
      );

      return response.data;

    } catch (error) {

      throw (
        error.response?.data || {
          success: false,
          message: "Unable to delete review",
        }
      );

    }

  },

};

export default reviewService;