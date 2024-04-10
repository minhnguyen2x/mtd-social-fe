import { Input } from '@shared/components/input/input';
import PropTypes from 'prop-types';
import '@components/posts/comments/comment-input/CommentInputBox.scss';
import { useAppDispatch } from '@shared/hooks/use-app-dispatch';
import { useAppSelector } from '@shared/hooks/use-app-selector';
import { useEffect, useRef, useState } from 'react';
import { Utils } from '@shared/services/utils/utils.service';
import { cloneDeep } from 'lodash';
import { socketService } from '@shared/services/socket/socket.service';
import { postService } from '@shared/services/api/post/post.service';

const CommentInputBox = ({ post }) => {
  const { profile } = useAppSelector((state) => state.user);
  const [comment, setComment] = useState('');
  const commentInputRef = useRef(null);
  const dispatch = useAppDispatch();

  const submitComment = async (event) => {
    event.preventDefault();
    try {
      post = cloneDeep(post);
      post.commentsCount += 1;
      const commentBody = {
        userTo: post?.userId,
        postId: post?._id,
        comment: comment.trim(),
        commentsCount: post.commentsCount,
        profilePicture: profile?.profilePicture
      };
      socketService?.socket?.emit('comment', commentBody);
      await postService.addComment(commentBody);
      setComment('');
    } catch (error) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };

  useEffect(() => {
    if (commentInputRef?.current) {
      commentInputRef.current.focus();
    }
  }, []);

  return (
    <div className="comment-container" data-testid="comment-input">
      <form className="comment-form" onSubmit={submitComment}>
        <Input
          ref={commentInputRef}
          name="comment"
          type="text"
          value={comment}
          labelText=""
          className="comment-input"
          placeholder="Write a comment..."
          handleChange={(event) => setComment(event.target.value)}
        />
      </form>
    </div>
  );
};
CommentInputBox.propTypes = {
  post: PropTypes.object
};
export default CommentInputBox;
