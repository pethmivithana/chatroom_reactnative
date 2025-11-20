import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { socketService } from '../services/socket';

interface MessageInputProps {
  username: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({ username }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    setIsSending(true);
    try {
      // Only use socket to send message - server will handle saving to DB
      // and broadcasting to all clients including sender
      socketService.sendMessage(username, message.trim());
      setMessage('');
    } catch (error) {
      console.error('[MessageInput] Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Type a message..."
        value={message}
        onChangeText={setMessage}
        editable={!isSending}
        multiline
        maxLength={500}
      />
      <TouchableOpacity
        style={[styles.sendButton, (!message.trim() || isSending) && styles.sendButtonDisabled]}
        onPress={handleSendMessage}
        disabled={!message.trim() || isSending}
      >
        {isSending ? (
          <ActivityIndicator color="#FFF" size="small" />
        ) : (
          <View style={styles.sendIcon} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    gap: 8,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#F3F3F3',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendIcon: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FFF',
    marginRight: 2,
  },
});
