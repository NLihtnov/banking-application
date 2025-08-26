export const getTypeIcon = (type: string): string => {
  switch (type) {
    case 'transaction': return '💸';
    case 'balance_update': return '💰';
    case 'security_alert': return '🔒';
    case 'system_message': return '⚙️';
    default: return '📬';
  }
};

export const getPriorityIcon = (priority: string): string => {
  switch (priority) {
    case 'urgent': return '🚨';
    case 'high': return '❗';
    case 'medium': return '📢';
    case 'low': return '💡';
    default: return '📝';
  }
};

export const getTransactionIcon = (type: string): string => {
  switch (type) {
    case 'PIX': return '⚡';
    case 'TED': return '🏦';
    default: return '💸';
  }
};
