import { mtdSocialAPI } from '@shared/libs/axios/mtd-social-api';

class ImageService {
  async getUserImages(userId) {
    const response = await mtdSocialAPI.get(`/images/${userId}`);
    return response;
  }

  async addImage(url, data) {
    const response = await mtdSocialAPI.post(url, { image: data });
    return response;
  }

  async removeImage(url) {
    const response = await mtdSocialAPI.delete(url);
    return response;
  }
}

export const imageService = new ImageService();
