import React, { useCallback, useEffect, useState } from 'react';
import { Tldraw, useEditor, track } from '@tldraw/tldraw';
import CustomToolbar from './CustomToolbar';
import UserPresence from '../collaboration/UserPresence';
import RoomInfo from '../collaboration/RoomInfo';
import ChatPanel from '../chat/ChatPanel';
import { useUser } from '../../lib/hooks/useUser';
import { useRoom } from '../../lib/hooks/useRoom';
import { useSync } from '../../lib/hooks/useSync';
import { DEFAULT_ROOM_ID } from '../../lib/utils/constants';

interface WhiteboardCanvasProps {
  roomId?: string;
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
  const { syncStore, isConnected } = useSync(roomId);
  const [chatOpen, setChatOpen] = useState(false);
  
  // Join room when component mounts
  useEffect(() => {
    if (user) {
      joinRoom(user);
    }
  }, [user, joinRoom]);
  
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
        <UserPresence users={room.users} roomId={roomId} />
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
                cursor: 'pointer'
              }}
            >
              Open Chat
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