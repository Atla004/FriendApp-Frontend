import {
  View,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
  Appearance,
  Alert,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useProfileContext } from "@/context/ProfileContext";
import {
  PasswordChangeModal,
  EmailChangeModal,
  DeleteAccountModal,
} from "@/components/mainInterfaceComponents/ProfileScreenComponents/ProfileScreenComponents";
import { PasswordChangeModalProps } from "@/components/mainInterfaceComponents/ProfileScreenComponents/PasswordChangeModal";
import { EmailChangeModalProps } from "@/components/mainInterfaceComponents/ProfileScreenComponents/EmailChangeModal";
import { DeleteAccountModalProps } from "@/components/mainInterfaceComponents/ProfileScreenComponents/DeleteAccountModal";
import SnackbarSaveChanges from "@/components/mainInterfaceComponents/ProfileScreenComponents/SnackbarSaveChanges";
import { supabase } from "@/utils/supabaseClient";
import { uploadAvatar } from "@/utils/saveImages";

const MockData = {
  _id: "51823ba3421324234",
  name: "El Atla",
  username: "el_atla",
  email: "atla@tlas.online",
  password: "12345678",
  info: {
    bio: "string",
    gender: "male",
    birthdate: "Date(18-08-2004)",
    country: "Venezuela",
    Photos: [
      "https://is.zobj.net/image-server/v1/images?r=gYzSI8o-5BkyuE3rfiUbjlO7pVEZ7mXOSR8_nAL7nqyBa8TDqTG78W-JAeNfF1zbGX8uDf-d6oxuy9AUd1atyEOp7wGz5CAx2eHa7lYmukuwxUnHoYxazo3MAayebFTB12tPi85-9L3iOwZ5qX2qYn9hPJaWodjPNT2CjvBSCXt8mETRR9kLLZL7O3GZbOjjkKtoIcnw37rWAaicgyAMkdaex4kgrjSctoeXlA",
    ],
  },
};

export default function ProfileScreen() {
  const { profile, updateProfile } = useProfileContext();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const [passwordModalProps, setPasswordModalProps] =
    useState<PasswordChangeModalProps>({
      visible: false,
      onClose: () => {
        setPasswordModalProps({ ...passwordModalProps, visible: false });
      },
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      setCurrentPassword: (text: string) => {
        setPasswordModalProps({ ...passwordModalProps, currentPassword: text });
      },
      setNewPassword: (text: string) => {
        setPasswordModalProps({ ...passwordModalProps, newPassword: text });
      },
      setConfirmPassword: (text: string) => {
        setPasswordModalProps({ ...passwordModalProps, confirmPassword: text });
      },
      onChange: () => handleOnChangePassword(),
    });

  console.log(
    "ProfileScreen password modal visible",
    passwordModalProps.visible
  );
  const [emailModalProps, setEmailModalProps] = useState<EmailChangeModalProps>(
    {
      visible: false,
      onClose: () => {
        setEmailModalProps({ ...emailModalProps, visible: false });
      },
      newEmail: "",
      setNewEmail: (text: string) => {
        setEmailModalProps({ ...emailModalProps, newEmail: text });
      },
      onChange: () => handleOnChangeEmail(),
    }
  );

  const [deleteAccountModalProps, setDeleteAccountModalProps] =
    useState<DeleteAccountModalProps>({
      visible: false,
      onClose: () => {
        setDeleteAccountModalProps({
          ...deleteAccountModalProps,
          visible: false,
        });
      },
      deleteConfirmation: "",
      setDeleteConfirmation: (text: string) => {
        setDeleteAccountModalProps({
          ...deleteAccountModalProps,
          deleteConfirmation: text,
        });
      },
      onDelete: () => handleOnDelete(),
    });

  const handleOnDelete = () => {
    // Implement onDelete functionality here
  };

  const handleOnChangeEmail = () => {
    // Implement onChange email functionality here
  };

  const handleOnChangePassword = () => {
    // Implement onChange password functionality here
  };

  const handleLogout = () => {
    // Implement logout functionality here
  };

  const colorScheme = Appearance.getColorScheme();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const image = result.assets[0];
      uploadAvatar(image);
      updateProfile({ photo: result.assets[0].uri });
      setHasChanges(true);
    }
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <TouchableOpacity style={styles.photoContainer} onPress={pickImage}>
          {profile.photo ? (
            <Image source={{ uri: profile.photo }} style={styles.photo} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Ionicons name="camera" size={40} color="#666" />
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.name}>Juan</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Biography</Text>
          <TextInput
            style={styles.input}
            multiline
            numberOfLines={4}
            value={profile.bio || ""}
            onChangeText={(text) => {
              updateProfile({ bio: text });
              setHasChanges(true);
            }}
            placeholder="Tell us about yourself..."
            maxLength={200}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.genderButtons}>
            {["Male", "Female"].map((gender) => (
              <TouchableOpacity
                key={gender}
                style={[
                  styles.genderButton,
                  profile.gender === gender && styles.genderButtonActive,
                ]}
                onPress={() => {
                  updateProfile({ gender });
                  setHasChanges(true);
                }}
              >
                <Text
                  style={[
                    styles.genderButtonText,
                    profile.gender === gender && styles.genderButtonTextActive,
                  ]}
                >
                  {gender}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.section}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.label}>Birth Date</Text>
          <Text style={styles.value}>
            {profile.birthDate
              ? profile.birthDate.toLocaleDateString()
              : "Select date"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.section}
          onPress={() => {
            setPasswordModalProps({ ...passwordModalProps, visible: true });
          }}
        >
          <Text style={styles.label}>Change Password</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.section}
          onPress={() => {
            setEmailModalProps({ ...emailModalProps, visible: true });
          }}
        >
          <Text style={styles.label}>Change Email</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.section}
          onPress={() => {
            setDeleteAccountModalProps({
              ...deleteAccountModalProps,
              visible: true,
            });
          }}
        >
          <Text style={styles.label}>Delete Account</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.section} onPress={handleLogout}>
          <Text style={styles.label}>Log Out</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>

        {showDatePicker && (
          <View
            style={[
              styles.datePickerContainer,
              colorScheme === "dark" ? styles.darkMode : styles.lightMode,
            ]}
          >
            <DateTimePicker
              value={profile.birthDate || new Date()}
              mode="date"
              display="spinner"
              onChange={(event: any, date: Date | undefined) => {
                setShowDatePicker(false);
                if (date) {
                  updateProfile({ birthDate: date });
                  setHasChanges(true);
                }
              }}
            />
          </View>
        )}

        <PasswordChangeModal {...passwordModalProps} />
        <EmailChangeModal {...emailModalProps} />
        <DeleteAccountModal {...deleteAccountModalProps} />
      </ScrollView>
      {hasChanges && <SnackbarSaveChanges setHasChanges={setHasChanges} />}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  photoContainer: {
    alignItems: "center",
    padding: 20,
  },
  photo: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  photoPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    backgroundColor: "white",
    padding: 15,
    marginBottom: 10,
  },

  name: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    minHeight: 100,
    textAlignVertical: "top",
  },
  genderButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  genderButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  genderButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  genderButtonText: {
    color: "#666",
  },
  genderButtonTextActive: {
    color: "white",
  },
  value: {
    color: "#666",
  },

  datePickerContainer: {
    borderRadius: 10,
    padding: 10,
    backgroundColor: "red", // Fondo semitransparente
  },
  darkMode: {
    backgroundColor: "red", // Fondo semitransparente para modo oscuro
  },
  lightMode: {
    backgroundColor: "red", // Fondo semitransparente para modo claro
  },
  datePicker: {
    backgroundColor: "transparent", // Asegura que el fondo del DateTimePicker sea transparente
  },
});
