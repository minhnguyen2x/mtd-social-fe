import { mtdSocialAPI } from '@shared/libs/axios/mtd-social-api';

class FollowerService {
  async getUserFollowing() {
    const response = await mtdSocialAPI.get('/user/following');
    return response;
  }

  async getUserFollowers(userId) {
    const response = await mtdSocialAPI.get(`/user/followers/${userId}`);
    return response;
  }

  async followUser(followerId) {
    const response = await mtdSocialAPI.put(`/user/follow/${followerId}`);
    return response;
  }

  async unFollowUser(followeeId, followerId) {
    const response = await mtdSocialAPI.put(`/user/unfollow/${followeeId}/${followerId}`);
    return response;
  }

  async blockUser(followerId) {
    const response = await mtdSocialAPI.put(`/user/block/${followerId}`);
    return response;
  }

  async unblockUser(followerId) {
    const response = await mtdSocialAPI.put(`/user/unblock/${followerId}`);
    return response;
  }
}

export const followerService = new FollowerService();
