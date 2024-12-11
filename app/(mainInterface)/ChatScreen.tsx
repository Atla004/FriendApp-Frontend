import { View, StyleSheet, TextInput, FlatList, Text } from "react-native";
import { useRouter } from "expo-router";
import { ChatSection } from "@/components/ChatSection";
import { useState } from "react";

const DUMMY_CHATS = [
  {
    id: "1",
    name: "Sarah Smith",
    lastMessage: "Hey, how are you?",
    photo: null,
    timestamp: new Date(),
  },
  {
    id: "2",
    name: "John Doe",
    lastMessage: "I'm good, you?",
    photo: null,
    timestamp: new Date(),
  }
];

export default function ChatScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = DUMMY_CHATS.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
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
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatSection
              chat={item}
              onPress={() =>
                router.push({
                  pathname: "/(chatInterface)/MessageScreen",
                  params: { userId: item.id },
                })
              }
            />
          )}
        />
      ) : (
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>{searchQuery? "not found": "you don't have chats yet"}</Text>
        </View>
      )}


    </View>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
    margin: 50
  },
  notFoundText: {
    textAlign: "center",
    fontSize: 20,
    color: "#666",

  },
});
