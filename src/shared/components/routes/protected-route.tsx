import useEffectOnce from '@shared/hooks/useEffectOnce';
import { useLocalStorage } from '@shared/hooks/useLocalStorage';
import { useSessionStorage } from '@shared/hooks/useSessionStorage';
import { addUser } from '@shared/redux-toolkit/reducers/user/user.reducer';
import { userService } from '@shared/services/api/user/user.service';
import { Utils } from '@shared/services/utils/utils.service';
import React, { FunctionComponent, useCallback, useState } from 'react';
import { useAppSelector } from '@shared/hooks/use-app-selector';
import { useAppDispatch } from '@shared/hooks/use-app-dispatch';
import { Navigate, useNavigate } from 'react-router-dom';
import { getConversationList } from '@shared/redux-toolkit/api/chat';
import { AppRoute } from '@shared/constants/app-routes';

type ProtectedRouteProps = { children: React.ReactNode };

export const ProtectedRoute: FunctionComponent<ProtectedRouteProps> = ({ children }) => {
  const { profile, token } = useAppSelector((state) => state.user);
  const [userData, setUserData] = useState(null);
  const [tokenIsValid, setTokenIsValid] = useState(false);
  const keepLoggedIn = useLocalStorage('keepLoggedIn', 'get');
  const pageReload = useSessionStorage('pageReload', 'get');
  const [deleteStorageUsername] = useLocalStorage('username', 'delete');
  const [setLoggedIn] = useLocalStorage('keepLoggedIn', 'set');
  const [deleteSessionPageReload] = useSessionStorage('pageReload', 'delete');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const checkUser = useCallback(async () => {
    try {
      const response = await userService.checkCurrentUser();
      dispatch(getConversationList());
      setUserData(response.data.user);
      setTokenIsValid(true);
      dispatch(addUser({ token: response.data.token, profile: response.data.user }));
    } catch (error) {
      setTokenIsValid(false);
      setTimeout(async () => {
        Utils.clearStore({ dispatch, deleteStorageUsername, deleteSessionPageReload, setLoggedIn });
        await userService.logoutUser();
        navigate(AppRoute.AuthTabs);
      }, 1000);
    }
  }, [dispatch, navigate, deleteStorageUsername, deleteSessionPageReload, setLoggedIn]);

  useEffectOnce(() => {
    checkUser();
  });

  if (keepLoggedIn || (!keepLoggedIn && userData) || (profile && token) || pageReload) {
    if (!tokenIsValid) {
      return <React.Fragment></React.Fragment>;
    } else {
      return <React.Fragment>{children}</React.Fragment>;
    }
  } else {
    return <React.Fragment>{<Navigate to={AppRoute.AuthTabs} />}</React.Fragment>;
  }
};
