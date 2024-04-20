import { makeStore } from '@shared/libs/redux-toolkit/store';

export type AppStore = ReturnType<typeof makeStore>;

export type StoreState = ReturnType<AppStore['getState']>;

export type StoreDispatch = AppStore['dispatch'];
