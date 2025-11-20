import express from 'express';
import { MessageController } from '../controllers/messageController';

const router = express.Router();

router.get('/', MessageController.getMessages);
router.post('/', MessageController.createMessage);
router.delete('/:id', MessageController.deleteMessage);

export default router;
