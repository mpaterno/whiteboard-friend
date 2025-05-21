import React, { useCallback, useEffect, useState } from 'react';
import { Tldraw, useEditor, track } from '@tldraw/tldraw';
import { useSyncDemo } from '@tldraw/sync';
import CustomToolbar from './CustomToolbar';
import UserPresence from '../collaboration/UserPresence';
import RoomInfo from '../collaboration/RoomInfo';
import ChatPanel from '../chat/ChatPanel';
import { useUser } from '../../lib/hooks/useUser';
import { useRoom } from '../../lib/hooks/useRoom';
import { DEFAULT_ROOM_ID } from '../../lib/utils/constants';

interface WhiteboardCanvasProps {
  roomId?: string;
}

interface RecentRoom {
  id: string;
  timestamp: number;
  name?: string;
}

// Editor component wrapped with track to make it reactive
const EditorUI = track(() => {
  const editor = useEditor();
  const [currentTool, setCurrentTool] = useState('select');
  
  // Handle tool selection
  const handleSelectTool = useCallback((toolId: string) => {
    if (!editor) return;
    
    editor.setCurrentTool(toolId);
    setCurrentTool(toolId);
  }, [editor]);
  
  // Handle keyboard shortcuts
  useEffect(() => {
    if (!editor) return;
    
    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'v': {
          handleSelectTool('select');
          break;
        }
        case 'p':
        case 'd': {
          handleSelectTool('draw');
          break;
        }
        case 'e': {
          handleSelectTool('eraser');
          break;
        }
        case 'r': {
          handleSelectTool('rectangle');
          break;
        }
        case 'c': {
          handleSelectTool('ellipse');
          break;
        }
        case 't': {
          handleSelectTool('text');
          break;
        }
      }
    };
    
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [editor, handleSelectTool]);
  
  // Update current tool state when editor changes tools
  useEffect(() => {
    if (!editor) return;
    
    // Set initial tool
    setCurrentTool(editor.getCurrentToolId());
    
    // Poll for tool changes (simplistic approach)
    const interval = setInterval(() => {
      const toolId = editor.getCurrentToolId();
      if (toolId !== currentTool) {
        setCurrentTool(toolId);
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [editor, currentTool]);
  
  return (
    <div className="custom-layout">
      <CustomToolbar currentTool={currentTool} onSelectTool={handleSelectTool} />
    </div>
  );
});

export const WhiteboardCanvas: React.FC<WhiteboardCanvasProps> = ({ roomId = DEFAULT_ROOM_ID }) => {
  const { user } = useUser();
  const { room, joinRoom, sendMessage } = useRoom(roomId);
  const [isConnected, setIsConnected] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  
  // Use tldraw's built-in sync demo
  const syncStore = useSyncDemo({
    roomId: `whiteboard-friend-${roomId}`,
    userInfo: user ? {
      id: user.id,
      name: user.name,
      color: user.color
    } : undefined
  });
  
  // Update connection status when sync store status changes
  useEffect(() => {
    if (!syncStore) return;
    
    const connected = syncStore.status === 'synced-remote';
    setIsConnected(connected);
    
    // Don't call joinRoom here - it's handled in the other useEffect
  }, [syncStore, syncStore?.status]);
  
  // Track room in recent rooms
  useEffect(() => {
    if (roomId === DEFAULT_ROOM_ID) return;
    
    try {
      // Get existing rooms or initialize empty array
      const storedRooms = localStorage.getItem('whiteboard-recent-rooms');
      const recentRooms: RecentRoom[] = storedRooms ? JSON.parse(storedRooms) : [];
      
      // Check if room already exists in list
      const roomIndex = recentRooms.findIndex((room) => room.id === roomId);
      
      // Create new room entry
      const roomEntry: RecentRoom = {
        id: roomId,
        timestamp: Date.now(),
      };
      
      // If room exists, update it, otherwise add to beginning
      if (roomIndex >= 0) {
        recentRooms[roomIndex] = roomEntry;
      } else {
        recentRooms.unshift(roomEntry);
      }
      
      // Limit to 5 recent rooms
      const limitedRooms = recentRooms.slice(0, 5);
      
      // Save back to localStorage
      localStorage.setItem('whiteboard-recent-rooms', JSON.stringify(limitedRooms));
    } catch (err) {
      console.error('Error saving recent room:', err);
    }
  }, [roomId]);
  
  // Join room when component mounts or user changes
  useEffect(() => {
    if (user && isConnected) {
      joinRoom(user);
    }
  }, [user, joinRoom, isConnected]);
  
  // Copy room link to clipboard
  const copyRoomLink = useCallback(() => {
    const url = new URL(window.location.href);
    url.pathname = `/room/${roomId}`;
    navigator.clipboard.writeText(url.toString());
    
    // Could show a toast here
    alert('Room link copied to clipboard');
  }, [roomId]);
  
  // Handle sending a new chat message
  const handleSendMessage = useCallback((text: string) => {
    if (!user) return;
    
    sendMessage({
      sender: user,
      text,
      timestamp: Date.now()
    });
  }, [user, sendMessage]);
  
  return (
    <div className="tldraw__editor">
      <Tldraw
        store={syncStore}
        hideUi
      >
        <EditorUI />
      </Tldraw>
      
      {/* Show user presence */}
      {room && (
        <UserPresence users={room.users} />
      )}
      
      {/* Show room info */}
      <RoomInfo
        roomId={roomId}
        isConnected={isConnected}
        copyToClipboard={copyRoomLink}
      />
      
      {/* Chat panel */}
      {room && user && (
        <>
          {!chatOpen && (
            <button
              className="chat-toggle"
              onClick={() => setChatOpen(true)}
              style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                zIndex: 10000,
                padding: '8px 12px',
                borderRadius: '8px',
                backgroundColor: 'var(--primary)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 11.5C21 16.1944 16.9706 20 12 20C10.232 20 8.55892 19.5308 7.09117 18.7035L3 20L4.46902 16.3086C3.48225 14.797 3 13.0378 3 11.5C3 6.80558 7.02944 3 12 3C16.9706 3 21 6.80558 21 11.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Chat {room.messages.length > 0 && `(${room.messages.length})`}
            </button>
          )}
          
          <ChatPanel
            user={user}
            messages={room.messages}
            isOpen={chatOpen}
            onClose={() => setChatOpen(false)}
            onSendMessage={handleSendMessage}
          />
        </>
      )}
    </div>
  );
};

export default WhiteboardCanvas; 