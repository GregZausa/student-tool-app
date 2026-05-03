import { supabase } from "./supabase";

export const getStoredUser = () => {
  return localStorage.getItem("ph_study_user_id");
};
export const getStoredUserName = () => {
  return localStorage.getItem("ph_study_user_name");
};

export const createUser = async (name) => {
  const { data, error } = await supabase
    .from("users")
    .insert({ name: name || "Anonymous" })
    .select("user_id, name")
    .single();

  if (error || !data) return null;

  localStorage.setItem("ph_study_user_id", data.user_id);
  localStorage.setItem("ph_study_user_name", data.name);
  return data.user_id;
};
