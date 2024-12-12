import { View, StyleSheet, TextInput, FlatList, Text } from "react-native";
import { useRouter } from "expo-router";
import { ChatSection } from "@/components/ChatSection";
import { useState, useEffect } from "react";
import { GetChatsResponse } from "@/schemas/responses";
import { Chat } from "@/schemas/types";
import { socket } from "@/utils/socket";

const data: GetChatsResponse = {
  success: "Found Chats!",
  data: [
      {
          _id: "67561f39a2fb58994b566dee",
          user_id: "67560c703f1af4b512279772",
          user: "chantyuwu",
          photo: "/public/el_dolar-1734016293288.jpg",
          last_message: {
              content: "Welcome!",
              datetime_sent: "2024-12-12T00:16:50.716Z",
              author: "el_atla"
          }
      },
      {
          _id: "675afddec74fea6958ae5e24",
          user_id: "675a331e098fce11ff954135",
          user: "atlas",
          photo: "/public/atlas-1734013616323.jpg",
          last_message: null
      }
  ]
}


const pathToImage =
  "https://vaippmtqyjpyxanjifki.supabase.co/storage/v1/object/public/peoplefinder-images";

export default function ChatScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);

  socket.on("message", (content: string, username: string, chat_id: string) => {
    console.log("Message: ", { content, username, chat_id });
  });


  useEffect(() => setChats(data.data), []);

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
                lastMessage: item.last_message? item.last_message.content:"",
                timestamp: item.last_message ? new Date(item.last_message.datetime_sent) : null,
                photo: `${pathToImage}${item.photo}`,
                lastMessageName: item.last_message ? item.last_message.author : "",
              }}
              onPress={() =>
                router.push({
                  pathname: "/(chatInterface)/MessageScreen",
                  params: { chat_id: item._id },
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
