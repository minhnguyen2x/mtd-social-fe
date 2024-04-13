import { mtdSocialAPI } from '@shared/libs/axios/mtd-social-api';

class NotificationService {
  async getUserNotifications() {
    const response = await mtdSocialAPI.get('/notifications');
    return response;
  }

  async markNotificationAsRead(messageId) {
    const response = await mtdSocialAPI.put(`/notification/${messageId}`);
    return response;
  }

  async deleteNotification(messageId) {
    const response = await mtdSocialAPI.delete(`/notification/${messageId}`);
    return response;
  }
}

export const notificationService = new NotificationService();
