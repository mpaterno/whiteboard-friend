import React from 'react';
import { UserPresenceProps } from '../../lib/utils/types';

export const UserPresence: React.FC<UserPresenceProps> = ({ users }) => {
  if (users.length === 0) return null;

  // Filter out system user if present
  const realUsers = users.filter(user => user.id !== 'system');

  return (
    <div className="user-presence">
      <div className="user-presence-header">
        {realUsers.length} {realUsers.length === 1 ? 'user' : 'users'} online
      </div>
      <div className="user-presence-list">
        {realUsers.map((user) => (
          <div key={user.id} className="user-presence-item">
            <div
              className="user-presence-dot"
              style={{ backgroundColor: user.color }}
            ></div>
            <div className="user-presence-name">{user.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPresence; 