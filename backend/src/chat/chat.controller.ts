import ChatService from './chat.service';

class ChatController {
  private chatService: ChatService;

  constructor(chatService: ChatService) {
    this.chatService = chatService;
  }

  async handleWebSocketConnection(ws: WebSocket, userMessage: string) {
    try {
      await this.chatService.createStream(userMessage, (data) => {
        ws.send(JSON.stringify(data));
      });
    } catch (error) {
      console.error('Error in handleWebSocketConnection:', error);
      ws.send(JSON.stringify({ error: 'Failed to process chat response' }));
    }
  }
}

export default ChatController;
