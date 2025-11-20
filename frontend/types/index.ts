export interface Message {
  id?: number;
  username: string;
  content: string;
  created_at?: string;
}

export interface User {
  username: string;
  connected_at?: string;
}

export interface AuthState {
  username: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface MessagesState {
  messages: Message[];
  loading: boolean;
  error: string | null;
  unreadCount: number;
}

export interface UsersState {
  connectedUsers: string[];
  totalUsers: number;
}
