import { Router } from 'express';
import { Server, WebSocket } from 'ws';
import ChatService from './chat.service';
import ChatController from './chat.controller';
import ChatMessage from './models/ChatMessage';

const chatRouter = Router();
const chatService = new ChatService();
const chatController = new ChatController(chatService);
const wss = new Server({ noServer: true });

wss.on('connection', (ws: WebSocket) => {
  ws.on('message', async (message: string) => {
    const userMessage = message.toString();
    await chatController.handleWebSocketConnection(ws, userMessage);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });


});

chatRouter.get('/chat', (req, res) => {
  res.send('Chat API is running');
});

chatRouter.get('/history', async (req, res) => {
  try {
    const history = await ChatMessage.find().sort({ createdAt: 1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve chat history' });
  }
});

export { chatRouter, wss };
