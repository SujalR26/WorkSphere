export const playNotificationSound = () => {
  try {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-84.wav');
    audio.volume = 0.3;
    audio.play();
  } catch (error) {
    console.warn('Audio feedback failed:', error.message);
  }
};

export const filterUnreadNotifications = (notifications) => {
  if (!notifications) return [];
  return notifications.filter(n => !n.isRead);
};
