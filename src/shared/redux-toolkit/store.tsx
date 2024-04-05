import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@shared/redux-toolkit/reducers/user/user.reducer';
import suggestionsReducer from '@shared/redux-toolkit/reducers/suggestions/suggestions.reducer';
import notificationReducer from '@shared/redux-toolkit/reducers/notifications/notification.reducer';
import modalReducer from '@shared/redux-toolkit/reducers/modal/modal.reducer';
import postReducer from '@shared/redux-toolkit/reducers/post/post.reducer';
import postsReducer from '@shared/redux-toolkit/reducers/post/posts.reducer';
import userPostReactionReducer from '@shared/redux-toolkit/reducers/post/user-post-reaction.reducer';
import chatReducer from '@shared/redux-toolkit/reducers/chat/chat.reducer';

export const store = configureStore({
  reducer: {
    user: userReducer,
    suggestions: suggestionsReducer,
    notifications: notificationReducer,
    modal: modalReducer,
    post: postReducer,
    allPosts: postsReducer,
    userPostReactions: userPostReactionReducer,
    chat: chatReducer
  }
});
