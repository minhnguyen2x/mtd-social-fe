import '@pages/(social)/videos/Videos.scss';
import useEffectOnce from '@shared/hooks/useEffectOnce';
import { followerService } from '@shared/services/api/followers/follower.service';
import { postService } from '@shared/services/api/post/post.service';
import { PostUtils } from '@shared/services/utils/post-utils.service';
import { Utils } from '@shared/services/utils/utils.service';
import { useState } from 'react';
import { useAppSelector } from '@shared/hooks/use-app-selector';
import { useAppDispatch } from '@shared/hooks/use-app-dispatch';

const Videos = () => {
  const { profile } = useAppSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  const getPostsWithVideos = async () => {
    try {
      const response = await postService.getPostsWithVideos(1);
      setPosts(response.data.posts);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };

  const getUserFollowing = async () => {
    try {
      const response = await followerService.getUserFollowing();
      setFollowing(response.data.following);
    } catch (error) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };

  const emptyPost = (post) => {
    return (
      Utils.checkIfUserIsBlocked(profile?.blockedBy, post?.userId) || PostUtils.checkPrivacy(post, profile, following)
    );
  };

  useEffectOnce(() => {
    getPostsWithVideos();
    getUserFollowing();
  });

  return (
    <>
      <div className="videos-container">
        <div className="videos">Videos</div>
        {posts.length > 0 && (
          <div className="gallery-videos">
            {posts.map((post) => (
              <div
                key={Utils.generateString(10)}
                className={`${!emptyPost(post) ? 'empty-post-div' : ''}`}
                data-testid="gallery-videos"
              >
                {(!Utils.checkIfUserIsBlocked(profile?.blockedBy, post?.userId) || post?.userId === profile?._id) && (
                  <>
                    {PostUtils.checkPrivacy(post, profile, following) && (
                      <figure data-testid="video">
                        <div className="video">
                          <video
                            width="350px"
                            height="200px"
                            autoPlay={true}
                            controls
                            src={`${Utils.getVideo(post?.videoId, post?.videoVersion)}`}
                          />
                        </div>
                      </figure>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {loading && !posts.length && <div className="card-element" style={{ height: '350px' }}></div>}

        {!loading && !posts.length && (
          <div className="empty-page" data-testid="empty-page">
            There are no videos to display
          </div>
        )}
      </div>
    </>
  );
};

export default Videos;
