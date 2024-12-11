import {
  View,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Text,
  Image,
} from "react-native";
import { useState, useRef } from "react";
import * as ImagePicker from "expo-image-picker";
import { MessageComponent } from "@/components/MessageComponent";
import { SendMessageComponent } from "@/components/SendMessageComponent";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

interface DUMMY_MESSAGES {
  id: string;
  text: string;
  timestamp: Date;
  isMine: boolean;
  image?: string;
}

const DUMMY_MESSAGES = [
  {
    id: "1",
    text: "Hey there!",
    timestamp: new Date(),
    isMine: false,
  },
  {
    id: "2",
    text: "Hi! How are you?",
    timestamp: new Date(),
    isMine: true,
  },
  // Add more dummy messages as needed
];

export default function MessageScreen() {
  const [messages, setMessages] = useState<DUMMY_MESSAGES[]>(DUMMY_MESSAGES);
  const flatListRef = useRef<FlatList>(null);

  const handleSend = (text: string) => {
    const newMessage = {
      id: Date.now().toString(),
      text,
      timestamp: new Date(),
      isMine: true,
    };
    setMessages([...messages, newMessage]);
  };

  const handleImageSend = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const newMessage = {
        id: Date.now().toString(),
        text: "",
        image: result.assets[0].uri,
        timestamp: new Date(),
        isMine: true,
      };
      setMessages([...messages, newMessage]);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/FriendProfileScreen")}
            style={styles.profileHeader}
          >
            <Image
              source={{ uri: "https://example.com/profile.jpg" }}
              style={styles.profileImage}
            />
            <Text style={styles.profileName}>User Name</Text>
          </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageComponent message={item} />}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      <SendMessageComponent
        onSend={handleSend}
        onImagePress={handleImageSend}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "#ddd",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  backButton: {
    marginHorizontal: 10, // Adjust margin to center the button
  },
  backButtonText: {
    fontSize: 24,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
});
