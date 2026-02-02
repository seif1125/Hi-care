"use client";
import { useState, useEffect, useRef } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useChatStore } from "@/store/useChatStore";
import { Send, X, AlertCircle } from "lucide-react";
import { useLocale } from "next-intl";
import Image from "next/image";

export default function ChatModal({ doctor, onClose }: { doctor: any, onClose: () => void }) {
  const { id: patientId, token, name: patientName } = useUserStore();
  const { sessions, addMessage, endSession } = useChatStore();
  const locale = useLocale();
  const [input, setInput] = useState("");
  const socketRef = useRef<WebSocket | null>(null);

  const currentSession = sessions[doctor?.id];
  const drName = locale === "en" ? doctor?.name_en : doctor?.name_ar;

  useEffect(() => {
    if (!token || !doctor?.id) return;

    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}?token=${token}`);
    socketRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      // Handle Doctor Leaving
      if (data.type === "LEAVE") {
        endSession(doctor.id, `Dr. ${drName} has left the chat. Session ended.`);
        return;
      }

      // Handle Normal Message
      if (data.senderId === doctor.id) {
        addMessage(
          doctor.id, 
          { 
            id: crypto.randomUUID(), 
            senderId: data.senderId, 
            text: data.text, 
            timestamp: data.timestamp || new Date().toISOString() 
          }, 
          drName,
          doctor.id,
          true
        );
      }
    };

    return () => ws.close();
  }, [token, doctor?.id, addMessage, endSession, drName]);

  const handleCloseAttempt = () => {
    if (!currentSession?.isActive) {
      onClose(); // Just close if already inactive
      return;
    }

    if (window.confirm("End this consultation session? The doctor will be notified.")) {
      // Notify doctor via WebSocket
      socketRef.current?.send(JSON.stringify({ 
        type: "LEAVE", 
        recipientId: doctor.id, 
        senderName: patientName 
      }));

      // Update local store to lock the chat
      endSession(doctor.id, "You have ended the session.");
      onClose();
    }
  };

  const send = () => {
    if (!input.trim() || !socketRef.current || !currentSession?.isActive) return;

    socketRef.current.send(JSON.stringify({ 
      recipientId: doctor.id, 
      senderName: patientName, 
      text: input 
    }));

    addMessage(
      doctor.id, 
      { 
        id: crypto.randomUUID(), 
        senderId: patientId, 
        text: input, 
        timestamp: new Date().toISOString() 
      },
      drName,
      doctor.id
    );

    setInput("");
  };

  if (!doctor) return null;

  const messages = currentSession?.messages || [];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[999999]">
      <div className="bg-white w-full max-w-md h-[600px] rounded-[2rem] flex flex-col overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="p-[1.25rem] bg-medical-teal text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden border-2 border-white/20">
              <Image src={doctor.image || "/default-dr.png"} alt="Doctor" fill className="object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-[1.125rem] font-black leading-tight">{drName}</span>
              <span className="text-[0.7rem] font-bold opacity-80 uppercase tracking-wider">
                {currentSession?.isActive ? "Live Consultation" : "Session Closed"}
              </span>
            </div>
          </div>
        
          <button onClick={handleCloseAttempt} className="hover:bg-white/20 p-2 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-[1.25rem] space-y-[1rem] bg-slate-50/50">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.isSystem ? 'justify-center' : m.senderId === patientId ? 'justify-end' : 'justify-start'}`}>
              {m.isSystem ? (
                <div className="bg-slate-200/60 text-slate-500 px-4 py-1.5 rounded-full text-[0.7rem] font-bold uppercase tracking-wider flex items-center gap-2">
                   <AlertCircle size={12} /> {m.text}
                </div>
              ) : (
                <div className={`p-[1rem] rounded-[1.25rem] max-w-[85%] font-semibold text-[0.875rem] shadow-sm ${
                  m.senderId === patientId ? 'bg-medical-teal text-white rounded-tr-none' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Footer */}
        <div className="p-[1.25rem] bg-white border-t border-slate-100">
          {!currentSession?.isActive ? (
            <div className="bg-red-50 text-red-500 p-4 rounded-[1.25rem] text-center font-bold text-[0.85rem] border border-red-100">
              This session has ended. You cannot send further messages.
            </div>
          ) : (
            <div className="flex gap-2">
              <input 
                value={input} 
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                className="flex-1 border-2 border-slate-100 p-[0.85rem] rounded-[1.25rem] outline-none focus:border-medical-teal transition-all font-medium" 
                placeholder="Describe your symptoms..." 
              />
              <button 
                onClick={send} 
                className="bg-medical-teal text-white px-5 rounded-[1.25rem] flex items-center justify-center active:scale-90 transition-transform"
              >
                <Send size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}