export const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString('ru-RU');
};

export const isOverdue = (deadline) => {
  if (!deadline) return false;
  return new Date(deadline) < new Date();
};

export const getDaysRemaining = (deadline) => {
  if (!deadline) return null;
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diff = deadlineDate.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 3600 * 24));
};