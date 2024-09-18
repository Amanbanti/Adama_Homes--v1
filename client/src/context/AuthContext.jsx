import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const updateUser = (data) => {
    setCurrentUser(data);
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
    //changing to json format
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser,updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
