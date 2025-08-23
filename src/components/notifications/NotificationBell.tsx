import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { toggleNotifications } from '../../store/notificationSlice';
import './NotificationBell.css';

export const NotificationBell: React.FC = () => {
  const dispatch = useAppDispatch();
  const { unreadCount, isConnected } = useAppSelector(state => state.notifications);

  const handleClick = () => {
    dispatch(toggleNotifications());
  };

  return (
    <div className="notification-bell" onClick={handleClick}>
      <div className={`bell-icon ${!isConnected ? 'disconnected' : ''}`}>
        🔔
      </div>
      {unreadCount > 0 && (
        <span className="notification-badge">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </div>
  );
};
