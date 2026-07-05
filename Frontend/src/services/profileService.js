import api from "../api/api";

// ==============================
// Get Profile
// ==============================

const getProfile = async () => {
  const { data } = await api.get("/profile");
  return data;
};

// ==============================
// Update Personal Information
// ==============================

const updateProfile = async (profileData) => {
  const { data } = await api.put(
    "/profile",
    profileData
  );

  return data;
};

// ==============================
// Change Password
// ==============================

const changePassword = async (passwordData) => {
  const { data } = await api.put(
    "/profile/password",
    passwordData
  );

  return data;
};

const profileService = {
  getProfile,
  updateProfile,
  changePassword,
};

export default profileService;