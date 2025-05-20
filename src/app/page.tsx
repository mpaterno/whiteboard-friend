'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { generateRandomRoomId } from '../lib/utils/roomUtils';
import RoomList from '../components/room/RoomList';

// Interface for recent room entries
interface RecentRoom {
  id: string;
  timestamp: number;
  name?: string;
}

export default function Home() {
  const router = useRouter();
  const [roomId, setRoomId] = useState('');
  
  // Create a new room with random ID
  const handleCreateRoom = () => {
    const newRoomId = generateRandomRoomId();
    saveRecentRoom(newRoomId);
    router.push(`/room/${newRoomId}`);
  };
  
  // Join an existing room
  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim()) {
      saveRecentRoom(roomId.trim());
      router.push(`/room/${roomId.trim()}`);
    }
  };
  
  // Save room to recent rooms in localStorage
  const saveRecentRoom = (id: string) => {
    try {
      // Get existing rooms or initialize empty array
      const storedRooms = localStorage.getItem('whiteboard-recent-rooms');
      const recentRooms: RecentRoom[] = storedRooms ? JSON.parse(storedRooms) : [];
      
      // Check if room already exists in list
      const roomIndex = recentRooms.findIndex((room: RecentRoom) => room.id === id);
      
      // Create new room entry
      const roomEntry: RecentRoom = {
        id,
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
  };
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-3xl font-bold text-center mb-6">Whiteboard Friend</h1>
          
          <div className="space-y-6">
            {/* Create a new room */}
            <button
              onClick={handleCreateRoom}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Create New Room</span>
            </button>
            
            <div className="relative flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-500">or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            
            {/* Join existing room */}
            <form onSubmit={handleJoinRoom}>
              <label htmlFor="room-id" className="block text-sm font-medium text-gray-700 mb-2">
                Join Existing Room
              </label>
              <div className="flex space-x-2">
                <input
                  id="room-id"
                  type="text"
                  placeholder="Enter room ID"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={!roomId.trim()}
                  className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <ArrowRightIcon className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Recent rooms list */}
        <RoomList />
      </div>
    </div>
  );
}
