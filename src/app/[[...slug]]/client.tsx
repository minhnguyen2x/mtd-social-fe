'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ReduxStoreProvider } from '@shared/components/redux-store-provider';
import '@shared/styles/index.scss';

const App = dynamic(() => import('../../app').then((module) => ({ default: module.App })), { ssr: false });

export function ClientOnly() {
  return (
    <ReduxStoreProvider>
      <App />
    </ReduxStoreProvider>
  );
}
