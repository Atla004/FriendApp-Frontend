import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';

const backendUrl = process.env.EXPO_PUBLIC_API_URL as string;

const EnterCodeScreen = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const {email} = useLocalSearchParams();

  const handleCodeChange = (text: string, index: number) => {
    if (text.length > 1) {
      text = text[text.length - 1];
    }

    // Convert to uppercase
    text = text.toUpperCase();

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Move to next input if there's a value
    if (text.length === 1 && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const fetchData = async (token: string) => {
    try {
      const response = await fetch(`${backendUrl}/api/user/check-reset-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }) 
      });
      const data = await response.json();
    } catch (error) {
      // setToast("Error getting profile data", true, 3000);
    }
  };

  const handleSubmit = () => {
    const fullCode = code.join('');
    if (fullCode.length === 6) {
      fetchData(fullCode).then(() => {
          router.push({pathname: '/RestartPasswordScreen', params: { email, token: code }});
      })
    }
  };

  const handleBack = () => {
    router.push('/LoginScreen');
  };


  return (
    <>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            
            <Text style={styles.title}>Enter Verification Code</Text>
            <Text style={styles.subtitle}>
              Please enter the 6-digit code sent to your email
            </Text>

            <View style={styles.codeContainer}>
              {code.map((digit, index) => (
                <View key={index} style={styles.inputWrapper}>
                  <TextInput
                    ref={ref => inputRefs.current[index] = ref}
                    style={styles.codeInput}
                    value={digit}
                    onChangeText={(text) => handleCodeChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    autoCapitalize="characters"
                    maxLength={1}
                    selectTextOnFocus
                  />
                </View>
              ))}
            </View>

            <TouchableOpacity 
              style={[
                styles.submitButton,
                code.join('').length !== 6 && styles.submitButtonDisabled
              ]} 
              onPress={handleSubmit}
              disabled={code.join('').length !== 6}
            >
              <Text style={styles.submitButtonText}>Verify Code</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.resendButton}>
              <Text style={styles.resendButtonText}>Resend Code</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default EnterCodeScreen;

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 24,
    marginHorizontal: 16,
    borderWidth: 4,
    borderColor: "#1f2937",
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '90%',
    alignSelf: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  title: {
    fontSize: 40,
    color: "white",
    marginBottom: 8,
    textAlign: "center",
    fontFamily: "Dancing",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 24,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
    paddingHorizontal: 10,
  },
  inputWrapper: {
    flex: 1,
    maxWidth: 45,
    marginHorizontal: 4,
  },
  codeInput: {
    width: '100%',
    height: 48,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    fontSize: 24,
    textAlign: 'center',
    backgroundColor: '#f9fafb',
    padding: 0,
    textAlignVertical: 'center',
    includeFontPadding: false,
    lineHeight: 48,
  },
  submitButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    width: '100%',
    marginBottom: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#fca5a5',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resendButton: {
    marginBottom: 8,
  },
  resendButtonText: {
    color: '#3b82f6',
    fontSize: 16,
    textAlign: 'center',
  },
  backButton: {
    marginTop: 8,
  },
  backButtonText: {
    color: '#6b7280',
    fontSize: 16,
    textAlign: 'center',
  },
});