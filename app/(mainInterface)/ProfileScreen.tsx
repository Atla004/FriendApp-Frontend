import React, { useEffect } from "react";
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
import { Profile, useProfileContext } from "@/context/ProfileContext";
import PasswordChangeModal, {
  PasswordChangeModalProps,
} from "@/components/mainInterfaceComponents/ProfileScreenComponents/PasswordChangeModal";
import EmailChangeModal, {
  EmailChangeModalProps,
} from "@/components/mainInterfaceComponents/ProfileScreenComponents/EmailChangeModal";
import DeleteAccountModal, {
  DeleteAccountModalProps,
} from "@/components/mainInterfaceComponents/ProfileScreenComponents/DeleteAccountModal";
import SnackbarSaveChanges from "@/components/mainInterfaceComponents/ProfileScreenComponents/SnackbarSaveChanges";
import { uploadAvatar } from "@/utils/saveImages";
import { updateProfileData } from "@/utils/fetch/fetch";
import { useUserData } from "@/context/UserDataContext";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { validatePassword } from "@/utils/validation";

const pathToImage = "https://vaippmtqyjpyxanjifki.supabase.co/storage/v1/object/public/peoplefinder-images";
const backendUrl = process.env.EXPO_PUBLIC_API_URL as string;

const ProfileScreen = () => {
  const { profile, updateProfile } = useProfileContext();
  const { _id,email} = useUserData();
  const { token, username } = useUserData();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (token) {
      updateProfileData(
        {
          photos: profile?.photo || [],
          bio: profile?.bio || "",
          gender: profile?.gender || "",
          birthdate: profile?.birthDate || null,
          country: profile?.country || "",
          full_name: profile?.full_name || "",
        },
        token
      );
    }
  }, [profile]);

  const [profileChanges, setProfileChanges] = useState<Profile>({
    ready: profile?.ready || false,
    photo: profile?.photo || null,
    bio: profile?.bio || null,
    gender: profile?.gender || null,
    birthDate: profile?.birthDate || null,
    email: profile?.email || "",
    country: profile?.country || "",
    full_name: profile?.full_name || "",
  });

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
    if (deleteAccountModalProps.deleteConfirmation.toLowerCase() !== "delete") {
      Alert.alert("Error", 'Please type "delete" to confirm account deletion');
      return;
    }
    fetch(`${backendUrl}/user/${_id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(() => {
      Alert.alert(
        "Goodbye, Trainer!",
        "Your account has been deleted. We hope to see you again in the future!",
        [{ text: "OK", onPress: () => deleteAccountModalProps.onClose() }]
      );
      router.dismissAll();
      router.replace("/LoginScreen");
    });
  };

  const handleOnChangeEmail = () => {
    // Implement onChange email functionality here
  };

  const handleOnChangePassword = () => {
    const validation = validatePassword(passwordModalProps.newPassword);

    if (!validation.valid) {
      Alert.alert("Error", validation.errors?.[0]);
      return;
    }
    if (passwordModalProps.newPassword !== passwordModalProps.confirmPassword) {
      Alert.alert("Error", "New passwords do not match!");
      return;
    }
    fetch(`${backendUrl}/api/auth/instant-password-change`, {
      method: "PUT",
      body: JSON.stringify({ 
        email: email,
        newPassword: passwordModalProps.newPassword,
     }),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    passwordModalProps.onClose();
  };

  const handleLogout = () => {
    AsyncStorage.removeItem("user").then(() => {
      Alert.alert("Goodbye!", "You have been logged out.", [
        {
          text: "OK",
          onPress: () => {
            router.dismissAll();
            router.replace("/LoginScreen");
          },
        },
      ]);
    });
  };

  useEffect(() => {}, [profileChanges]);

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
      const path = await uploadAvatar(image,profileChanges.full_name || "");
      setProfileChanges({ ...profileChanges,photo: [path] });
      setHasChanges(true);
    }
  };

  const saveChanges = () => {
    updateProfile(profileChanges);

    setHasChanges(false);
  };

  const discardChanges = () => {
    setProfileChanges({
      ready: profile?.ready || false,
      photo: profile?.photo || null,
      bio: profile?.bio || null,
      gender: profile?.gender || null,
      birthDate: profile?.birthDate || null,
      email: profile?.email || "",
      country: profile?.country || "6759e641c14dec93250d8190",
      full_name: profile?.full_name || "",
    });
    setHasChanges(false);
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <TouchableOpacity style={styles.photoContainer} onPress={pickImage}>
          {profileChanges.photo ? (
            <Image
              source={{ uri: `${pathToImage}${profileChanges.photo[0]}` }}
              style={styles.photo}
            />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Ionicons name="camera" size={40} color="#666" />
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.name}>{username}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Biography</Text>
          <TextInput
            style={styles.input}
            multiline
            numberOfLines={4}
            value={profileChanges.bio || ""}
            onChangeText={(text) => {
              setProfileChanges({ ...profileChanges, bio: text });
              setHasChanges(true);
            }}
            placeholder="Tell us about yourself..."
            maxLength={200}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.genderButtons}>
            {["male", "female"].map((gender) => (
              <TouchableOpacity
                key={gender}
                style={[
                  styles.genderButton,
                  profileChanges.gender === gender && styles.genderButtonActive,
                ]}
                onPress={() => {
                  setProfileChanges({ ...profileChanges, gender });
                  setHasChanges(true);
                }}
              >
                <Text
                  style={[
                    styles.genderButtonText,
                    profileChanges.gender === gender &&
                      styles.genderButtonTextActive,
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
            {profileChanges.birthDate
              ? profileChanges.birthDate.toLocaleDateString()
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
              value={profileChanges.birthDate || new Date()}
              mode="date"
              display="spinner"
              onChange={(event: any, date: Date | undefined) => {
                setShowDatePicker(false);
                if (date) {
                  setProfileChanges({ ...profileChanges, birthDate: date });
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
      {hasChanges && (
        <SnackbarSaveChanges
          saveChanges={saveChanges}
          discardChanges={discardChanges}
        />
      )}
    </>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
