import api from "../api/api";

const signup = async (data) => {
  const response = await api.post(
    "/auth/signup",
    data
  );

  return response.data;
};

const login = async (data) => {
  const response = await api.post(
    "/auth/login",
    data
  );

  return response.data;
};

const refreshToken = async () => {
  const response = await api.post(
    "/auth/refresh-token",
    {
      token: localStorage.getItem(
        "refreshToken"
      ),
    }
  );

  return response.data;
};

const logout = async () => {

  try {

    await api.post("/auth/logout");

  } finally {

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

  }

};

export default {
  signup,
  login,
  refreshToken,
  logout,
};