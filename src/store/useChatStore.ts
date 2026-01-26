import { create } from 'zustand';

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
}

interface ChatState {
  // Keyed by the "other person's" ID (PatientID for Dr, DrID for Patient)
  chats: Record<string, Message[]>;
  addMessage: (chatId: string, msg: Message) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  chats: {},
  addMessage: (chatId, msg) => set((state) => ({
    chats: {
      ...state.chats,
      [chatId]: [...(state.chats[chatId] || []), msg]
    }
  })),
}));