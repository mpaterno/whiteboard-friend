import { useCallback } from 'react'
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
    if (!room || room.id !== roomId) {
      setRoom({
        id: roomId,
        users: [],
        messages: [],
        isConnected: false
      })
    }
  }, [room, roomId, setRoom])

  const joinRoom = useCallback(
    (user: User) => {
      initRoom()
      addUser(user)
    },
    [initRoom, addUser]
  )

  const leaveRoom = useCallback(
    (userId: string) => {
      removeUser(userId)
    },
    [removeUser]
  )

  const sendMessage = useCallback(
    (message: Omit<Message, 'id'>) => {
      addMessage(message)
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