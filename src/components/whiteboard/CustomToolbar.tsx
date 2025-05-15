import React from 'react';
import { TOOLS } from '../../lib/utils/constants';
import { ToolbarProps } from '../../lib/utils/types';

// Icons for tools
const icons = {
  cursor: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 3L18 12L13 13.5L15.5 20.5L12.5 22L10 14.5L6 19L6 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  pencil: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.5 5.5L18.5 8.5M17 14L15 19L9 21L4 11L10 6L17 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  eraser: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 16L8 4L4 8L12 16H20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  square: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="16" height="16" rx="1" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  circle: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  text: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 7H20M12 7V19M7 19H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
};

export const CustomToolbar: React.FC<ToolbarProps> = ({ currentTool, onSelectTool }) => {
  return (
    <div className="custom-toolbar">
      {TOOLS.map((tool) => (
        <button
          key={tool.id}
          className="custom-button"
          data-isactive={currentTool === tool.id}
          onClick={() => onSelectTool(tool.id)}
          title={`${tool.name} (${tool.shortcut.toUpperCase()})`}
        >
          <span>{icons[tool.icon as keyof typeof icons]}</span>
          <span>{tool.name}</span>
        </button>
      ))}
    </div>
  );
};

export default CustomToolbar; 