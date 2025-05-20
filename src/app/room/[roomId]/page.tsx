'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import WhiteboardCanvas from '../../../components/whiteboard/WhiteboardCanvas';
import { isValidRoomId } from '../../../lib/utils/roomUtils';

export default function RoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const router = useRouter();
  const { roomId } = use(params);
  const [isLoading, setIsLoading] = useState(true);
  
  // Validate room ID format
  useEffect(() => {
    setIsLoading(false);
    
    if (!isValidRoomId(roomId)) {
      // If invalid, redirect to home page
      router.push('/');
    }
  }, [roomId, router]);
  
  // If roomId is invalid, show loading (will redirect)
  if (isLoading || !isValidRoomId(roomId)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-2">
            {isLoading ? 'Loading...' : 'Invalid room ID. Redirecting...'}
          </p>
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent mx-auto"></div>
        </div>
      </div>
    );
  }
  
  return (
    <main className="h-screen w-screen overflow-hidden">
      <WhiteboardCanvas roomId={roomId} />
    </main>
  );
} 