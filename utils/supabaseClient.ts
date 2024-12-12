import { createClient } from "@supabase/supabase-js";

const projectUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
const apiKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";

const bucketName = process.env.EXPO_PUBLIC_SUPABASE_BUCKET || "";

const supabase = createClient(projectUrl, apiKey);

export const uploadFile = async (file: any, path: string) => {
  const storage = supabase.storage.from(bucketName);
  const { data, error } = await storage.upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: "image/jpeg",
  });
  if (error) {
    console.error("Error uploading the file:", path);
    return { success: false };
  }
  return { success: true, data: data };
};

export const getFile = async (path: string) => {
  const storage = supabase.storage.from(bucketName);
  const { data, error } = await storage.download(path);
  if (error) {
    console.error("Error downloading the file:" + path);
    return { success: false };
  }
  return {succes: true, data: data};
};

export const setChats = async (chats: any[]) => {
  const { data, error } = await supabase
    .from('chats')
    .insert(chats);

  if (error) {
    console.error("Error setting chats:", error);
    return { success: false };
  }
  return { success: true, data: data };
};
