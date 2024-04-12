import { ResetPassword } from '@pages/(auth)/reset-password/reset-password';
import { ForgotPassword } from '@pages/(auth)/forgot-password/forgot-password';
import { AuthTabs } from '@pages/(auth)/auth-tabs/auth-tabs';
import Error from '@pages/error/Error';
import { ProtectedRoute } from '@shared/components/routes/protected-route';
import { useRoutes } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import StreamsSkeleton from '@pages/social/streams/StreamsSkeleton';
import NotificationSkeleton from '@pages/social/notifications/NotificationSkeleton';
import CardSkeleton from '@components/card-element/CardSkeleton';
import PhotoSkeleton from '@pages/social/photos/PhotoSkeleton';
import ProfileSkeleton from '@pages/social/profile/ProfileSkeleton';
import ChatSkeleton from '@pages/social/chat/ChatSkeleton';
import VideoSkeleton from '@pages/social/videos/VideoSkeleton';
import { AppRoute } from '@shared/constants/app-routes';

const Social = lazy(() => import('@pages/social/Social'));
const Chat = lazy(() => import('@pages/social/chat/Chat'));
const Followers = lazy(() => import('@pages/social/followers/Followers'));
const Following = lazy(() => import('@pages/social/following/Following'));
const Notification = lazy(() => import('@pages/social/notifications/Notification'));
const People = lazy(() => import('@pages/social/people/People'));
const Photos = lazy(() => import('@pages/social/photos/Photos'));
const Videos = lazy(() => import('@pages/social/videos/Videos'));
const Profile = lazy(() => import('@pages/social/profile/Profile'));
const Streams = lazy(() => import('@pages/social/streams/Streams'));

export const AppRouter = () => {
  const elements = useRoutes([
    {
      path: AppRoute.AuthTabs,
      element: <AuthTabs />
    },
    {
      path: AppRoute.ForgotPassword,
      element: <ForgotPassword />
    },
    {
      path: AppRoute.ResetPassword,
      element: <ResetPassword />
    },
    {
      path: AppRoute.Social,
      element: (
        <ProtectedRoute>
          <Social />
        </ProtectedRoute>
      ),
      children: [
        {
          path: AppRoute.Streams,
          element: (
            <Suspense fallback={<StreamsSkeleton />}>
              <Streams />
            </Suspense>
          )
        },
        {
          path: AppRoute.Chat,
          element: (
            <Suspense fallback={<ChatSkeleton />}>
              <Chat />
            </Suspense>
          )
        },
        {
          path: AppRoute.People,
          element: (
            <Suspense fallback={<CardSkeleton />}>
              <People />
            </Suspense>
          )
        },
        {
          path: AppRoute.Followers,
          element: (
            <Suspense fallback={<CardSkeleton />}>
              <Followers />
            </Suspense>
          )
        },
        {
          path: AppRoute.Following,
          element: (
            <Suspense fallback={<CardSkeleton />}>
              <Following />
            </Suspense>
          )
        },
        {
          path: AppRoute.Photos,
          element: (
            <Suspense fallback={<PhotoSkeleton />}>
              <Photos />
            </Suspense>
          )
        },
        {
          path: AppRoute.Videos,
          element: (
            <Suspense fallback={<VideoSkeleton />}>
              <Videos />
            </Suspense>
          )
        },
        {
          path: AppRoute.Notification,
          element: (
            <Suspense fallback={<NotificationSkeleton />}>
              <Notification />
            </Suspense>
          )
        },
        {
          path: AppRoute.Profile,
          element: (
            <Suspense fallback={<ProfileSkeleton />}>
              <Profile />
            </Suspense>
          )
        }
      ]
    },
    {
      path: AppRoute.Others,
      element: <Error />
    }
  ]);

  return elements;
};
