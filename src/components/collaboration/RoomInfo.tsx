import React from 'react';
import { RoomInfoProps } from '../../lib/utils/types';

export const RoomInfo: React.FC<RoomInfoProps> = ({ roomId, isConnected, copyToClipboard }) => {
  return (
    <div className="room-info">
      <div className="room-status">
        <div
          className="user-presence-dot"
          style={{ backgroundColor: isConnected ? '#36B37E' : '#FF5630' }}
          title={isConnected ? 'Connected' : 'Disconnected'}
        ></div>
        <span>Room: {roomId}</span>
      </div>
      <button
        onClick={copyToClipboard}
        className="copy-button"
        title="Copy invite link"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 4V16C8 17.1046 8.89543 18 10 18H18C19.1046 18 20 17.1046 20 16V7.41421C20 6.88378 19.7893 6.37507 19.4142 6L16 2.58579C15.6249 2.21071 15.1162 2 14.5858 2H10C8.89543 2 8 2.89543 8 4Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 18V20C16 21.1046 15.1046 22 14 22H6C4.89543 22 4 21.1046 4 20V9C4 7.89543 4.89543 7 6 7H8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default RoomInfo; 