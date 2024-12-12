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
import { useState, useRef, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { MessageComponent } from "@/components/MessageComponent";
import { SendMessageComponent } from "@/components/SendMessageComponent";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { joinChat, socket } from "@/utils/socket";
import { getMessage, postImageMessage, postTextMessage } from "@/utils/fetch/fetch";
import { useUserData } from "@/context/UserDataContext";


interface DUMMY_MESSAGES {
  id: string;
  text: string;
  timestamp: Date;
  isMine: boolean;
  image?: string;
}

export default function MessageScreen() {
  const [messages, setMessages] = useState<DUMMY_MESSAGES[]>([]);
  const flatListRef = useRef<FlatList>(null);
  const { chat_id, other_username } = useLocalSearchParams()
  const { token, username, _id } = useUserData()

  useEffect(() => {
    getMessage(chat_id as string, token as string, setMessages, _id as string)
  }, []);

  joinChat(chat_id as string)
  socket.on('message', (content: string, type: string, got_username: string, chat_id: string, datetime: string) => {
    console.log("Message: ",{content, type, username: got_username, chat_id});
    const recievedMessage = {
      id: Date.now().toString(),
      timestamp: new Date(datetime),
      isMine: false
    } 
    if (got_username === username)
      return;

    const messageContent = type === "text" ? { text: content } : { text: "", image: content }
    setMessages([...messages, { ...recievedMessage, ...messageContent }])
  })

  const handleSend = (text: string) => {
    const newMessage = {
      id: Date.now().toString(),
      text,
      timestamp: new Date(),
      isMine: true,
    };
    postTextMessage(token as string, chat_id as string, text)
    .then(() => {
      setMessages([...messages, newMessage]);
    })
    .catch((error) => {
      console.error("Error sending message")
      console.error(error)
    })
  };

  const handleImageSend = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
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
      postImageMessage(token as string, chat_id as string, result.assets[0].uri)
      .then(() => {
        setMessages([...messages, newMessage]);
      })
      .catch((error) => {
        console.error("Error sending message")
        console.error(error)  
      })
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
          onPress={() => router.push("/ChatScreen")}
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
            <Text style={styles.profileName}>{other_username as string}</Text>
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
