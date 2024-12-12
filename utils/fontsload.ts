import { useFonts } from "expo-font";
import { useState, useEffect } from "react";


export function useFontsLoad(): boolean {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const [loaded] = useFonts({
    Dancing: require("@/assets/fonts/DancingScript.ttf"),
  });

  useEffect(() => {
    console.log(loaded);
    if (loaded) {
      setFontsLoaded(true);
    }
  }, [loaded]);

  return fontsLoaded;
}
