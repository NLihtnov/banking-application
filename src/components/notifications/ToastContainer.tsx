import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../hooks';
import { Toast } from './Toast';
import { NotificationData } from '../../services/WebSocketService';

export const ToastContainer: React.FC = () => {
  const { notifications } = useAppSelector(state => state.notifications);
  const [activeToasts, setActiveToasts] = useState<NotificationData[]>([]);

  useEffect(() => {
    // Process all high/urgent priority notifications
    const highUrgentNotifications = notifications.filter(
      n => (n.priority === 'high' || n.priority === 'urgent')
    );

    // Add new notifications that aren't already active
    highUrgentNotifications.forEach(newNotification => {
      if (!activeToasts.some(activeToast => activeToast.id === newNotification.id)) {
        setActiveToasts(prev => [...prev, newNotification]);
      }
    });

    // Remove toasts that are no longer in the notifications array
    setActiveToasts(prev => 
      prev.filter(activeToast => 
        notifications.some(n => n.id === activeToast.id)
      )
    );
  }, [notifications]);

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
