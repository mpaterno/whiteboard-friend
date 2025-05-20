// App constants
export const APP_NAME = 'Simple Whiteboard'

// Storage keys
export const STORAGE_KEY_USER = 'whiteboard-user'
export const STORAGE_KEY_ROOM = 'whiteboard-last-room'

// URL constants
export const DEFAULT_ROOM_ID = 'default-room'

// Toolbar tools
export const TOOLS = [
  {
    id: 'select',
    name: 'Select',
    shortcut: 'v',
    icon: 'cursor'
  },
  {
    id: 'draw',
    name: 'Draw',
    shortcut: 'p',
    icon: 'pencil'
  },
  {
    id: 'eraser',
    name: 'Eraser',
    shortcut: 'e',
    icon: 'eraser'
  },
  {
    id: 'text',
    name: 'Text',
    shortcut: 't',
    icon: 'text'
  }
] 