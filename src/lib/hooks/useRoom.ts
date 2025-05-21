import { useCallback, useEffect } from 'react'
import { useRoomStore, Message } from '../store/room'
import { User } from '../store/user'
import { DEFAULT_ROOM_ID } from '../utils/constants'

export const useRoom = (roomId: string = DEFAULT_ROOM_ID) => {
  const {
    room,
    setRoom,
    addUser,
    removeUser,
    addMessage,
    setConnectionStatus,
    reset
  } = useRoomStore()

  const initRoom = useCallback(() => {
    const currentRoom = useRoomStore.getState().room;
    if (!currentRoom || currentRoom.id !== roomId) {
      setRoom({
        id: roomId,
        users: [],
        messages: [],
        isConnected: false
      })
    }
  }, [roomId, setRoom])

  const joinRoom = useCallback(
    (user: User) => {
      initRoom()
      addUser(user)
      
      // Notify others when a user joins
      const joinMessage: Omit<Message, 'id'> = {
        sender: {
          id: 'system',
          name: 'System',
          color: '#888888'
        },
        text: `${user.name} joined the room`,
        timestamp: Date.now()
      }
      
      addMessage(joinMessage)
    },
    [initRoom, addUser, addMessage]
  )

  const leaveRoom = useCallback(
    (userId: string) => {
      const currentRoom = useRoomStore.getState().room;
      const departingUser = currentRoom?.users.find(u => u.id === userId)
      removeUser(userId)
      
      // Notify others when a user leaves
      if (departingUser) {
        const leaveMessage: Omit<Message, 'id'> = {
          sender: {
            id: 'system',
            name: 'System',
            color: '#888888'
          },
          text: `${departingUser.name} left the room`,
          timestamp: Date.now()
        }
        
        addMessage(leaveMessage)
      }
    },
    [removeUser, addMessage]
  )

  const sendMessage = useCallback(
    (message: Omit<Message, 'id'>) => {
      addMessage(message)
      
      // You could add a notification sound here
      try {
        const audio = new Audio('/message-sound.mp3')
        audio.volume = 0.5
        audio.play().catch(e => console.log('Audio play error:', e))
      } catch {
        console.log('Could not play notification sound')
      }
    },
    [addMessage]
  )

  const setConnected = useCallback(
    (isConnected: boolean) => {
      setConnectionStatus(isConnected)
    },
    [setConnectionStatus]
  )

  const resetRoom = useCallback(() => {
    reset()
  }, [reset])

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      // Optional: handle disconnection logic here
    }
  }, [])

  return {
    room,
    initRoom,
    joinRoom,
    leaveRoom,
    sendMessage,
    setConnected,
    resetRoom
  }
} 