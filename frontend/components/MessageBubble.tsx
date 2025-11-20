import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isCurrentUser }) => {
  return (
    <View style={[styles.container, isCurrentUser && styles.currentUserContainer]}>
      <View style={[styles.bubble, isCurrentUser && styles.currentUserBubble]}>
        <Text style={[styles.username, isCurrentUser && styles.currentUserUsername]}>
          {message.username}
        </Text>
        <Text style={[styles.content, isCurrentUser && styles.currentUserContent]}>
          {message.content}
        </Text>
        <Text style={[styles.timestamp, isCurrentUser && styles.currentUserTimestamp]}>
          {new Date(message.created_at || '').toLocaleTimeString()}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    marginVertical: 8,
    marginHorizontal: 16,
  },
  currentUserContainer: {
    alignItems: 'flex-end',
  },
  bubble: {
    maxWidth: '80%',
    backgroundColor: '#E5E5EA',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  currentUserBubble: {
    backgroundColor: '#007AFF',
  },
  username: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  currentUserUsername: {
    color: '#FFF',
  },
  content: {
    fontSize: 16,
    color: '#000',
  },
  currentUserContent: {
    color: '#FFF',
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  currentUserTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
});
