import Avatar from '@components/avatar/Avatar';
import '@components/posts/comments/comments-modal/CommentsModal.scss';
import ReactionWrapper from '@components/posts/modal-wrappers/reaction-wrapper/ReactionWrapper';
import useEffectOnce from '@shared/hooks/useEffectOnce';
import { closeModal } from '@shared/redux-toolkit/reducers/modal/modal.reducer';
import { clearPost } from '@shared/redux-toolkit/reducers/post/post.reducer';
import { postService } from '@shared/services/api/post/post.service';
import { Utils } from '@shared/services/utils/utils.service';
import { useState } from 'react';
import { useAppDispatch } from '@shared/hooks/use-app-dispatch';
import { useAppSelector } from '@shared/hooks/use-app-selector';

const CommentsModal = () => {
  const { post } = useAppSelector((state) => state);
  const [postComments, setPostComments] = useState([]);
  const dispatch = useAppDispatch();

  const getPostComments = async () => {
    try {
      const response = await postService.getPostComments(post?._id);
      setPostComments(response.data?.comments);
    } catch (error) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };

  const closeCommentsModal = () => {
    dispatch(closeModal());
    dispatch(clearPost());
  };

  useEffectOnce(() => {
    getPostComments();
  });

  return (
    <>
      <ReactionWrapper closeModal={closeCommentsModal}>
        <div className="modal-comments-header">
          <h2>Comments</h2>
        </div>
        <div className="modal-comments-container">
          <ul className="modal-comments-container-list">
            {postComments.map((data) => (
              <li className="modal-comments-container-list-item" key={data?._id} data-testid="modal-list-item">
                <div className="modal-comments-container-list-item-display">
                  <div className="user-img">
                    <Avatar
                      name={data?.username}
                      bgColor={data?.avatarColor}
                      textColor="#ffffff"
                      size={45}
                      avatarSrc={data?.profilePicture}
                    />
                  </div>
                  <div className="modal-comments-container-list-item-display-block">
                    <div className="comment-data">
                      <h1>{data?.username}</h1>
                      <p>{data?.comment}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </ReactionWrapper>
    </>
  );
};
export default CommentsModal;
