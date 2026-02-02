import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isSystem?: boolean; // New: To identify "Session Ended" messages
}

interface ChatSession {
  patientId: string;
  patientName: string;
  doctorId: string;
  messages: Message[];
  unreadCount: number;
  isActive: boolean; // New: To track if the session is open
}

interface ChatState {
  sessions: Record<string, ChatSession>;
  addMessage: (sessionId: string, msg: Message, name: string, drId: string, isIncoming?: boolean) => void;
  endSession: (sessionId: string, systemMsg: string) => void;
  clearUnread: (chatId: string) => void;
}

export const useChatStore = create<ChatState>()(
  persist((set) => ({
    sessions: {},

    addMessage: (sessionId, message, name, drId, isIncoming = false) => set((state) => {
      const sId = String(sessionId);
      const existing = state.sessions[sId];
      
      // If session was ended, don't allow new regular messages 
      // (Optional: remove this check if you want to allow re-opening)
      if (existing && !existing.isActive && !message.isSystem) return state;

      return {
        sessions: {
          ...state.sessions,
          [sId]: {
            patientId: sId,
            patientName: existing?.patientName || name || "Patient",
            doctorId: String(drId),
            messages: [...(existing?.messages || []), message],
            unreadCount: isIncoming ? (existing?.unreadCount || 0) + 1 : (existing?.unreadCount || 0),
            isActive: existing ? existing.isActive : true, // Default to active
          },
        },
      };
    }),

    endSession: (sessionId, systemMsg) => set((state) => {
      const sId = String(sessionId);
      const existing = state.sessions[sId];
      if (!existing) return state;

      const closureMsg: Message = {
        id: crypto.randomUUID(),
        senderId: 'system',
        text: systemMsg,
        timestamp: new Date().toISOString(),
        isSystem: true
      };

      return {
        sessions: {
          ...state.sessions,
          [sId]: { ...existing, isActive: false, messages: [...existing.messages, closureMsg] }
        }
      };
    }),

    clearUnread: (chatId) => set((state) => ({
      sessions: {
        ...state.sessions,
        [chatId]: state.sessions[chatId] ? { ...state.sessions[chatId], unreadCount: 0 } : state.sessions[chatId]
      }
    }))
  }), { name: 'hi-care-chat-v5' })
);