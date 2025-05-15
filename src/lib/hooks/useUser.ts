import { useEffect } from 'react'
import { useUserStore, User } from '../store/user'
import { STORAGE_KEY_USER } from '../utils/constants'

export const useUser = () => {
  const { user, setUser, resetUser } = useUserStore()

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_KEY_USER)
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
      } catch (e) {
        console.error('Failed to parse saved user', e)
        localStorage.removeItem(STORAGE_KEY_USER)
      }
    }
  }, [setUser])

  // Save user to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user))
  }, [user])

  const updateUser = (userData: Partial<User>) => {
    setUser(userData)
  }

  return {
    user,
    updateUser,
    resetUser
  }
} 