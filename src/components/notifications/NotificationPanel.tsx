import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useNotifications } from '../../hooks/useNotifications';
import { hideNotifications, removeNotification } from '../../store/notificationSlice';
import { NotificationData } from '../../services/WebSocketService';
import './NotificationPanel.css';

export const NotificationPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { showNotifications } = useAppSelector(state => state.notifications);
  const { 
    notifications, 
    unreadCount, 
    isConnected,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    sendTestNotification
  } = useNotifications();

  if (!showNotifications) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      dispatch(hideNotifications());
    }
  };

  const handleNotificationClick = (notification: NotificationData) => {
    if (!notification.read) {
      markNotificationAsRead(notification.id);
    }
  };

  const handleRemoveNotification = (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(removeNotification(notificationId));
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Agora';
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d atrás`;
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return '🚨';
      case 'high': return '❗';
      case 'medium': return '📢';
      case 'low': return '💡';
      default: return '📝';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'transaction': return '💸';
      case 'balance_update': return '💰';
      case 'security_alert': return '🔒';
      case 'system_message': return '⚙️';
      default: return '📬';
    }
  };

  return (
    <div className="notification-backdrop" onClick={handleBackdropClick}>
      <div className="notification-panel">
        <div className="notification-header">
          <div className="header-content">
            <div className="header-title-section">
              <h3>Notificações</h3>
              <div className="connection-indicator">
                <span className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></span>
                <span>{isConnected ? 'Conectado' : 'Desconectado'}</span>
              </div>
            </div>
            
            <div className="header-controls">
              <div className="action-buttons">
                <button 
                  className="test-btn"
                  onClick={sendTestNotification}
                  title="Enviar notificação de teste"
                >
                  ✨
                </button>
                
                
                <button 
                  className="close-btn"
                  onClick={() => dispatch(hideNotifications())}
                  title="Fechar painel"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
          
          {unreadCount > 0 && (
            <div className="header-actions">
              <button 
                className="mark-all-read-btn"
                onClick={markAllNotificationsAsRead}
              >
                Marcar todas como lidas
              </button>
            </div>
          )}
        </div>

        <div className="notification-list">
          {notifications.length === 0 ? (
            <div className="empty-notifications">
              <div className="empty-icon">📭</div>
              <p>Nenhuma notificação</p>
              <small>Você receberá notificações sobre transações e atualizações aqui.</small>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item ${!notification.read ? 'unread' : ''} priority-${notification.priority}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="notification-content">
                  <div className="notification-icons">
                    <span className="type-icon">{getTypeIcon(notification.type)}</span>
                    <span className="priority-icon">{getPriorityIcon(notification.priority)}</span>
                  </div>
                  
                  <div className="notification-text">
                    <div className="notification-title">{notification.title}</div>
                    <div className="notification-message">{notification.message}</div>
                    <div className="notification-time">{formatTimeAgo(notification.timestamp)}</div>
                  </div>
                  
                  <div className="notification-actions">
                    {!notification.read && <div className="unread-indicator"></div>}
                    <button
                      className="remove-btn"
                      onClick={(e) => handleRemoveNotification(notification.id, e)}
                      title="Remover notificação"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {unreadCount > 0 && (
          <div className="notification-summary">
            {unreadCount} notificação{unreadCount > 1 ? 'ões' : ''} não lida{unreadCount > 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
};
