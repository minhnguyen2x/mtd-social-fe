import { mtdSocialAPI } from '@shared/libs/axios/mtd-social-api';

class AuthService {
  async signUp(body) {
    const response = await mtdSocialAPI.post('/signup', body);
    return response;
  }

  async signIn(body) {
    const response = await mtdSocialAPI.post('/signin', body);
    return response;
  }

  async forgotPassword(email) {
    const response = await mtdSocialAPI.post('/forgot-password', { email });
    return response;
  }

  async resetPassword(token, body) {
    const response = await mtdSocialAPI.post(`/reset-password/${token}`, body);
    return response;
  }
}

export const authService = new AuthService();
