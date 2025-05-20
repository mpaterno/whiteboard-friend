import { NextRequest } from 'next/server';
import { TLSocketRoom } from '@tldraw/sync-core';
import { isValidRoomId } from '../../../../lib/utils/roomUtils';

// Store rooms in memory (in a production app, you'd use a database or Redis)
const rooms = new Map<string, TLSocketRoom>();

// Handle WebSocket connections
export async function GET(
  req: NextRequest,
  context: { params: { roomId: string } }
) {
  const { roomId } = context.params;
  
  // Validate the room ID
  if (!isValidRoomId(roomId)) {
    return new Response('Invalid room ID', { status: 400 });
  }
  
  // Upgrade the HTTP request to a WebSocket connection
  try {
    const { socket, response } = await (
      req as unknown as { socket: { upgrade: (req: Request) => { socket: WebSocket; response: Response } } }
    ).socket.upgrade(req as unknown as Request);
    
    // Get the session ID from the query parameters
    const url = new URL(req.url);
    const sessionId = url.searchParams.get('sessionId') || '';
    
    // Create or get the room
    let room = rooms.get(roomId);
    
    if (!room) {
      // Create a new room if it doesn't exist
      room = new TLSocketRoom({});
      rooms.set(roomId, room);
      
      console.log(`Created new room: ${roomId}`);
    }
    
    // Handle the socket connection
    room.handleSocketConnect({
      sessionId,
      socket: {
        send: (data) => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(data);
          }
        },
        close: () => {
          if (socket.readyState !== WebSocket.CLOSED) {
            socket.close();
          }
        },
        addEventListener: (event, handler) => {
          if (event === 'message') {
            socket.addEventListener(event, (e) => {
              room?.handleSocketMessage(sessionId, e.data);
            });
          } else if (event === 'close') {
            socket.addEventListener(event, handler);
          } else if (event === 'error') {
            socket.addEventListener(event, handler);
          }
        },
        // Add readyState property to comply with WebSocketMinimal interface
        get readyState() {
          return socket.readyState;
        }
      },
    });
    
    return response;
  } catch (error) {
    console.error('WebSocket upgrade error:', error);
    return new Response('Failed to upgrade connection to WebSocket', { status: 500 });
  }
} 