import { supabase } from "./supabase";

export const getStoredUser = () => {
  return localStorage.getItem("ph_study_user_id");
};

export const createUser = async (name) => {
  const { data, error } = await supabase
    .from("users")
    .insert({ name: name || "Anonymous" })
    .select("user_id")
    .single();

  if (error || !data) return null;

  localStorage.setItem("ph_study_user_id", data.user_id);
  return data.user_id;
};
