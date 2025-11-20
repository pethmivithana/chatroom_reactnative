import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export const OnlineUsers: React.FC = () => {
  const { onlineUsers } = useSelector((state: RootState) => state.messages);
  const { username } = useSelector((state: RootState) => state.user);

  if (onlineUsers.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Online Users ({onlineUsers.length})</Text>
      <View style={styles.usersList}>
        {onlineUsers.map((user) => (
          <View key={user.username} style={styles.userItem}>
            <View style={[styles.statusDot, styles.statusOnline]} />
            <Text style={[
              styles.username,
              user.username === username && styles.currentUser
            ]}>
              {user.username} {user.username === username && '(You)'}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  usersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#999',
    marginRight: 6,
  },
  statusOnline: {
    backgroundColor: '#4CAF50',
  },
  username: {
    fontSize: 12,
    color: '#333',
  },
  currentUser: {
    fontWeight: '600',
    color: '#007AFF',
  },
});