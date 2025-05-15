import { User } from '../store/user'
import { Message } from '../store/room'

export interface Tool {
  id: string
  name: string
  shortcut: string
  icon: string
}

export interface ChatProps {
  user: User
  messages: Message[]
  isOpen: boolean
  onClose: () => void
  onSendMessage: (text: string) => void
}

export interface UserPresenceProps {
  users: User[]
  roomId: string
}

export interface ToolbarProps {
  currentTool: string
  onSelectTool: (toolId: string) => void
}

export interface RoomInfoProps {
  roomId: string
  isConnected: boolean
  copyToClipboard: () => void
} 