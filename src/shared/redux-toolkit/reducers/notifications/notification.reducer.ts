import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import checkIcon from '@shared/assets/images/check.svg';
import errorIcon from '@shared/assets/images/error.svg';
import infoIcon from '@shared/assets/images/info.svg';
import warningIcon from '@shared/assets/images/warning.svg';
import { cloneDeep, uniqBy } from 'lodash';

export type Notification = {
  id: number;
  description: string;
  type: string;
  icon: string;
  backgroundColor: string;
};

export type NotificationState = Notification[];

const initialState: NotificationState = [];

let list: Notification[] = [];

type ToastIconBase = { color: string };
type ToastIconVariants = { success: string } | { error: string } | { info: string } | { warning: string };
type ToastIcon = ToastIconBase & ToastIconVariants;

const toastIcons: ToastIcon[] = [
  { success: checkIcon, color: '#5cb85c' },
  { error: errorIcon, color: '#d9534f' },
  { info: infoIcon, color: '#5bc0de' },
  { warning: warningIcon, color: '#f0ad4e' }
];

export type AddNotificationPayload = {
  message: string;
  type: keyof ToastIconVariants;
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<AddNotificationPayload>) => {
      const { message, type } = action.payload;
      const icon = toastIcons.find((icon) => icon[type]);
      if (!icon) return state;

      const toastItem = {
        id: state.length,
        description: message,
        type,
        icon: icon[type],
        backgroundColor: icon.color
      };
      list = cloneDeep(list);
      list.unshift(toastItem);
      list = [...uniqBy(list, 'description')];
      return list;
    },
    clearNotification: () => {
      list = [];
      return [];
    }
  }
});

export const { addNotification, clearNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;
