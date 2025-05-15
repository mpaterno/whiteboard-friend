import { useEffect, useState } from 'react'
import { useSyncDemo } from '@tldraw/sync'
import { useUserStore } from '../store/user'
import { useRoomStore } from '../store/room'
import { DEFAULT_ROOM_ID } from '../utils/constants'

export const useSync = (roomId: string = DEFAULT_ROOM_ID) => {
  const [isConnected, setIsConnected] = useState(false)
  const { user } = useUserStore()
  const { addUser, removeUser, setConnectionStatus } = useRoomStore()
  
  // Generate a room ID that's compatible with tldraw's sync demo
  const syncRoomId = `whiteboard-${roomId}`
  
  // Use the sync demo hook from tldraw
  const syncStore = useSyncDemo({
    roomId: syncRoomId,
    userInfo: user ? {
      id: user.id,
      name: user.name,
      color: user.color
    } : undefined
  })
  
  // Set up connection status effect
  useEffect(() => {
    if (syncStore) {
      // Track whether we have a valid store as our connection status
      const isStoreConnected = syncStore.status === 'synced-remote'
      setIsConnected(isStoreConnected)
      setConnectionStatus(isStoreConnected)
      
      // When connected, add current user to the room
      if (isStoreConnected && user) {
        addUser(user)
      }
    }
    
    return () => {
      // When disconnecting, remove user from the room
      if (user) {
        removeUser(user.id)
      }
    }
  }, [syncStore, syncStore?.status, user, addUser, removeUser, setConnectionStatus])
  
  return {
    syncStore,
    isConnected
  }
} 