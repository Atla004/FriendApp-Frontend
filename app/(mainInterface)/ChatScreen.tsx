import { View, StyleSheet, TextInput, FlatList, Text } from "react-native";
import { useRouter } from "expo-router";
import { ChatSection } from "@/components/ChatSection";
import { useState, useEffect } from "react";
import { Chat } from "@/schemas/types";
import { socket } from "@/utils/socket";
import { getChats } from "@/utils/fetch/fetch";
import { useUserData } from "@/context/UserDataContext";

const pathToImage =
  "https://vaippmtqyjpyxanjifki.supabase.co/storage/v1/object/public/peoplefinder-images";

export default function ChatScreen() {
  const { token } = useUserData();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);

  socket.on(
    "message",
    (
      content: string,
      type: "text" | "image",
      username: string,
      chat_id: string,
      datetime_sent: string
    ) => {
      console.log("recibidest jun mensajesl vboob maosdfjsdlfkasjdflksdfjla;ksdfj");
      console.log("Message: ", {
        content,
        username,
        chat_id,
        type,
        datetime_sent,
      });
      setChats((prevChats) => {
        const chatIndex = prevChats.findIndex((chat) => chat._id === chat_id);
        if (chatIndex !== -1) {
          const newChats = [...prevChats];
          newChats[chatIndex].last_message = {
            content,
            type,
            datetime_sent,
            author: username,
          };
          return newChats;
        }
        return prevChats;
      });
    }
  );

  useEffect(() => {
    getChats(token as string, setChats);
  }, []);

  const filteredChats = chats.filter((chat) =>
    chat.user.toLowerCase().includes(searchQuery.toLowerCase())
  );
  console.log(filteredChats.length);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search conversations..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {filteredChats.length !== 0 ? (
        <FlatList
          data={filteredChats}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <ChatSection
              chat={{
                name: item.user,
                lastMessage: item.last_message ? item.last_message.content : "",
                timestamp: item.last_message
                  ? new Date(item.last_message.datetime_sent)
                  : null,
                photo: `${pathToImage}${item.photo}`,
                lastMessageName: item.last_message
                  ? item.last_message.author
                  : "",
                type: item.last_message ? item.last_message.type : "text",
              }}
              onPress={() =>
                router.push({
                  pathname: "/(chatInterface)/MessageScreen",
                  params: { chat_id: item._id, other_username: item.user },
                })
              }
            />
          )}
        />
      ) : (
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>
            {searchQuery ? "not found" : "you don't have chats yet"}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 10,
    paddingHorizontal: 15,
    backgroundColor: "red",
  },
  searchInput: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  notFound: {
    flex: 1,
    justifyContent: "center",
    margin: 50,
  },
  notFoundText: {
    textAlign: "center",
    fontSize: 20,
    color: "#666",
  },
});
