import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message, User } from '../types';

interface MessagesState {
  messages: Message[];
  loading: boolean;
  error: string | null;
  unreadCount: number;
  onlineUsers: User[]; // This should use User type which now includes isOnline
}

const initialState: MessagesState = {
  messages: [],
  loading: false,
  error: null,
  unreadCount: 0,
  onlineUsers: [],
};

// Helper function to safely parse dates
const getSafeDate = (dateString: string | undefined): Date => {
  if (!dateString) return new Date(0);
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? new Date(0) : date;
};

// Helper function to sort messages by date (oldest first)
const sortMessagesByDate = (messages: Message[]): Message[] => {
  return messages.sort((a, b) => {
    const dateA = getSafeDate(a.created_at);
    const dateB = getSafeDate(b.created_at);
    return dateA.getTime() - dateB.getTime();
  });
};

export const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = sortMessagesByDate(action.payload);
      state.error = null;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      const exists = state.messages.find((msg) => msg.id === action.payload.id);
      if (!exists) {
        state.messages.push(action.payload);
        state.messages = sortMessagesByDate(state.messages);
      }
    },
    updateMessagesLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    resetUnreadCount: (state) => {
      state.unreadCount = 0;
    },
    deleteMessage: (state, action: PayloadAction<number>) => {
      state.messages = state.messages.filter(msg => msg.id !== action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    // Online users actions - FIXED: Now using proper User type
    setOnlineUsers: (state, action: PayloadAction<string[]>) => {
      state.onlineUsers = action.payload.map(username => ({
        username,
        isOnline: true, // This is now valid because User interface has isOnline
        connected_at: new Date().toISOString()
      }));
    },
    addOnlineUser: (state, action: PayloadAction<string>) => {
      const exists = state.onlineUsers.find(user => user.username === action.payload);
      if (!exists) {
        state.onlineUsers.push({
          username: action.payload,
          connected_at: new Date().toISOString()
        });
      }
    },
    removeOnlineUser: (state, action: PayloadAction<string>) => {
      state.onlineUsers = state.onlineUsers.filter(user => user.username !== action.payload);
    },
  },
});

export const { 
  setMessages, 
  addMessage, 
  updateMessagesLoading, 
  setError, 
  resetUnreadCount,
  deleteMessage,
  clearMessages,
  setOnlineUsers,
  addOnlineUser,
  removeOnlineUser
} = messagesSlice.actions;
export default messagesSlice.reducer;