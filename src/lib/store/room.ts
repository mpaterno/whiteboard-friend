import { create } from 'zustand'
import { User } from './user'

export interface Message {
  id: string
  sender: User
  text: string
  timestamp: number
}

export interface Room {
  id: string
  users: User[]
  messages: Message[]
  isConnected: boolean
}

interface RoomStore {
  room: Room | null
  setRoom: (room: Room) => void
  updateRoom: (updates: Partial<Room>) => void
  addUser: (user: User) => void
  removeUser: (userId: string) => void
  addMessage: (message: Omit<Message, 'id'>) => void
  setConnectionStatus: (isConnected: boolean) => void
  reset: () => void
}

// Generate a unique message ID
const generateMessageId = () => `msg-${Math.random().toString(36).substring(2, 11)}`

export const useRoomStore = create<RoomStore>((set) => ({
  room: null,
  setRoom: (room) => set({ room }),
  updateRoom: (updates) => set((state) => ({
    room: state.room ? { ...state.room, ...updates } : null
  })),
  addUser: (user) => set((state) => {
    if (!state.room) return { room: null }
    
    // Check if user already exists
    const userExists = state.room.users.some((u) => u.id === user.id)
    if (userExists) return { room: state.room }
    
    return {
      room: {
        ...state.room,
        users: [...state.room.users, user]
      }
    }
  }),
  removeUser: (userId) => set((state) => {
    if (!state.room) return { room: null }
    return {
      room: {
        ...state.room,
        users: state.room.users.filter((user) => user.id !== userId)
      }
    }
  }),
  addMessage: (messageData) => set((state) => {
    if (!state.room) return { room: null }
    
    const message: Message = {
      ...messageData,
      id: generateMessageId(),
      timestamp: messageData.timestamp || Date.now()
    }
    
    return {
      room: {
        ...state.room,
        messages: [...state.room.messages, message]
      }
    }
  }),
  setConnectionStatus: (isConnected) => set((state) => ({
    room: state.room ? { ...state.room, isConnected } : null
  })),
  reset: () => set({ room: null })
})) 