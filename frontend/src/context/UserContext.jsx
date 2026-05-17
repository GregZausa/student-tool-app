import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { supabase } from "../config/supabase";
import { getUserByAuthId, createUserRow } from "../config/user";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadingDone = useRef(false);
  const finish = () => {
    if (!loadingDone.current) {
      loadingDone.current = true;
      setLoading(false);
    }
  };

  const loadUserRow = useCallback(async (authId) => {
    try {
      console.log("loadUserRow called with:", authId);
      let row = await getUserByAuthId(authId);
      console.log("getUserByAuthId result:", row);
      if (!row) {
        console.log("No row found, creating...");
        row = await createUserRow(authId);
        console.log("createUserRow result:", row);
      }
      setUser(row);
    } catch (err) {
      console.error("loadUserRow error:", err);
    } finally {
      finish();
    }
  }, []);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);

      if (session?.user) {
        await loadUserRow(session.user.id);
      } else {
        setUser(null);
        finish();
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        finish();
      }
    });

    return () => subscription.unsubscribe();
  }, [loadUserRow]);

  const refreshUser = useCallback(async () => {
    if (!session?.user) return;
    try {
      const row = await getUserByAuthId(session.user.id);
      setUser(row);
    } catch (err) {
      console.error("refreshUser error:", err);
    }
  }, [session]);

  const userId = user?.user_id ?? null;
  const name = user?.name ?? "";
  const isLoggedIn = !!session;
  const needsOnboarding = isLoggedIn && (!name || name === "Anonymous");

  return (
    <UserContext.Provider
      value={{
        session,
        user,
        userId,
        name,
        loading,
        isLoggedIn,
        needsOnboarding,
        refreshUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
