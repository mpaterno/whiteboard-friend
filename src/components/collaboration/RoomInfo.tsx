import React from 'react';
import Link from 'next/link';
import { ClipboardDocumentIcon, HomeIcon } from '@heroicons/react/24/outline';
import { formatRoomId } from '../../lib/utils/roomUtils';

interface RoomInfoProps {
  roomId: string;
  isConnected: boolean;
  copyToClipboard: () => void;
}

const RoomInfo: React.FC<RoomInfoProps> = ({ roomId, isConnected, copyToClipboard }) => {
  // Format room ID for display
  const displayRoomId = formatRoomId(roomId);
  
  return (
    <div className="absolute top-4 right-4 z-50 flex items-center space-x-2 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-md">
      {/* Connection status indicator */}
      <div className="flex items-center">
        <div 
          className={`h-2.5 w-2.5 rounded-full mr-1.5 ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
        <span className="text-xs text-gray-600">
          {isConnected ? 'Connected' : 'Connecting...'}
        </span>
      </div>
      
      {/* Room ID */}
      <div className="text-sm font-medium px-2 py-1 border border-gray-200 rounded bg-gray-50">
        Room: {displayRoomId}
      </div>
      
      {/* Share button */}
      <button
        onClick={copyToClipboard}
        title="Copy room link"
        className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
      >
        <ClipboardDocumentIcon className="h-5 w-5 text-gray-600" />
      </button>
      
      {/* Home button */}
      <Link
        href="/"
        title="Go to home"
        className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
      >
        <HomeIcon className="h-5 w-5 text-gray-600" />
      </Link>
    </div>
  );
};

export default RoomInfo; 