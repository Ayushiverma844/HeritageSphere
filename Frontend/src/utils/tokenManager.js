export const saveAuthData = ({
  accessToken,
  refreshToken,
  user,
}) => {
  localStorage.setItem("accessToken", accessToken);

  localStorage.setItem("refreshToken", refreshToken);

  localStorage.setItem(
    "user",
    JSON.stringify(user)
  );
};

export const clearAuthData = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};

export const getUser = () => {
  const user = localStorage.getItem("user");

  return user ? JSON.parse(user) : null;
};

export const getAccessToken = () =>
  localStorage.getItem("accessToken");

export const getRefreshToken = () =>
  localStorage.getItem("refreshToken");