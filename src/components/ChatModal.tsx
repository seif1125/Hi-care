"use client";
import { useState } from "react";
import { useChatStore } from "@/store/useChatStore";
import { useUserStore } from "@/store/useUserStore"; // Assuming token is stored here
import { useChatConnection } from "@/hooks/useChatConnection";
import { Send, X } from "lucide-react";

export default function ChatModal({ doctor, onClose }: { doctor: any, onClose: () => void }) {
  const [input, setInput] = useState("");
  const { id: patientId, token } = useUserStore(); 
  const { chats, addMessage } = useChatStore();
  const { sendMessage } = useChatConnection(patientId, token);
  
  const messages = chats[doctor.id] || [];

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Send via WebSocket
    sendMessage(doctor.id, input);
    
    // Update local store immediately
    addMessage(doctor.id, { 
      id: crypto.randomUUID(), 
      senderId: patientId, 
      text: input, 
      timestamp: new Date() 
    });
    console.log(chats);
    setInput("");
  };

  return (
    <div className="fixed inset-[0] z-[10000] flex items-center justify-center bg-[#134e4a]/60 backdrop-blur-[0.5rem] p-[1rem]">
      <div className="bg-[#ffffff] w-full max-w-[30rem] h-[35rem] rounded-[2rem] flex flex-col shadow-2xl overflow-hidden">
        {/* Same UI as before, just uses handleSend */}
        <div className="p-[1.5rem] border-b-[0.125rem] border-[#f1f5f9] flex justify-between items-center">
          <span className="font-[900] text-[#134e4a]">{doctor.name_en}</span>
          <button onClick={onClose} className="cursor-pointer"><X/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-[1.5rem] flex flex-col gap-[1rem]">
          {messages.map((m) => (
             <div key={m.id} className={`flex ${m.senderId === patientId ? 'justify-end' : 'justify-start'}`}>
               <div className={`p-[1rem] rounded-[1.25rem] font-[600] ${m.senderId === patientId ? 'bg-medical-teal text-white' : 'bg-[#f1f5f9]'}`}>
                 {m.text}
               </div>
             </div>
          ))}
        </div>

        <div className="p-[1.25rem] flex gap-[0.75rem]">
          <input 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border-[0.125rem] border-[#e2e8f0] rounded-[1rem] px-[1rem]" 
            placeholder="Type message..." 
          />
          <button onClick={handleSend} className="bg-medical-teal text-white p-[0.75rem] rounded-[1rem]"><Send/></button>
        </div>
      </div>
    </div>
  );
}