import { useEffect, useCallback, useRef, useState, FunctionComponent } from 'react';
import { cloneDeep } from 'lodash';
import styles from '@shared/components/toast/toast.module.scss';
import { Utils } from '@shared/services/utils/utils.service';
import { useAppDispatch } from '@shared/hooks/use-app-dispatch';

export interface ToastProps {
  toastList: any[];
  position: string;
  autoDelete: boolean;
  autoDeleteTime?: number;
}

export const Toast: FunctionComponent<ToastProps> = ({ toastList, position, autoDelete, autoDeleteTime = 2000 }) => {
  const [list, setList] = useState(toastList);
  const listData = useRef<any[]>([]);

  const dispatch = useAppDispatch();

  const deleteToast = useCallback(() => {
    listData.current = cloneDeep(list);
    listData.current.splice(0, 1);
    setList([...listData.current]);
    if (!listData.current.length) {
      list.length = 0;
      Utils.dispatchClearNotification({ dispatch });
    }
  }, [list, dispatch]);

  useEffect(() => {
    setList([...toastList]);
  }, [toastList]);

  useEffect(() => {
    const tick = () => {
      deleteToast();
    };

    if (autoDelete && toastList.length && list.length) {
      const interval = setInterval(tick, autoDeleteTime);
      return () => clearInterval(interval);
    }
  }, [toastList, autoDelete, autoDeleteTime, list, deleteToast]);

  return (
    <div className={`${styles['toast-notification-container']} ${position}`}>
      {list.map((toast) => (
        <div
          data-testid="toast-notification"
          key={Utils.generateString(10)}
          className={`${styles['toast-notification']} ${styles['toast']} ${position}`}
          style={{ backgroundColor: toast.backgroundColor }}
        >
          <button className={styles['cancel-button']} onClick={() => deleteToast()}>
            X
          </button>
          <div
            className={`${styles['toast-notification-image']} ${
              toast.description.length <= 73 ? styles['toast-icon'] : ''
            }`}
          >
            <img src={toast.icon} alt="" />
          </div>
          <div
            className={`${styles['toast-notification-message']} ${
              toast.description.length <= 73 ? styles['toast-message'] : ''
            }`}
          >
            {toast.description}
          </div>
        </div>
      ))}
    </div>
  );
};
