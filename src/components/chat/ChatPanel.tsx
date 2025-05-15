import React, { useState, useRef, useEffect } from 'react';
import { ChatProps } from '../../lib/utils/types';

export const ChatPanel: React.FC<ChatProps> = ({
  user,
  messages,
  isOpen,
  onClose,
  onSendMessage
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  if (!isOpen) return null;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };
  
  return (
    <div className="chat-panel">
      <div className="chat-header">
        <span>Chat</span>
        <button onClick={onClose} title="Close chat">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-no-messages">No messages yet</div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className="chat-message"
              data-is-own={message.sender.id === user.id}
            >
              <div className="chat-message-sender">
                <div
                  className="user-presence-dot"
                  style={{ backgroundColor: message.sender.color }}
                ></div>
                <span>{message.sender.name}</span>
              </div>
              <div className="chat-message-text">{message.text}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form className="chat-input" onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatPanel; 