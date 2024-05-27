import type { Metadata } from 'next';
import { ReduxStoreProvider } from '@shared/components/redux-store-provider';
import '@shared/styles/index.scss';
import '@shared/styles/app.scss';

export const metadata: Metadata = {
  title: 'MTD-Social',
  description: 'Web site created using create-next-app'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/logo192.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <ReduxStoreProvider>
          <div id="root">{children}</div>
        </ReduxStoreProvider>
      </body>
    </html>
  );
}
