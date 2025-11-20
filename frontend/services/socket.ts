import io, { Socket } from 'socket.io-client';
import { Message } from '../types';

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || 'http://localhost:5000';

let socket: Socket | null = null;

export const socketService = {
  connect(username: string): Socket {
    if (socket?.connected) return socket;

    socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('[Socket] Connected:', socket!.id);
      socket!.emit('join_chat', username);
    });

    socket.on('disconnect', () => {
      console.log('[Socket] Disconnected');
    });

    return socket;
  },

  disconnect(): void {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },

  sendMessage(username: string, content: string): void {
    if (socket?.connected) {
      socket.emit('send_message', { username, content });
    }
  },

  onNewMessage(callback: (message: Message) => void): void {
    socket?.on('new_message', callback);
  },

  offNewMessage(): void {
    socket?.off('new_message');
  },

  // NEW: Online users socket events
  onUsersUpdate(callback: (users: string[]) => void): void {
    socket?.on('users_update', callback);
  },

  offUsersUpdate(): void {
    socket?.off('users_update');
  },
};