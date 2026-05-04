import { createContext, useContext, useEffect, useState } from "react";
import {
  getStoredUser,
  getStoredUserName,
  createUser,
  updateUserName,
} from "../config/user";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userId,  setUserId]  = useState(null);
  const [name,    setNameState] = useState("");
  const [isReady, setIsReady] = useState(false);

  // 1. On mount — restore from localStorage
  useEffect(() => {
    const storedId   = getStoredUser();
    const storedName = getStoredUserName();
    if (storedId)   setUserId(storedId);
    if (storedName) setNameState(storedName);
    setIsReady(true);
  }, []);

  // 2. If name was just set but no userId yet — create user in Supabase
  useEffect(() => {
    if (!name || userId) return;
    const initUser = async () => {
      const id = await createUser(name);
      if (id) setUserId(id);
    };
    initUser();
  }, [name, userId]);

  // 3. If name was updated and userId already exists — update in Supabase
  const setName = async (newName) => {
    setNameState(newName);
    if (userId) {
      // User already exists — just update the name
      await updateUserName(userId, newName);
    }
    // If no userId yet, the useEffect above will createUser with the new name
  };

  return (
    <UserContext.Provider value={{ userId, name, setName, isReady }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);