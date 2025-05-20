/**
 * Generates a random room ID with the specified length
 * @param length The length of the room ID (default: 6)
 * @returns A random alphanumeric room ID
 */
export const generateRandomRoomId = (length: number = 6): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  
  return result;
};

/**
 * Validates a room ID format
 * @param roomId The room ID to validate
 * @returns True if the room ID is valid
 */
export const isValidRoomId = (roomId: string): boolean => {
  // Simple validation: alphanumeric, at least 3 characters, max 20
  return /^[a-zA-Z0-9]{3,20}$/.test(roomId);
};

/**
 * Formats a room ID for display (adds hyphens every 3 characters)
 * @param roomId The room ID to format
 * @returns Formatted room ID
 */
export const formatRoomId = (roomId: string): string => {
  return roomId.match(/.{1,3}/g)?.join('-') || roomId;
}; 