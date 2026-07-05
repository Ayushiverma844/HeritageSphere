import api from "../api/api";

const getProfile = async () => {
  const { data } = await api.get("/profile");
  return data;
};

const updateProfile = async (profileData) => {
  const { data } = await api.put(
    "/profile",
    profileData
  );

  return data;
};

const profileService = {
  getProfile,
  updateProfile,
};

export default profileService;