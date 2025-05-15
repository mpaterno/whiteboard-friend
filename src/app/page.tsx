'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DEFAULT_ROOM_ID } from '../lib/utils/constants';

export default function Home() {
  const router = useRouter();
  
  // Redirect to the default room
  useEffect(() => {
    router.push(`/room/${DEFAULT_ROOM_ID}`);
  }, [router]);
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Simple Whiteboard</h1>
        <p className="mb-8">Redirecting to the default room...</p>
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent mx-auto"></div>
      </div>
    </div>
  );
}
