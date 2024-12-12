import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons
import { useState } from "react";

interface SecureInputProps {
  placeholder?: string;
  value:string;
  onChangeText: (value: string) => void;
}

const SecureInput = ({ placeholder ="password",value, onChangeText }: SecureInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.passwordContainer}>
      <TextInput
        style={styles.passwordInput}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!showPassword}
        placeholderTextColor={"rgba(235, 237, 240,0.5)"}
      />
      <TouchableOpacity
        style={styles.showPasswordButton}
        onPress={() => setShowPassword(!showPassword)}
      >
        <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="gray" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  showPasswordButton: {
    position: 'absolute',
    right: 10,
    padding: 10,
  },
  passwordInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "white",
  },
});

export default SecureInput;