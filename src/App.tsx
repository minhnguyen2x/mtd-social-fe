import { AppRouter } from '@root/routes';
import { BrowserRouter } from 'react-router-dom';
import '@shared/styles/app.scss';
import Toast from '@components/toast/Toast';
import { useAppSelector } from '@shared/hooks/use-app-selector';

export const App = () => {
  const { notifications } = useAppSelector((state) => state);

  return (
    <>
      {notifications && notifications.length > 0 && (
        <Toast position="top-right" toastList={notifications} autoDelete={true} />
      )}
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </>
  );
};
