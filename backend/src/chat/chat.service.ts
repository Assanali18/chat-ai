import ChatMessage from "./models/ChatMessage";
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

class ChatService {
  async createStream(userMessage: string, callback: (data: any) => void) {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    try {
      const result = await model.generateContentStream(userMessage);
      let aiMessage = '';

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        aiMessage += chunkText;
        callback({ message: chunkText, isFinal: false });
      }

      const chatMessage = new ChatMessage({ userMessage, aiMessage });
      await chatMessage.save();

      callback({ message: '', isFinal: true });
    } catch (error) {
      console.error('Error processing Gemini AI stream:', error);
      throw new Error('Failed to process Gemini AI stream');
    }
  }
}

export default ChatService;
