export interface Message {
  id?: number;
  username: string;
  content: string;
  created_at?: string;
  // Remove isOnline completely - it doesn't belong in Message
}

export interface User {
  username: string;
  connected_at?: string;
  isOnline: boolean;
}