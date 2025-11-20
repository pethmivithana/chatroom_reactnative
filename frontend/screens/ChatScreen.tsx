import React, { useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import {
  setMessages,
  addMessage,
  updateMessagesLoading,
  clearMessages,
  setOnlineUsers,
} from '../store/messagesSlice';
import { logout } from '../store/userSlice';
import { messageService } from '../services/api';
import { socketService } from '../services/socket';
import { MessageBubble } from '../components/MessageBubble';
import { MessageInput } from '../components/MessageInput';
import { OnlineUsers } from '../components/OnlineUsers'; // Make sure this is imported
import { Message } from '../types';
import { router } from 'expo-router';

export const ChatScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { username } = useSelector((state: RootState) => state.user);
  const { messages, loading, onlineUsers } = useSelector((state: RootState) => state.messages);

  if (!username) {
    router.replace('/');
    return null;
  }

  useEffect(() => {
    const initializeChat = async () => {
      try {
        dispatch(updateMessagesLoading(true));

        // Load old messages
        const fetchedMessages = await messageService.getMessages();
        dispatch(setMessages(fetchedMessages));

        // Connect socket
        socketService.connect(username);

        // Listen for new messages
        socketService.onNewMessage((newMessage: Message) => {
          dispatch(addMessage(newMessage));
        });

        // Listen for online users updates
        socketService.onUsersUpdate((users: string[]) => {
          console.log('Online users updated:', users); // Debug log
          dispatch(setOnlineUsers(users));
        });

      } catch (error) {
        console.error('[ChatScreen] Failed to initialize chat:', error);
      } finally {
        dispatch(updateMessagesLoading(false));
      }
    };

    initializeChat();

    return () => {
      socketService.offNewMessage();
      socketService.offUsersUpdate();
      socketService.disconnect();
    };
  }, [username, dispatch]);

  const handleLogout = () => {
    socketService.disconnect();
    socketService.offNewMessage();
    socketService.offUsersUpdate();
    dispatch(logout());
    dispatch(clearMessages());
    router.replace('/');
  };

  if (loading && messages.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading messages...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Messages</Text>
          <Text style={styles.headerSubtitle}>
            Logged in as {username} • {onlineUsers.length} online
          </Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Online Users Component - This shows the list */}
      <OnlineUsers />

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <MessageBubble
            message={item}
            isCurrentUser={item.username === username}
          />
        )}
        contentContainerStyle={styles.messagesList}
        onEndReachedThreshold={0.5}
        inverted={false}
      />

      <MessageInput username={username} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
  },
  logoutText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  messagesList: {
    paddingVertical: 8,
  },
});