import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import {SecureInput} from "@/components/basic/MyComponents";
import { z } from "zod";

const backendUrl = process.env.EXPO_PUBLIC_API_URL as string;

const passwordSchema = z.string().min(8, "Password must be at least 8 characters long");

const RestartPasswordScreen = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({ newPassword: "", confirmPassword: "" });
  const router = useRouter();
  const {email, token} = useLocalSearchParams();

  const fetchData = async (newPassword: string) => {
    try {
      // const { token } = useUserData()
      const response = await fetch(`${backendUrl}/api/user/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, token, newPassword }) 
      });
      const data = await response.json();
      // setMockData(data);
    } catch (error) {
      // setToast("Error getting profile data", true, 3000);
    }
  };

  const handleRestartPassword = () => {
    const newPasswordValidation = passwordSchema.safeParse(newPassword);
    const confirmPasswordValidation = passwordSchema.safeParse(confirmPassword);

    if (!newPasswordValidation.success) {
      setErrors((prev) => ({ ...prev, newPassword: newPasswordValidation.error.errors[0].message }));
    } else {
      setErrors((prev) => ({ ...prev, newPassword: "" }));
    }

    if (!confirmPasswordValidation.success) {
      setErrors((prev) => ({ ...prev, confirmPassword: confirmPasswordValidation.error.errors[0].message }));
    } else {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }

    if (newPassword !== confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
    }

    if (newPasswordValidation.success && confirmPasswordValidation.success && newPassword === confirmPassword) {
      fetchData(newPassword).then(() => {
          router.push("/LoginScreen");
      });
    }
  };

  const goBackToLogin = () => {
    router.push("/LoginScreen");
  };


  return (
    <>
      <>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>

            <Text style={styles.title}>Restart Password</Text>

            <SecureInput
              value={newPassword}
              onChangeText={setNewPassword}
            />
            {errors.newPassword ? <Text style={styles.errorText}>{errors.newPassword}</Text> : null}

            <SecureInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}

            <TouchableOpacity
              style={styles.restartButton}
              onPress={handleRestartPassword}
            >
              <Text style={styles.restartButtonText}>Restart Password</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={goBackToLogin}>
              <Text style={styles.backButtonText}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </>
    </>
  );
};

export default RestartPasswordScreen;

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
  },
  card: {
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 24,
    marginHorizontal: 16,
    borderWidth: 4,
    borderColor: "#1f2937",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 40,
    color: "white",
    marginBottom: 24,
    textAlign: "center",
    fontFamily: "Dancing",
  },
  restartButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    width: "100%",
    marginVertical: 5,
  },
  restartButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  backButton: {
    marginTop: 8,
  },
  backButtonText: {
    color: "#3b82f6",
    fontSize: 16,
    textAlign: "center",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 4,
  },
});
