import Notification from '../models/Notification.js';

class NotificationService {
  async getAll(recipientId) {
    const query = {
      $or: [
        { recipient: null }, // Global notifications
      ]
    };
    
    if (recipientId) {
      query.$or.push({ recipient: recipientId });
    }

    return await Notification.find(query).sort({ createdAt: -1 });
  }

  async markAsRead(id) {
    const notification = await Notification.findById(id);
    if (!notification) {
      const error = new Error('Notification not found');
      error.statusCode = 404;
      throw error;
    }

    notification.isRead = true;
    await notification.save();
    return notification;
  }

  async markAllAsRead(recipientId) {
    const query = { isRead: false };
    
    if (recipientId) {
      query.$or = [
        { recipient: null },
        { recipient: recipientId }
      ];
    } else {
      query.recipient = null;
    }

    await Notification.updateMany(query, { $set: { isRead: true } });
    return { success: true };
  }

  async create(data) {
    const notification = new Notification(data);
    await notification.save();
    return notification;
  }
}

export default new NotificationService();
