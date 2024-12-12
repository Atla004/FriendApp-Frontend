import React from "react";
import { ImageBackground, Animated } from "react-native";
import { Slot, Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { useState, useEffect, useRef } from "react";

import { ProfileProvider } from '../context/ProfileContext';
import { ToastProvider } from '../context/ToastContext';
import { UserDataProvider } from '../context/UserDataContext';
import { useFontsLoad } from "@/utils/fontsload";

export default function Layout() {
  const loading = useFontsLoad();
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const scale = 3; 
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateRotate = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotate, {
            toValue: 1, // Complete rotation
            duration: 50000, // Slow rotation
            useNativeDriver: true,
          }),
          Animated.timing(rotate, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateRotate();
  }, [rotate]);

  const rotateInterpolate = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <>
      <Animated.Image
        source={require('@/assets/background.jpeg')}
        style={[
          styles.background,
          {
            transform: [
              { rotate: rotateInterpolate },
              { scale: scale }, 
            ],
          },
        ]}
      />
      <ProfileProvider>
        <ToastProvider>
          <UserDataProvider>
            <Slot />
          </UserDataProvider>
        </ToastProvider>
      </ProfileProvider>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
});
