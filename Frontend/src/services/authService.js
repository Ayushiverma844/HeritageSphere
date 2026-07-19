import api from "../api/api";

// =======================================
// Login
// =======================================

const login = async (data) => {

  const response = await api.post(
    "/auth/login",
    data
  );

  return response.data;

};

// =======================================
// Signup
// =======================================

const signup = async (data) => {

  const response = await api.post(
    "/auth/signup",
    data
  );

  return response.data;

};

// =======================================
// Send OTP
// =======================================

const sendOTP = async (email, purpose) => {

  const response = await api.post(
    "/auth/send-otp",
    {
      email,
      purpose,
    }
  );

  return response.data;

};

// =======================================
// Verify OTP
// =======================================

const verifyOTP = async (
  email,
  otp,
  purpose
) => {

  const response = await api.post(
    "/auth/verify-otp",
    {
      email,
      otp,
      purpose,
    }
  );

  return response.data;

};

// =======================================
// Forgot Password
// =======================================

const forgotPassword = async (email) => {

  const response = await api.post(
    "/auth/forgot-password",
    {
      email,
    }
  );

  return response.data;

};

// =======================================
// Verify Forgot Password OTP
// =======================================

const verifyForgotPasswordOTP = async (
  email,
  otp
) => {

  const response = await api.post(
    "/auth/forgot-password/verify-otp",
    {
      email,
      otp,
    }
  );

  return response.data;

};

// =======================================
// Reset Password
// =======================================

const resetPassword = async (
  email,
  new_password,
  confirm_password
) => {

  const response = await api.post(
    "/auth/reset-password",
    {
      email,
      new_password,
      confirm_password,
    }
  );

  return response.data;

};

// =======================================
// Refresh Token
// =======================================

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

// =======================================
// Logout
// =======================================

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

  login,

  signup,

  sendOTP,

  verifyOTP,

  forgotPassword,

  verifyForgotPasswordOTP,

  resetPassword,

  refreshToken,

  logout,

};