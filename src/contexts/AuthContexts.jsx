import { createContext, useContext, useState } from "react";
import {
  setUserToStorage,
  deleteUserFromStorage,
  getUserFromStorage,
} from "../utils";

const authContext = createContext();

// eslint-disable-next-line react/prop-types
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(getUserFromStorage());

  const login = (data) => {
    setUserToStorage(data.user);
    setUser(data.user);
  };

  const logout = () => {
    setUser(null);
    deleteUserFromStorage();
  };

  return (
    <authContext.Provider value={{ user, login, logout }}>
      {children}
    </authContext.Provider>
  );
}

export function useAuth() {
  return useContext(authContext);
}
