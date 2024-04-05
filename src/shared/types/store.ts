import { store } from '@shared/redux-toolkit/store';

export type StoreState = ReturnType<typeof store.getState>;

export type StoreDispatch = typeof store.dispatch;
