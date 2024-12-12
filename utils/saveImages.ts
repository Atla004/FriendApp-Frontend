import { Alert } from "react-native";
import { uploadFile } from "./supabaseClient";


export async function uploadAvatar(image: any, user: string) {
  try {

    if (!image.uri) {
      throw new Error("No image uri!"); 
    }

    const arraybuffer = await fetch(image.uri).then((res) =>
      res.arrayBuffer()
    );
    const path = `/public/${user}-${Date.now()}.jpg`;;

    const data = await uploadFile(arraybuffer,path );
    if (!data.success) {
      throw new Error("Error uploading the file");
    }
    return path;
    


  } catch (error) {
    return '';

  }
}