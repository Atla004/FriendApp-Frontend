import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface ChatSectionProps {
  chat: {
    name: string;
    lastMessage: string;
    photo: string | null;
    timestamp: Date;
  };
  onPress: () => void;
}

export function ChatSection({ chat, onPress }: ChatSectionProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.photoContainer}>
        {chat.photo ? (
          <Image source={{ uri: chat.photo }} style={styles.photo} />
        ) : (
          <View style={[styles.photo, styles.photoPlaceholder]} />
        )}
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{chat.name}</Text>
          <Text style={styles.time}>
            {chat.timestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}
          </Text>
        </View>
        <Text style={styles.message} numberOfLines={1}>
          {chat.lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  photoContainer: {
    marginRight: 15,
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  photoPlaceholder: {
    backgroundColor: '#ddd',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  time: {
    fontSize: 14,
    color: '#666',
  },
  message: {
    fontSize: 14,
    color: '#666',
  },
});