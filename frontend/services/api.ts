import axios from 'axios';
import { Message } from '../types';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 10000,
});

export const messageService = {
  async getMessages(): Promise<Message[]> {
    try {
      const response = await api.get('/messages');
      return response.data;
    } catch (error) {
      console.error('[API] Failed to fetch messages:', error);
      throw error;
    }
  },

  async sendMessage(username: string, content: string): Promise<Message> {
    try {
      const response = await api.post('/messages', { username, content });
      return response.data;
    } catch (error) {
      console.error('[API] Failed to send message:', error);
      throw error;
    }
  },

  async deleteMessage(id: number): Promise<boolean> {
    try {
      const response = await api.delete(`/messages/${id}`);
      return response.data.success;
    } catch (error) {
      console.error('[API] Failed to delete message:', error);
      throw error;
    }
  },
};
