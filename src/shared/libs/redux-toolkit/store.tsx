import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import userReducer from '@shared/libs/redux-toolkit/reducers/user/user.reducer';
import suggestionsReducer from '@shared/libs/redux-toolkit/reducers/suggestions/suggestions.reducer';
import notificationReducer from '@shared/libs/redux-toolkit/reducers/notifications/notification.reducer';
import modalReducer from '@shared/libs/redux-toolkit/reducers/modal/modal.reducer';
import postReducer from '@shared/libs/redux-toolkit/reducers/post/post.reducer';
import postsReducer from '@shared/libs/redux-toolkit/reducers/post/posts.reducer';
import userPostReactionReducer from '@shared/libs/redux-toolkit/reducers/post/user-post-reaction.reducer';
import chatReducer from '@shared/libs/redux-toolkit/reducers/chat/chat.reducer';
import { mtdSocialAPIRTKQ } from '@shared/libs/redux-toolkit/rtk-query';

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      user: userReducer,
      suggestions: suggestionsReducer,
      notifications: notificationReducer,
      modal: modalReducer,
      post: postReducer,
      allPosts: postsReducer,
      userPostReactions: userPostReactionReducer,
      chat: chatReducer,
      [mtdSocialAPIRTKQ.reducerPath]: mtdSocialAPIRTKQ.reducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: true
      }).concat(mtdSocialAPIRTKQ.middleware)
  });

  setupListeners(store.dispatch);

  return store;
};
