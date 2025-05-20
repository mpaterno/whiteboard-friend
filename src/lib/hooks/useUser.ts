import { useCallback, useEffect } from 'react'
import { useUserStore, User } from '../store/user'
import { generateRandomColor } from '../utils/colorUtils'

export const useUser = () => {
  const { user, setUser } = useUserStore()
  
  // Create a new random user
  const createNewUser = useCallback(() => {
    const newUser: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: `User ${Math.floor(Math.random() * 10000)}`,
      color: generateRandomColor(),
    }
    
    setUser(newUser)
    
    // Save to local storage
    localStorage.setItem('whiteboard-user', JSON.stringify(newUser))
  }, [setUser])
  
  // Initialize user on component mount
  useEffect(() => {
    // Try to load user from local storage
    const storedUser = localStorage.getItem('whiteboard-user')
    
    if (storedUser) {
      // If user exists in storage, use it
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
      } catch (err) {
        console.error('Failed to parse stored user:', err)
        createNewUser()
      }
    } else {
      // Otherwise create a new user
      createNewUser()
    }
  }, [setUser, createNewUser])
  
  // Update user details
  const updateUser = useCallback((updates: Partial<User>) => {
    if (!user) return
    
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    
    // Save to local storage
    localStorage.setItem('whiteboard-user', JSON.stringify(updatedUser))
  }, [user, setUser])
  
  return {
    user,
    createNewUser,
    updateUser,
  }
} 