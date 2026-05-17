import { supabase } from "./supabase";

export const getUserByAuthId = async (authId) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("auth_id", authId)
    .single();

  if (error) return null;
  return data;
};

export const createUserRow = async (authId, name = "Anonymous") => {
  const { data, error } = await supabase
    .from("users")
    .insert({ auth_id: authId, name })
    .select()
    .single();

  if (error) {
    console.error("Failed to create user row:", error);
    return null;
  }
  return data;
};

export const updateUserName = async (authId, name) => {
  const { data, error } = await supabase
    .from("users")
    .update({ name })
    .eq("auth_id", authId)
    .select()
    .single();

  if (error) {
    console.error("Failed to update user name:", error);
    return null;
  }
  return data;
};

export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return { error };
  return { data };
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) return { error };
  return { data };
};

// ── Sign out ───────────────────────────────────────────────────────────────
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};
