import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { z } from "zod";

import { getToken } from "@/utils/fetch/fetch";


const ForgotScreen = () => {
  const [email_or_username, setUsernameOrEmail] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleResetPassword = async() => {
    const emailSchema = z.string().email("Invalid email format");
    const usernameSchema = z.string().min(1, "Username is required");

    const isEmail = emailSchema.safeParse(email_or_username).success;
    const isUsername = usernameSchema.safeParse(email_or_username).success;

    if (!isEmail && !isUsername) {
      setError("Please enter a valid email or username");
      return;
    } 

    setError("");
    console.log("Reset password");
    await getToken(email_or_username)

    router.push({pathname: "/EnterCodeScreen", params: { email: email_or_username }});
   
  };

  const goBackToLogin = () => {
    router.push("/LoginScreen");
  };

  return (
    
      <>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>

            <Text style={styles.title}>Forgot Password?</Text>

            <TextInput
              style={styles.input}
              placeholder="Email or username"
              value={email_or_username}
              onChangeText={setUsernameOrEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleResetPassword}
            >
              <Text style={styles.resetButtonText}>Reset Password</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={goBackToLogin}>
              <Text style={styles.backButtonText}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </>
  );
};

export default ForgotScreen;

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
  input: {
    width: "100%",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: "white",
  },
  resetButton: {
    backgroundColor: "#5b4dd6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    width: "100%",
    marginBottom: 16,
  },
  resetButtonText: {
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
    marginBottom: 16,
  },
});
