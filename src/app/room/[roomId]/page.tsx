'use client';

import React, { use } from 'react';
import WhiteboardCanvas from '../../../components/whiteboard/WhiteboardCanvas';

export default function RoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params);
  
  return (
    <main>
      <WhiteboardCanvas roomId={roomId} />
    </main>
  );
} 