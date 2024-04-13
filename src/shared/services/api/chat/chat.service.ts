import { mtdSocialAPI } from '@shared/libs/axios/mtd-social-api';

class ChatService {
  async getConversationList() {
    const response = await mtdSocialAPI.get('/chat/message/conversation-list');
    return response;
  }

  async getChatMessages(receiverId) {
    const response = await mtdSocialAPI.get(`/chat/message/user/${receiverId}`);
    return response;
  }

  async addChatUsers(body) {
    const response = await mtdSocialAPI.post('/chat/message/add-chat-users', body);
    return response;
  }

  async removeChatUsers(body) {
    const response = await mtdSocialAPI.post('/chat/message/remove-chat-users', body);
    return response;
  }

  async markMessagesAsRead(senderId, receiverId) {
    const response = await mtdSocialAPI.put(`/chat/message/mark-as-read`, { senderId, receiverId });
    return response;
  }

  async saveChatMessage(body) {
    const response = await mtdSocialAPI.post('/chat/message', body);
    return response;
  }

  async updateMessageReaction(body) {
    const response = await mtdSocialAPI.put('/chat/message/reaction', body);
    return response;
  }

  async markMessageAsDelete(messageId, senderId, receiverId, type) {
    const response = await mtdSocialAPI.delete(
      `/chat/message/mark-as-deleted/${messageId}/${senderId}/${receiverId}/${type}`
    );
    return response;
  }
}

export const chatService = new ChatService();
