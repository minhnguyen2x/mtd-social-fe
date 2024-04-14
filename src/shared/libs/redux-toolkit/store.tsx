import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@shared/libs/redux-toolkit/reducers/user/user.reducer';
import suggestionsReducer from '@shared/libs/redux-toolkit/reducers/suggestions/suggestions.reducer';
import notificationReducer from '@shared/libs/redux-toolkit/reducers/notifications/notification.reducer';
import modalReducer from '@shared/libs/redux-toolkit/reducers/modal/modal.reducer';
import postReducer from '@shared/libs/redux-toolkit/reducers/post/post.reducer';
import postsReducer from '@shared/libs/redux-toolkit/reducers/post/posts.reducer';
import userPostReactionReducer from '@shared/libs/redux-toolkit/reducers/post/user-post-reaction.reducer';
import chatReducer from '@shared/libs/redux-toolkit/reducers/chat/chat.reducer';

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
