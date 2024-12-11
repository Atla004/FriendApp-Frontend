import {
  View,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,

} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useProfileContext } from "@/context/ProfileContext";
import { router } from "expo-router";

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
            "https://is.zobj.net/image-server/v1/images?r=gYzSI8o-5BkyuE3rfiUbjlO7pVEZ7mXOSR8_nAL7nqyBa8TDqTG78W-JAeNfF1zbGX8uDf-d6oxuy9AUd1atyEOp7wGz5CAx2eHa7lYmukuwxUnHoYxazo3MAayebFTB12tPi85-9L3iOwZ5qX2qYn9hPJaWodjPNT2CjvBSCXt8mETRR9kLLZL7O3GZbOjjkKtoIcnw37rWAaicgyAMkdaex4kgrjSctoeXlA"
        ]
    }
}

export default function FriendProfileScreen() {
  const { profile } = useProfileContext();

  return (
    <>
      <ScrollView style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.replace('MessageScreen')}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.photoContainer}>
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
            editable={false}
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

        <View style={styles.section}>
          <Text style={styles.label}>Birth Date</Text>
          <Text style={styles.value}>
            {profile.birthDate
              ? profile.birthDate.toLocaleDateString()
              : ""}
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  backButton: {
    padding: 20,
    position: "absolute",
    zIndex: 1,

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
    backgroundColor: "red"
  },
  darkMode: {
    backgroundColor: "red",
  },
  lightMode: {
    backgroundColor: "red", 
  },
  datePicker: {
    backgroundColor: "transparent", 
  },
});
