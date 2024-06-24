import { Schema, model, Document } from 'mongoose';

interface IChatMessage extends Document {
    userMessage: string;
    aiMessage: string;
    createdAt: Date;
}

const chatMessageSchema = new Schema<IChatMessage>({
    userMessage: { type: String, required: true },
    aiMessage: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const ChatMessage = model<IChatMessage>('ChatMessage', chatMessageSchema);

export default ChatMessage;
