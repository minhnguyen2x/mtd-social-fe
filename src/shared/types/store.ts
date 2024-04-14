import { store } from '@shared/libs/redux-toolkit/store';

export type StoreState = ReturnType<typeof store.getState>;

export type StoreDispatch = typeof store.dispatch;
