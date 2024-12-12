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
      users: [
        {
          username: "el_dolar",
        },
      ],
      __v: 0,
      last_message: {
        datetime_sent: "2024-12-08T23:06:33.117Z",
        content: "E",
        author: {
          username: "el_atla",
        },
      },
    },
  ],
};


export default function ChatScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);

  socket.on('message', (content: string, username: string, chat_id: string) => {
    console.log("Message: ",{content, username, chat_id});
  })

  const transformToChats = (response: GetChatsResponse): Chat[] => {
    return response.data.map(chat => ({
      _id: chat._id,
      users: chat.users.map(user => user.username).join(", "),
      last_message: {
        datetime_sent: chat.last_message.datetime_sent,
        content: chat.last_message.content,
        author: chat.last_message.author.username,
      },
    }));
  };

  useEffect(() => setChats(transformToChats(data)), []);
  

  const filteredChats = chats.filter((chat) =>
    chat.users.toLowerCase().includes(searchQuery.toLowerCase())
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
              chat={ 
                {
                  name: item.users,
                  lastMessage: item.last_message.content,
                  timestamp: new Date(item.last_message.datetime_sent),
                  photo: "https://example",
                }
                


              }
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
