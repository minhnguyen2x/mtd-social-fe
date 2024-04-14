import { App } from '@root/app';
import React from 'react';
import ReactDOM from 'react-dom/client';
import '@shared/styles/index.scss';
import { Provider } from 'react-redux';
import { store } from '@shared/libs/redux-toolkit/store';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
