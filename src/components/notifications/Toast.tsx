import React, { useEffect, useState } from 'react';
import { NotificationData } from '../../services/WebSocketService';
import { getTypeIcon } from '../../utils/icons';
import './Toast.css';

interface ToastProps {
  notification: NotificationData;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ 
  notification, 
  onClose, 
  duration = 5000 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    setIsVisible(true);
    
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const decrement = 100 / (duration / 100);
        return Math.max(0, prev - decrement);
      });
    }, 100);

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [duration, onClose]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#f44336';
      case 'high': return '#ff9800';
      case 'medium': return '#2196f3';
      case 'low': return '#4caf50';
      default: return '#6c757d';
    }
  };

  return (
    <div 
      className={`toast ${isVisible ? 'visible' : ''} priority-${notification.priority}`}
      style={{ '--priority-color': getPriorityColor(notification.priority) } as React.CSSProperties}
    >
      <div className="toast-content">
        <div className="toast-icon">
          {getTypeIcon(notification.type)}
        </div>
        
        <div className="toast-text">
          <div className="toast-title">{notification.title}</div>
          <div className="toast-message">{notification.message}</div>
        </div>
        
        <button className="toast-close" onClick={onClose}>
          ✕
        </button>
      </div>
      
      <div 
        className="toast-progress" 
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
