import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { webSocketService, NotificationData } from '../services/WebSocketService';
import {
  addNotification,
  markAsRead,
  markAllAsRead,
  setConnectionStatus,
  setConnectionError,
  updateTransactionNotification,
  updateBalanceNotification
} from '../store/notificationSlice';
import { updateBalance } from '../store/authSlice';

export const useNotifications = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    notifications, 
    unreadCount, 
    isConnected, 
    connectionError,
    showNotifications 
  } = useSelector((state: RootState) => state.notifications);
  const { token, user } = useSelector((state: RootState) => state.auth);

  const showBrowserNotification = useCallback((notification: NotificationData) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/logo192.png',
        badge: '/logo192.png',
        tag: notification.id,
        requireInteraction: notification.priority === 'urgent'
      });

      browserNotification.onclick = () => {
        window.focus();
        dispatch(markAsRead(notification.id));
        webSocketService.markNotificationAsRead(notification.id);
        browserNotification.close();
      };

      setTimeout(() => {
        browserNotification.close();
      }, 5000);
    }
  }, [dispatch]);

  const connectWebSocket = useCallback(async () => {
    if (!token) return;

    try {
      await webSocketService.connect(token);
      
      webSocketService.on('connected', (connected: boolean) => {
        dispatch(setConnectionStatus(connected));
      });

      webSocketService.on('error', (error: any) => {
        dispatch(setConnectionError(error.message || 'Erro de conexão'));
      });

      webSocketService.on('notification', (notification: NotificationData) => {
        dispatch(addNotification(notification));
        
        if (notification.priority === 'urgent' || notification.priority === 'high') {
          showBrowserNotification(notification);
        }
      });

      webSocketService.on('transaction_update', (transactionData: any) => {
        dispatch(updateTransactionNotification(transactionData));
      });

      webSocketService.on('balance_update', (balanceData: { newBalance: number }) => {
        if (user) {
          dispatch(updateBalanceNotification({
            oldBalance: user.balance,
            newBalance: balanceData.newBalance
          }));
          dispatch(updateBalance(balanceData.newBalance));
        }
      });

    } catch (error) {
      dispatch(setConnectionError('Falha na conexão'));
    }
  }, [token, dispatch, user, showBrowserNotification]);

  const disconnectWebSocket = useCallback(() => {
    webSocketService.disconnect();
    dispatch(setConnectionStatus(false));
  }, [dispatch]);

  const markNotificationAsRead = useCallback((notificationId: string) => {
    dispatch(markAsRead(notificationId));
    webSocketService.markNotificationAsRead(notificationId);
  }, [dispatch]);

  const markAllNotificationsAsRead = useCallback(() => {
    dispatch(markAllAsRead());
    notifications.forEach(notification => {
      if (!notification.read) {
        webSocketService.markNotificationAsRead(notification.id);
      }
    });
  }, [dispatch, notifications]);

  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }, []);

  const sendTestNotification = useCallback(() => {
    const testNotification: NotificationData = {
      id: `test_${Date.now()}`,
      type: 'system_message',
      title: 'Teste de Notificação',
      message: 'Esta é uma notificação de teste do sistema.',
      timestamp: new Date().toISOString(),
      priority: 'medium',
      read: false
    };
    
    dispatch(addNotification(testNotification));
  }, [dispatch]);

  useEffect(() => {
    if (token && user) {
      connectWebSocket();
    }

    return () => {
      disconnectWebSocket();
    };
  }, [token, user, connectWebSocket, disconnectWebSocket]);

  return {
    notifications,
    unreadCount,
    isConnected,
    connectionError,
    showNotifications,
    connectWebSocket,
    disconnectWebSocket,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    requestNotificationPermission,
    sendTestNotification
  };
};