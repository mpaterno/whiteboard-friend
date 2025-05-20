/**
 * Generates a random hex color code
 * @returns A random hex color code
 */
export const generateRandomColor = (): string => {
  // Define a set of pleasant colors for whiteboards
  const colors = [
    '#2563EB', // Blue
    '#7C3AED', // Violet
    '#EC4899', // Pink
    '#EF4444', // Red
    '#F59E0B', // Amber
    '#10B981', // Emerald
    '#06B6D4', // Cyan
    '#8B5CF6', // Purple
    '#F97316', // Orange
    '#059669', // Green
  ];
  
  // Select a random color from the array
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Generates a contrasting text color (black or white) based on background color
 * @param backgroundColor Hex color code
 * @returns '#000000' for light backgrounds, '#FFFFFF' for dark backgrounds
 */
export const getContrastColor = (backgroundColor: string): string => {
  // Remove the hash if it exists
  const hex = backgroundColor.replace('#', '');
  
  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calculate luminance (perceptual brightness)
  // Formula: https://www.w3.org/TR/WCAG20-TECHS/G17.html
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black for light colors, white for dark colors
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}; 