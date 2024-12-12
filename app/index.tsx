import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
  Pressable,
} from "react-native";
import { router } from "expo-router";

export default function Index() {
  const [isOpen, setIsOpen] = useState(true);
  const opacity = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };
    animate();
  }, [opacity]);

  const handlePress = () => {
    router.push("/MatchScreen");
  };

  return (
    <View style={{ flex: 1 }}>
      {isOpen && (
        <Pressable
          style={styles.fullScreenContainer}
          onPress={handlePress}
        >
          <View style={styles.pokedex}>
            <View style={styles.textContainer}>
              <Animated.Text style={[styles.text, { opacity }]}>
                Tap to Login
              </Animated.Text>
            </View>
          </View>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  textContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -50 }, { translateY: -50 }],
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  pokedex: {
    width: 400,
    height: 400,
    padding: 20,
  },
});
