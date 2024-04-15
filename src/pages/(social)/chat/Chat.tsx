import ChatList from '@components/chat/list/ChatList';
import ChatWindow from '@components/chat/window/ChatWindow';
import useEffectOnce from '@shared/hooks/useEffectOnce';
import styles from '@pages/(social)/chat/chat.module.scss';
import { getConversationList } from '@shared/libs/redux-toolkit/api/chat';
import { useAppSelector } from '@shared/hooks/use-app-selector';
import { useAppDispatch } from '@shared/hooks/use-app-dispatch';
import { FunctionComponent } from 'react';

export const Chat: FunctionComponent = () => {
  const { selectedChatUser, chatList } = useAppSelector((state) => state.chat);
  const dispatch = useAppDispatch();

  useEffectOnce(() => {
    dispatch(getConversationList());
  });

  return (
    <div className={styles['private-chat-wrapper']}>
      <div className={styles['private-chat-wrapper-content']}>
        <div className={styles['private-chat-wrapper-content-side']}>
          <ChatList />
        </div>
        <div className={styles['private-chat-wrapper-content-conversation']}>
          {(selectedChatUser || chatList.length > 0) && <ChatWindow />}
          {!selectedChatUser && !chatList.length && (
            <div className={styles['no-chat']} data-testid="no-chat">
              Select or Search for users to chat with
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
