import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../hooks';
import { Toast } from './Toast';
import { NotificationData } from '../../services/WebSocketService';

export const ToastContainer: React.FC = () => {
  const { notifications } = useAppSelector(state => state.notifications);
  const [activeToasts, setActiveToasts] = useState<NotificationData[]>([]);

  useEffect(() => {
    const latestNotification = notifications[0];
    
    if (latestNotification && 
        (latestNotification.priority === 'high' || latestNotification.priority === 'urgent') &&
        !activeToasts.find(toast => toast.id === latestNotification.id)) {
      
      setActiveToasts(prev => [...prev, latestNotification]);
    }
  }, [notifications, activeToasts]);

  const removeToast = (notificationId: string) => {
    setActiveToasts(prev => prev.filter(toast => toast.id !== notificationId));
  };

  return (
    <div className="toast-container">
      {activeToasts.map((notification, index) => (
        <div 
          key={notification.id} 
          style={{ 
            top: `${20 + (index * 80)}px`,
            zIndex: 1001 + index 
          }}
        >
          <Toast
            notification={notification}
            onClose={() => removeToast(notification.id)}
            duration={notification.priority === 'urgent' ? 8000 : 5000}
          />
        </div>
      ))}
    </div>
  );
};
