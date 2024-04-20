'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Provider } from 'react-redux';
import { store } from '@shared/libs/redux-toolkit/store';
import '@shared/styles/index.scss';

const App = dynamic(() => import('../../app').then((module) => ({ default: module.App })), { ssr: false });

export function ClientOnly() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}
