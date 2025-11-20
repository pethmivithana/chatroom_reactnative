import { Message } from '../types';
import pool from '../config/database';

export class MessageModel {
  static async getAllMessages(): Promise<Message[]> {
    const [rows] = await pool.query('SELECT * FROM messages ORDER BY created_at ASC');
    return rows as Message[];
  }

  static async createMessage(username: string, content: string): Promise<Message> {
    const [result] = await pool.query(
      'INSERT INTO messages (username, content) VALUES (?, ?)',
      [username, content]
    );
    
    // Return without isOnline since it's removed from Message interface
    return { 
      id: (result as any).insertId, 
      username, 
      content 
      // created_at will be set by database automatically
    };
  }

  static async deleteMessage(id: number): Promise<boolean> {
    const [result] = await pool.query('DELETE FROM messages WHERE id = ?', [id]);
    return (result as any).affectedRows > 0;
  }
}