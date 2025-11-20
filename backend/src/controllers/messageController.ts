import { Request, Response } from 'express';
import { MessageModel } from '../models/messageModel';

export class MessageController {
  static async getMessages(req: Request, res: Response) {
    try {
      const messages = await MessageModel.getAllMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  }

  static async createMessage(req: Request, res: Response) {
    try {
      const { username, content } = req.body;
      if (!username || !content) {
        return res.status(400).json({ error: 'Username and content are required' });
      }
      const message = await MessageModel.createMessage(username, content);
      res.json(message);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create message' });
    }
  }

  static async deleteMessage(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const success = await MessageModel.deleteMessage(Number(id));
      res.json({ success });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete message' });
    }
  }
}
