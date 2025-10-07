// Локализация статусов дефектов
export const translateStatus = (status) => {
  const statusMap = {
    'new': 'Новый',
    'in_progress': 'В работе',
    'review': 'На проверке',
    'closed': 'Закрыт',
    'cancelled': 'Отменён'
  };
  return statusMap[status] || status;
};

// Локализация приоритетов
export const translatePriority = (priority) => {
  const priorityMap = {
    'low': 'Низкий',
    'medium': 'Средний',
    'high': 'Высокий'
  };
  return priorityMap[priority] || priority;
};

// Цвета для статусов (Bootstrap классы)
export const getStatusColor = (status) => {
  const colorMap = {
    'new': 'info',           // Синий
    'in_progress': 'warning', // Жёлтый
    'review': 'primary',      // Голубой
    'closed': 'success',      // Зелёный
    'cancelled': 'secondary'  // Серый
  };
  return colorMap[status] || 'secondary';
};

// Цвета для приоритетов
export const getPriorityColor = (priority) => {
  const colorMap = {
    'low': 'success',    // Зелёный
    'medium': 'warning', // Жёлтый
    'high': 'danger'     // Красный
  };
  return colorMap[priority] || 'secondary';
};
