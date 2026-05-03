import { createContext, useContext, useEffect, useState } from "react";
import { getStoredUser, createUser, getStoredUserName } from "../config/user";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storedId = getStoredUser();
    const storedName = getStoredUserName();
    if (storedId) {
      setUserId(storedId);
    }
    if (storedName) setName(storedName);
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!name || userId) return;
    const initUser = async () => {
      const id = await createUser(name);
      console.log("User Id: ", id);
      if (id) setUserId(id);
    };
    initUser();
  }, [name, userId]);

  return (
    <UserContext.Provider value={{ userId, name, setName, isReady }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
