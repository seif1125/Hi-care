import { WebSocketServer, WebSocket } from 'ws';
import * as jwt from 'jsonwebtoken';
import { IncomingMessage } from 'http';

// --- Types & Interfaces ---

interface UserJwtPayload extends jwt.JwtPayload {
  id: string;
  role: 'patient' | 'doctor';
}

interface ChatPayload {
  recipientId: string;
  text: string;
}

// Extend the WebSocket type to store user info directly on the socket
interface AuthenticatedSocket extends WebSocket {
  userId?: string;
  userRole?: string;
}

// --- Configuration ---

const PORT = 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';

const wss = new WebSocketServer({ port: PORT });
const clients = new Map<string, AuthenticatedSocket>();

console.log(`🚀 Secure WebSocket Server running on ws://localhost:${PORT}`);

// --- Server Logic ---

wss.on('connection', (ws: AuthenticatedSocket, req: IncomingMessage) => {
  try {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const token = url.searchParams.get('token');

    // if (!token) {
    //   throw new Error("No token provided");
    // }

    // Verify and Type-cast the JWT
    const decoded = jwt.verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlVTUl9rMWoxNTRvaGQiLCJlbWFpbCI6InNlaWZhbW1hcjExMjVAZ21haWwuY29tIiwicm9sZSI6InBhdGllbnQiLCJpYXQiOjE3Njk0NDE4NjcsImV4cCI6MTc3MDA0NjY2N30.8KvAOs0B2aB-EYl_nXy5MF7NbH-eyvoHAtpyCyteINg', JWT_SECRET) as UserJwtPayload;
    
    const { id: userId, role: userRole } = decoded;

    // Attach identity to the socket and store in Map
    ws.userId = userId;
    ws.userRole = userRole;
    clients.set(userId, ws);

    console.log(`✅ Authenticated: ${userRole.toUpperCase()} (${userId}) connected`);

    ws.on('message', (data: string) => {
      try {
        const payload: ChatPayload = JSON.parse(data.toString());
        const { recipientId, text } = payload;

        // Routing Logic
        const recipientSocket = clients.get(recipientId);
        
        if (recipientSocket && recipientSocket.readyState === WebSocket.OPEN) {
          recipientSocket.send(JSON.stringify({
            senderId: userId,
            text: text,
            timestamp: new Date().toISOString()
          }));
        } else {
          console.log(`⚠️ Recipient ${recipientId} is offline.`);
        }
      } catch (err) {
        console.error("❌ Malformed message received:", err);
      }
    });

    ws.on('close', () => {
      if (ws.userId) {
        clients.delete(ws.userId);
        console.log(`ℹ️ User ${ws.userId} disconnected`);
      }
    });

    ws.on('error', (error) => {
      console.error(`🔌 Socket error for user ${userId}:`, error);
    });

  } catch (err: any) {
    console.error("🔒 Auth Failed:", err.message);
    ws.close(4001, "Unauthorized");
  }
}); 