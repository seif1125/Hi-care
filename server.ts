import { WebSocketServer, WebSocket } from 'ws';
import * as jwt from 'jsonwebtoken';
import { IncomingMessage } from 'http';

interface UserJwtPayload extends jwt.JwtPayload {
  id: string;
  name: string;
  role: 'patient' | 'doctor';
}

const JWT_SECRET = process.env.JWT_SECRET || 'hc_88255495708_secure_chat_gateway_2026_primary';
const wss = new WebSocketServer({ port: 8080 });
const clients = new Map<string, WebSocket>();

wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
  try {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const token = url.searchParams.get('token');
    
    if (!token) throw new Error("Unauthorized");
    const decoded = jwt.verify(token, JWT_SECRET) as UserJwtPayload;
    
    clients.set(decoded.id, ws);
    console.log(`✅ ${decoded.role}: ${decoded.name} connected`);

    ws.on('message', (data) => {
      const { recipientId, text } = JSON.parse(data.toString());
      const target = clients.get(recipientId);

      if (target && target.readyState === WebSocket.OPEN) {
        target.send(JSON.stringify({
          senderId: decoded.id,
          senderName: decoded.name,
          text,
          timestamp: new Date().toISOString()
        }));
      }
    });

    ws.on('close', () => clients.delete(decoded.id));
  } catch (err) {
    ws.close(4001);
  }
});