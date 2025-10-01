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
