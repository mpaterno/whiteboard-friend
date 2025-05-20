import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatRoomId } from '../../lib/utils/roomUtils';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

// Recent room interface
interface RecentRoom {
  id: string;
  timestamp: number;
  name?: string;
}

const RoomList: React.FC = () => {
  const [recentRooms, setRecentRooms] = useState<RecentRoom[]>([]);

  // Load recent rooms on component mount
  useEffect(() => {
    try {
      const storedRooms = localStorage.getItem('whiteboard-recent-rooms');
      if (storedRooms) {
        const parsedRooms = JSON.parse(storedRooms);
        setRecentRooms(parsedRooms);
      }
    } catch (err) {
      console.error('Error loading recent rooms:', err);
    }
  }, []);

  // Format timestamp as relative time
  const formatRelativeTime = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    
    // Convert to appropriate units
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days} day${days === 1 ? '' : 's'} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    } else {
      return 'Just now';
    }
  };
  
  // No recent rooms to show
  if (recentRooms.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-8">
      <h2 className="text-lg font-medium mb-3 text-gray-700 flex items-center">
        <ClockIcon className="h-5 w-5 mr-2" />
        Recent Rooms
      </h2>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {recentRooms.map((room) => (
            <li key={room.id}>
              <Link 
                href={`/room/${room.id}`}
                className="block hover:bg-gray-50 transition-colors p-4"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium">
                      {room.name || `Room: ${formatRoomId(room.id)}`}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 flex items-center">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      {formatRelativeTime(room.timestamp)}
                    </p>
                  </div>
                  <span className="text-sm bg-blue-100 text-blue-800 py-1 px-2 rounded-md">
                    {formatRoomId(room.id)}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RoomList; 