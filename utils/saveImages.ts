import { Alert } from "react-native";
import { supabase } from "./supabaseClient";

export async function uploadAvatar(image: any) {
  try {
    console.log("Got image", image);

    if (!image.uri) {
      throw new Error("No image uri!"); 
    }

    const arraybuffer = await fetch(image.uri).then((res) =>
      res.arrayBuffer()
    );

    const fileExt = image.uri?.split(".").pop()?.toLowerCase() ?? "jpeg";
    const path = `${Date.now()}.${fileExt}`;
    console.log("Uploading to path", path);
    const { data, error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, arraybuffer, {
        contentType: image.mimeType ?? "image/jpeg",
      });

    if (uploadError) {
      throw uploadError;
    }
  } catch (error) {
    if (error instanceof Error) {
      Alert.alert(error.message);
    } else {
      throw error;
    }
  }
}