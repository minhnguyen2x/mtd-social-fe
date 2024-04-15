import ChatListSkeleton from '@components/chat/list/ChatListSkeleton';
import Spinner from '@components/spinner/Spinner';
import styles from '@pages/(social)/chat/chat.module.scss';
import { FunctionComponent } from 'react';

export const ChatSkeleton: FunctionComponent = () => {
  return (
    <div className={styles['private-chat-wrapper']}>
      <div className={styles['private-chat-wrapper-content']}>
        <div className={styles['private-chat-wrapper-content-side']}>
          <ChatListSkeleton />
        </div>
        <div className={styles['private-chat-wrapper-content-conversation']}>
          <div className="message-loading">
            <Spinner />
          </div>
        </div>
      </div>
    </div>
  );
};
