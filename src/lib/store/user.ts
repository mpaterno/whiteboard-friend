import { create } from 'zustand'

// Define a random color generator for user colors
const getRandomColor = () => {
  const colors = [
    '#ff5630',
    '#ffab00',
    '#36b37e',
    '#00b8d9',
    '#6554c0',
    '#172b4d',
    '#0052cc',
    '#bf2600',
    '#006644',
    '#403294'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

// Generate a random 4-digit number for anonymous users
const getRandomId = () => Math.floor(1000 + Math.random() * 9000).toString()

export interface User {
  id: string
  name: string
  color: string
}

interface UserStore {
  user: User
  setUser: (user: Partial<User>) => void
  resetUser: () => void
}

const defaultUser = {
  id: `user-${getRandomId()}`,
  name: `User ${getRandomId()}`,
  color: getRandomColor()
}

export const useUserStore = create<UserStore>((set) => ({
  user: defaultUser,
  setUser: (userData) => set((state) => ({
    user: { ...state.user, ...userData }
  })),
  resetUser: () => set({ user: defaultUser })
})) 