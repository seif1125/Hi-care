"use client";
import { useState, useEffect, useRef } from "react";
import { useChatStore } from "@/store/useChatStore";
import { useAppointmentStore } from "@/store/useAppointmentsStore";
import { loginDoctor } from "@/actions/auth";
import { MessageSquare, Calendar, LogOut, Send, AlertCircle } from "lucide-react";
import { useDoctorStore } from "@/store/useDoctorStore";

export default function DoctorDashboard() {
  const [pin, setPin] = useState("");
  const [view, setView] = useState<"appointments" | "chats">("appointments");
  
  const { sessions, addMessage, clearUnread, endSession } = useChatStore();
  const { appointments } = useAppointmentStore();
  const { drId, drToken, setDrAuth, clearDrAuth } = useDoctorStore();
  
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const socketRef = useRef<WebSocket | null>(null);
  const chatSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    chatSound.current = new Audio("/chat-pop.mp3");
  }, []);

  const handleLogin = async () => {
    const res = await loginDoctor(pin);
    if (res.success) {
      setDrAuth(res.id, res.name, res.image || "/default-dr.png", res?.token || '');
    } else {
      alert(res.error);
    }
  };

  useEffect(() => {
    if (!drToken || !drId) return;
    
    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}?token=${drToken}`);
    socketRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      // 1. Handle Patient Leaving
      if (data.type === "LEAVE") {
        endSession(String(data.senderId), `Patient ${data.senderName} has left the chat. Session ended.`);
        return;
      }

      // 2. Handle Incoming Message
      chatSound.current?.play().catch(() => {});
      const patientId = String(data.senderId);

      addMessage(
        patientId, 
        { 
          id: crypto.randomUUID(), 
          senderId: patientId, 
          text: data.text, 
          timestamp: data.timestamp || new Date().toISOString() 
        }, 
        data.senderName, 
        drId, 
        true 
      );
    };

    return () => ws.close();
  }, [drToken, drId, addMessage, endSession]);

  const sendReply = () => {
    if (!activeChatId || !reply.trim() || !drId) return;

    // Check if session is still active before sending
    if (!sessions[activeChatId]?.isActive) return;

    socketRef.current?.send(JSON.stringify({ 
      recipientId: activeChatId, 
      text: reply 
    }));

    addMessage(
      activeChatId, 
      { 
        id: crypto.randomUUID(), 
        senderId: String(drId), 
        text: reply, 
        timestamp: new Date().toISOString() 
      }, 
      sessions[activeChatId]?.patientName || "Patient", 
      drId, 
      false 
    );
    setReply("");
  };

  if (!drToken) return (
    <div className="h-screen flex items-center justify-center bg-[#f8fafc]">
      <div className="p-[3rem] bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(19,78,74,0.1)] border border-[#f1f5f9] w-full max-w-[28rem] text-center">
        <div className="w-[5rem] h-[5rem] bg-medical-teal/10 rounded-[1.5rem] flex items-center justify-center mx-auto mb-[2rem]">
          <Calendar className="text-medical-teal" size="2.5rem" />
        </div>
        <h2 className="text-[1.5rem] font-[900] text-slate-800 mb-[0.5rem]">Provider Portal</h2>
        <p className="text-slate-400 font-medium mb-[2rem]">Enter your unique Doctor PIN to access</p>
        <input 
          type="password" 
          value={pin} 
          onChange={e => setPin(e.target.value)} 
          className="w-full border-2 border-[#f1f5f9] p-[1.25rem] rounded-[1.25rem] mb-[1.5rem] outline-none focus:border-medical-teal transition-all text-center text-[1.25rem] tracking-[0.5rem] font-bold" 
          placeholder="••••" 
        />
        <button 
          onClick={handleLogin} 
          className="w-full bg-medical-teal text-[white] py-[1.25rem] rounded-[1.25rem] font-[800] text-[1.125rem] active:scale-[0.98] transition-all"
        >
          Verify & Access
        </button>
      </div>
    </div>
  );

  const currentSession = activeChatId ? sessions[activeChatId] : null;

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      {/* SIDE NAV */}
      <aside className="w-[6rem] md:w-[18rem] bg-white border-r border-[#f1f5f9] flex flex-col">
        <div className="p-[2rem] border-b border-[#f1f5f9]">
          <h1 className="text-medical-teal font-[900] text-[1.25rem] hidden md:block">Hi-Care <span className="text-slate-300">Dr.</span></h1>
        </div>
        <nav className="flex-1 p-[1rem] space-y-[0.75rem]">
          <button onClick={() => setView("appointments")} className={`w-full flex items-center gap-[1rem] p-[1rem] rounded-[1.25rem] transition-all ${view === "appointments" ? "bg-medical-teal text-[white]" : "text-slate-400 hover:bg-slate-50"}`}>
            <Calendar size="1.5rem" /><span className="font-[800] hidden md:block">Appointments</span>
          </button>
          <button onClick={() => setView("chats")} className={`w-full flex items-center gap-[1rem] p-[1rem] rounded-[1.25rem] transition-all ${view === "chats" ? "bg-medical-teal text-[white]" : "text-slate-400 hover:bg-slate-50"}`}>
            <MessageSquare size="1.5rem" /><span className="font-[800] hidden md:block">Patient Chats</span>
          </button>
        </nav>
        <button onClick={clearDrAuth} className="p-[2rem] flex items-center gap-[1rem] text-slate-400 font-bold border-t border-[#f1f5f9] hover:text-red-500 transition-colors">
          <LogOut size="1.25rem" /><span className="hidden md:block">Logout</span>
        </button>
      </aside>

      {/* CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {view === "appointments" ? (
          <div className="p-[3rem] overflow-y-auto">
            <h2 className="text-[2rem] font-[900] text-slate-800 mb-[2rem]">Upcoming Appointments</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[1.5rem]">
              {appointments.map((apt: any) => (
                <div key={apt.id} className="bg-white p-[2rem] rounded-[2rem] border border-[#f1f5f9] shadow-sm flex justify-between items-center">
                  <div>
                    <h4 className="text-[1.25rem] font-[800] text-slate-800">{apt.patientName}</h4>
                    <p className="text-slate-400 font-medium">{apt.date} • {apt.time}</p>
                  </div>
                  <span className="bg-teal-50 text-medical-teal px-[1rem] py-[0.5rem] rounded-[0.75rem] font-bold text-[0.875rem]">Confirmed</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex h-full">
            {/* Chat List */}
            <div className="w-[24rem] border-r border-[#f1f5f9] bg-white overflow-y-auto">
              {Object.values(sessions)
                .filter(s => String(s.doctorId) === String(drId))
                .sort((a, b) => (b.isActive === a.isActive ? 0 : b.isActive ? 1 : -1)) // Active chats first
                .map(s => (
                <button key={s.patientId} onClick={() => { setActiveChatId(s.patientId); clearUnread(s.patientId); }} className={`w-full p-[1.5rem] text-left border-b border-[#f8fafc] transition-all flex justify-between items-center ${activeChatId === s.patientId ? 'bg-slate-50 border-r-4 border-medical-teal' : 'hover:bg-slate-50/50'} ${!s.isActive ? 'opacity-60' : ''}`}>
                  <div>
                    <p className="font-[800] text-slate-800">{s.patientName}</p>
                    <p className="text-[0.75rem] text-slate-400 truncate w-[12rem]">{!s.isActive ? "Session Closed" : (s.messages[s.messages.length - 1]?.text || "No messages")}</p>
                  </div>
                  {s.unreadCount > 0 && s.isActive && <span className="bg-medical-teal text-[white] w-[1.5rem] h-[1.5rem] flex items-center justify-center rounded-full text-[0.7rem] font-black">{s.unreadCount}</span>}
                </button>
              ))}
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col bg-white">
              {activeChatId && currentSession ? (
                <>
                  <div className="flex-1 p-[2rem] overflow-y-auto space-y-[1.5rem] bg-[#f8fafc]/50">
                    {currentSession.messages.map(m => (
                      <div key={m.id} className={`flex ${m.isSystem ? 'justify-center' : String(m.senderId) === String(drId) ? 'justify-end' : 'justify-start'}`}>
                        {m.isSystem ? (
                          <div className="flex items-center gap-2 bg-slate-200/50 text-slate-500 px-4 py-1.5 rounded-full text-[0.7rem] font-bold uppercase tracking-wider">
                            <AlertCircle size="0.8rem" /> {m.text}
                          </div>
                        ) : (
                          <div className={`p-[1.25rem] rounded-[1.5rem] max-w-[70%] font-semibold shadow-sm ${String(m.senderId) === String(drId) ? 'bg-medical-teal text-[white] rounded-tr-none' : 'bg-white border border-[#f1f5f9] text-slate-700 rounded-tl-none'}`}>
                            {m.text}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="p-[1.5rem] border-t border-[#f1f5f9] bg-white">
                    {!currentSession.isActive ? (
                      <div className="bg-red-50 text-red-500 p-4 rounded-[1.25rem] text-center font-bold text-[0.875rem] border border-red-100 flex items-center justify-center gap-2">
                        <AlertCircle size="1.25rem" />
                        The patient has left the chat. This session is now closed.
                      </div>
                    ) : (
                      <div className="flex gap-[1rem]">
                        <input value={reply} onChange={e => setReply(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendReply()} className="flex-1 bg-[#f8fafc] border-none p-[1.25rem] rounded-[1.25rem] outline-none focus:ring-2 ring-medical-teal/10 font-medium" placeholder="Type medical response..." />
                        <button onClick={sendReply} className="bg-medical-teal text-[white] px-[2rem] rounded-[1.25rem] font-black flex items-center gap-2 active:scale-[0.95] transition-all">
                          <Send size="1.25rem" /><span>Send</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                  <MessageSquare size="4rem" className="mb-[1rem] opacity-20" />
                  <p className="font-[900] uppercase tracking-widest">Select Patient Session</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}