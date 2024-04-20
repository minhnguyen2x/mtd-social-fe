'use client';
import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore } from '@shared/libs/redux-toolkit/store';
import type { AppStore } from '@shared/types/store';

type ReduxStoreProviderProps = { children: React.ReactNode };

export const ReduxStoreProvider = ({ children }: ReduxStoreProviderProps) => {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
};
