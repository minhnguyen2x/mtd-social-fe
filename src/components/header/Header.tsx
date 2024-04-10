import { useState, useEffect, useRef } from 'react';
import logo from '@shared/assets/images/logo.svg';
import { FaCaretDown, FaCaretUp, FaRegBell, FaRegEnvelope } from 'react-icons/fa';

import '@components/header/Header.scss';
import Avatar from '@components/avatar/Avatar';
import { Utils } from '@shared/services/utils/utils.service';
import useDetectOutsideClick from '@shared/hooks/useDetectOutsideClick';
import MessageSidebar from '@components/message-sidebar/MessageSidebar';
import { useAppDispatch } from '@shared/hooks/use-app-dispatch';
import { useAppSelector } from '@shared/hooks/use-app-selector';
import Dropdown from '@components/dropdown/Dropdown';
import useEffectOnce from '@shared/hooks/useEffectOnce';
import { ProfileUtils } from '@shared/services/utils/profile-utils.service';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { useLocalStorage } from '@shared/hooks/useLocalStorage';
import { useSessionStorage } from '@shared/hooks/useSessionStorage';
import { userService } from '@shared/services/api/user/user.service';
import HeaderSkeleton from '@components/header/HeaderSkeleton';
import { notificationService } from '@shared/services/api/notifications/notification.service';
import { NotificationUtils } from '@shared/services/utils/notification-utils.service';
import NotificationPreview from '@components/dialog/NotificationPreview';
import { socketService } from '@shared/services/socket/socket.service';
import { sumBy } from 'lodash';
import { ChatUtils } from '@shared/services/utils/chat-utils.service';
import { chatService } from '@shared/services/api/chat/chat.service';
import { getConversationList } from '@shared/redux-toolkit/api/chat';

const Header = () => {
  const { profile } = useAppSelector((state) => state.user);
  const { chatList } = useAppSelector((state) => state.chat);
  const [environment, setEnvironment] = useState('');
  const [settings, setSettings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationDialogContent, setNotificationDialogContent] = useState({
    post: '',
    imgUrl: '',
    comment: '',
    reaction: '',
    senderName: ''
  });
  const [messageCount, setMessageCount] = useState(0);
  const [messageNotifications, setMessageNotifications] = useState([]);
  const messageRef = useRef(null);
  const notificationRef = useRef(null);
  const settingsRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [isMessageActive, setIsMessageActive] = useDetectOutsideClick(messageRef, false);
  const [isNotificationActive, setIsNotificationActive] = useDetectOutsideClick(notificationRef, false);
  const [isSettingsActive, setIsSettingsActive] = useDetectOutsideClick(settingsRef, false);
  const storedUsername = useLocalStorage('username', 'get');
  const [deleteStorageUsername] = useLocalStorage('username', 'delete');
  const [setLoggedIn] = useLocalStorage('keepLoggedIn', 'set');
  const [deleteSessionPageReload] = useSessionStorage('pageReload', 'delete');

  const backgrounColor = `${
    environment === 'DEV' || environment === 'LOCAL' ? '#50b5ff' : environment === 'STG' ? '#e9710f' : ''
  }`;

  const getUserNotifications = async () => {
    try {
      const response = await notificationService.getUserNotifications();
      const mappedNotifications = NotificationUtils.mapNotificationDropdownItems(
        response.data.notifications,
        setNotificationCount
      );
      setNotifications(mappedNotifications);
      socketService?.socket.emit('setup', { userId: storedUsername });
    } catch (error) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };

  const onMarkAsRead = async (notification) => {
    try {
      NotificationUtils.markMessageAsRead(notification?._id, notification, setNotificationDialogContent);
    } catch (error) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };

  const onDeleteNotification = async (messageId) => {
    try {
      const response = await notificationService.deleteNotification(messageId);
      Utils.dispatchNotification(response.data.message, 'success', dispatch);
    } catch (error) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };

  const openChatPage = async (notification) => {
    try {
      const params = ChatUtils.chatUrlParams(notification, profile);
      ChatUtils.joinRoomEvent(notification, profile);
      ChatUtils.privateChatMessages = [];
      const receiverId =
        notification?.receiverUsername !== profile?.username ? notification?.receiverId : notification?.senderId;
      if (notification?.receiverUsername === profile?.username && !notification.isRead) {
        await chatService.markMessagesAsRead(profile?._id, receiverId);
      }
      const userTwoName =
        notification?.receiverUsername !== profile?.username
          ? notification?.receiverUsername
          : notification?.senderUsername;
      await chatService.addChatUsers({ userOne: profile?.username, userTwo: userTwoName });
      navigate(`/app/social/chat/messages?${createSearchParams(params)}`);
      setIsMessageActive(false);
      dispatch(getConversationList());
    } catch (error) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };

  const onLogout = async () => {
    try {
      setLoggedIn(false);
      Utils.clearStore({ dispatch, deleteStorageUsername, deleteSessionPageReload, setLoggedIn });
      await userService.logoutUser();
      navigate('/');
    } catch (error) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };

  useEffectOnce(() => {
    Utils.mapSettingsDropdownItems(setSettings);
    getUserNotifications();
  });

  useEffect(() => {
    const env = Utils.appEnvironment();
    setEnvironment(env);
    const count = sumBy(chatList, (notification) => {
      return !notification.isRead && notification.receiverUsername === profile?.username ? 1 : 0;
    });
    setMessageCount(count);
    setMessageNotifications(chatList);
  }, [chatList, profile]);

  useEffect(() => {
    NotificationUtils.socketIONotification(profile, notifications, setNotifications, 'header', setNotificationCount);
    NotificationUtils.socketIOMessageNotification(
      profile,
      messageNotifications,
      setMessageNotifications,
      setMessageCount,
      dispatch,
      location
    );
  }, [profile, notifications, dispatch, location, messageNotifications]);

  return (
    <>
      {!profile ? (
        <HeaderSkeleton />
      ) : (
        <div className="header-nav-wrapper" data-testid="header-wrapper">
          {isMessageActive && (
            <div ref={messageRef}>
              <MessageSidebar
                profile={profile}
                messageCount={messageCount}
                messageNotifications={messageNotifications}
                openChatPage={openChatPage}
              />
            </div>
          )}
          {notificationDialogContent?.senderName && (
            <NotificationPreview
              title="Your post"
              post={notificationDialogContent?.post}
              imgUrl={notificationDialogContent?.imgUrl}
              comment={notificationDialogContent?.comment}
              reaction={notificationDialogContent?.reaction}
              senderName={notificationDialogContent?.senderName}
              secondButtonText="Close"
              secondBtnHandler={() => {
                setNotificationDialogContent({
                  post: '',
                  imgUrl: '',
                  comment: '',
                  reaction: '',
                  senderName: ''
                });
              }}
            />
          )}
          <div className="header-navbar">
            <div className="header-image" data-testid="header-image" onClick={() => navigate('/app/social/streams')}>
              <img src={logo} className="img-fluid" alt="" />
              <div className="app-name">
                MTD-Social
                {environment && (
                  <span className="environment" style={{ backgroundColor: `${backgrounColor}` }}>
                    {environment}
                  </span>
                )}
              </div>
            </div>
            <div className="header-menu-toggle">
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </div>
            <ul className="header-nav">
              <li
                data-testid="notification-list-item"
                className="header-nav-item active-item"
                onClick={() => {
                  setIsMessageActive(false);
                  setIsNotificationActive(true);
                  setIsSettingsActive(false);
                }}
              >
                <span className="header-list-name">
                  <FaRegBell className="header-list-icon" />
                  {notificationCount > 0 && (
                    <span className="bg-danger-dots dots" data-testid="notification-dots">
                      {notificationCount}
                    </span>
                  )}
                </span>
                {isNotificationActive && (
                  <ul className="dropdown-ul" ref={notificationRef}>
                    <li className="dropdown-li">
                      <Dropdown
                        height={300}
                        style={{ right: '250px', top: '20px' }}
                        data={notifications}
                        notificationCount={notificationCount}
                        title="Notifications"
                        onMarkAsRead={onMarkAsRead}
                        onDeleteNotification={onDeleteNotification}
                      />
                    </li>
                  </ul>
                )}
                &nbsp;
              </li>
              <li
                data-testid="message-list-item"
                className="header-nav-item active-item"
                onClick={() => {
                  setIsMessageActive(true);
                  setIsNotificationActive(false);
                  setIsSettingsActive(false);
                }}
              >
                <span className="header-list-name">
                  <FaRegEnvelope className="header-list-icon" />
                  {messageCount > 0 && <span className="bg-danger-dots dots" data-testid="messages-dots"></span>}
                </span>
                &nbsp;
              </li>
              <li
                data-testid="settings-list-item"
                className="header-nav-item"
                onClick={() => {
                  setIsSettingsActive(!isSettingsActive);
                  setIsMessageActive(false);
                  setIsNotificationActive(false);
                }}
              >
                <span className="header-list-name profile-image">
                  <Avatar
                    name={profile?.username}
                    bgColor={profile?.avatarColor}
                    textColor="#ffffff"
                    size={40}
                    avatarSrc={profile?.profilePicture}
                  />
                </span>
                <span className="header-list-name profile-name">
                  {profile?.username}
                  {!isSettingsActive ? (
                    <FaCaretDown className="header-list-icon caret" />
                  ) : (
                    <FaCaretUp className="header-list-icon caret" />
                  )}
                </span>
                {isSettingsActive && (
                  <ul className="dropdown-ul" ref={settingsRef}>
                    <li className="dropdown-li">
                      <Dropdown
                        height={300}
                        style={{ right: '150px', top: '40px' }}
                        data={settings}
                        notificationCount={0}
                        title="Settings"
                        onLogout={onLogout}
                        onNavigate={() => ProfileUtils.navigateToProfile(profile, navigate)}
                      />
                    </li>
                  </ul>
                )}
                <ul className="dropdown-ul">
                  <li className="dropdown-li"></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};
export default Header;
