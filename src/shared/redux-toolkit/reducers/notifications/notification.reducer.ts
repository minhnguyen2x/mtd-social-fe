import { createSlice } from '@reduxjs/toolkit';
import checkIcon from '@shared/assets/images/check.svg';
import errorIcon from '@shared/assets/images/error.svg';
import infoIcon from '@shared/assets/images/info.svg';
import warningIcon from '@shared/assets/images/warning.svg';
import { cloneDeep, uniqBy } from 'lodash';

const initialState = [];
let list = [];
const toastIcons = [
  { success: checkIcon, color: '#5cb85c' },
  { error: errorIcon, color: '#d9534f' },
  { info: infoIcon, color: '#5bc0de' },
  { warning: warningIcon, color: '#f0ad4e' }
];

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      const { message, type } = action.payload;
      const toast = toastIcons.find((toast) => toast[type]);
      const toastItem = {
        id: state.length,
        description: message,
        type,
        icon: toast[type],
        backgroundColor: toast.color
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
