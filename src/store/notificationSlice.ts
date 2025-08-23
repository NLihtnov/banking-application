import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationData } from '../services/WebSocketService';

interface NotificationState {
  notifications: NotificationData[];
  unreadCount: number;
  isConnected: boolean;
  connectionError: string | null;
  showNotifications: boolean;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isConnected: false,
  connectionError: null,
  showNotifications: false,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<NotificationData>) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.read) {
        state.unreadCount++;
      }
      
      if (state.notifications.length > 50) {
        const removed = state.notifications.pop();
        if (removed && !removed.read) {
          state.unreadCount--;
        }
      }
    },

    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },

    markAllAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true;
      });
      state.unreadCount = 0;
    },

    removeNotification: (state, action: PayloadAction<string>) => {
      const index = state.notifications.findIndex(n => n.id === action.payload);
      if (index > -1) {
        const removed = state.notifications.splice(index, 1)[0];
        if (!removed.read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      }
    },

    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },

    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
      if (action.payload) {
        state.connectionError = null;
      }
    },

    setConnectionError: (state, action: PayloadAction<string>) => {
      state.connectionError = action.payload;
      state.isConnected = false;
    },

    toggleNotifications: (state) => {
      state.showNotifications = !state.showNotifications;
    },

    hideNotifications: (state) => {
      state.showNotifications = false;
    },

    updateTransactionNotification: (state, action: PayloadAction<any>) => {
      const transactionData = action.payload;
      const notification: NotificationData = {
        id: `transaction_${transactionData.id}_${Date.now()}`,
        type: 'transaction',
        title: 'Nova Transação',
        message: `${transactionData.type} de ${new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(transactionData.amount)} para ${transactionData.recipientName}`,
        timestamp: new Date().toISOString(),
        userId: transactionData.userId,
        data: transactionData,
        priority: 'medium',
        read: false
      };
      
      notificationSlice.caseReducers.addNotification(state, { 
        payload: notification, 
        type: 'notifications/addNotification' 
      });
    },

    updateBalanceNotification: (state, action: PayloadAction<{ oldBalance: number; newBalance: number }>) => {
      const { oldBalance, newBalance } = action.payload;
      const difference = newBalance - oldBalance;
      
      const notification: NotificationData = {
        id: `balance_${Date.now()}`,
        type: 'balance_update',
        title: 'Saldo Atualizado',
        message: difference > 0 
          ? `Seu saldo aumentou em ${new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(difference)}`
          : `Seu saldo foi reduzido em ${new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(Math.abs(difference))}`,
        timestamp: new Date().toISOString(),
        data: { oldBalance, newBalance, difference },
        priority: 'low',
        read: false
      };
      
      notificationSlice.caseReducers.addNotification(state, { 
        payload: notification, 
        type: 'notifications/addNotification' 
      });
    }
  },
});

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearNotifications,
  setConnectionStatus,
  setConnectionError,
  toggleNotifications,
  hideNotifications,
  updateTransactionNotification,
  updateBalanceNotification
} = notificationSlice.actions;

export default notificationSlice.reducer;
