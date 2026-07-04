import {
  createContext,
  useContext,
  useState,
} from "react";

import {
  getUser,
  saveAuthData,
  clearAuthData,
} from "../utils/tokenManager";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(getUser());

  const login = (data) => {

    saveAuthData(data);

    setUser(data.user);

  };

  const logout = () => {

    clearAuthData();

    setUser(null);

  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );

};

export const useAuth = () =>
  useContext(AuthContext);