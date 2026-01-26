"use client";
import { useState, useEffect, useRef } from "react";
import { useChatStore } from "@/store/useChatStore";

export default function DoctorDashboard() {
  const drId = "dr_001"; // Real ID from Auth
  const socketRef = useRef<WebSocket | null>(null);
  const { chats, addMessage } = useChatStore();
  const [activePatientId, setActivePatientId] = useState<string | null>(null);
  const [reply, setReply] = useState("");

  useEffect(() => {
    socketRef.current = new WebSocket(`ws://localhost:8080?id=${drId}`);
    
    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Keyed by senderId (The Patient)
      addMessage(data.senderId, { id: crypto.randomUUID(), senderId: data.senderId, text: data.text, timestamp: new Date() });
    };

    return ()  => socketRef.current?.close();
  }, [addMessage]);

   console.log(chats,'ch');
  const handleReply = () => {
    if (!activePatientId || !reply.trim()) return;
    socketRef.current?.send(JSON.stringify({ recipientId: activePatientId, text: reply }));
    addMessage(activePatientId, { id: crypto.randomUUID(), senderId: drId, text: reply, timestamp: new Date() });
    setReply("");
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] bg-white">
      {/* Sidebar */}
      <div className="w-[20rem] border-r-[0.125rem] border-[#f1f5f9] overflow-y-auto">
        {Object.keys(chats).map(id => (
          <button key={id} onClick={() => setActivePatientId(id)} className={`w-full p-[1.5rem] text-left border-b-[0.125rem] border-[#f1f5f9] ${activePatientId === id ? 'bg-medical-teal/5' : ''}`}>
            <span className="font-[900] text-[#134e4a]">Patient ID: {id}</span>
          </button>
        ))}
      </div>
      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {activePatientId ? (
          <>
            <div className="flex-1 p-[2rem] overflow-y-auto">
               {(chats[activePatientId] || []).map(m => (
                 <div key={m.id} className={`mb-[1rem] flex ${m.senderId === drId ? 'justify-end' : 'justify-start'}`}>
                   <div className={`p-[1rem] rounded-[1rem] font-[600] ${m.senderId === drId ? 'bg-medical-teal text-white' : 'bg-[#f1f5f9]'}`}>{m.text}</div>
                 </div>
               ))}
            </div>
            <div className="p-[1.5rem] border-t-[0.125rem] border-[#f1f5f9] flex gap-[1rem]">
              <input value={reply} onChange={(e)=>setReply(e.target.value)} className="flex-1 p-[1rem] border-[0.125rem] border-[#e2e8f0] rounded-[1.25rem] outline-none"/>
              <button onClick={handleReply} className="bg-medical-teal text-white px-[2rem] rounded-[1.25rem] font-[800] cursor-pointer">Send Reply</button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 font-[800]">Select a patient to start chatting</div>
        )}
      </div>
    </div>
  );
}