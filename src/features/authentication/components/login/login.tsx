import { useState, useEffect, FunctionComponent } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { Input } from '@shared/components/input/input';
import { Button } from '@shared/components/button/button';
import { useAppDispatch } from '@shared/hooks/use-app-dispatch';
import '@features/authentication/components/login/login.scss';
import { authService } from '@shared/services/api/auth/auth.service';
import { useLocalStorage } from '@shared/hooks/useLocalStorage';
import { Utils } from '@shared/services/utils/utils.service';
import { useSessionStorage } from '@shared/hooks/useSessionStorage';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export const Login: FunctionComponent = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [user, setUser] = useState();
  const [setStoredUsername] = useLocalStorage('username', 'set');
  const [setLoggedIn] = useLocalStorage('keepLoggedIn', 'set');
  const [pageReload] = useSessionStorage('pageReload', 'set');
  const router = useRouter();
  const dispatch = useAppDispatch();

  const loginUser = async (event: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    event.preventDefault();
    try {
      const result = await authService.signIn({
        username,
        password
      });
      setLoggedIn(keepLoggedIn);
      setStoredUsername(username);
      setHasError(false);
      setAlertType('alert-success');
      Utils.dispatchUser(result, pageReload, dispatch, setUser);
    } catch (error) {
      setLoading(false);
      setHasError(true);
      setAlertType('alert-error');
      setErrorMessage((error as any)?.response?.data.message);
    }
  };

  useEffect(() => {
    if (loading && !user) return;
    if (user) router.push('/app/social/streams');
  }, [loading, user, router]);

  return (
    <div className="auth-inner">
      {hasError && errorMessage && (
        <div className={`alerts ${alertType}`} role="alert">
          {errorMessage}
        </div>
      )}
      <form className="auth-form" onSubmit={loginUser}>
        <div className="form-input-container">
          <Input
            id="username"
            name="username"
            type="text"
            value={username}
            labelText="Username"
            placeholder="Enter Username"
            style={{ border: `${hasError ? '1px solid #fa9b8a' : ''}` }}
            handleChange={(event: React.ChangeEvent<HTMLInputElement>) => setUsername(event.target.value)}
          />
          <Input
            id="password"
            name="password"
            type="password"
            value={password}
            labelText="Password"
            placeholder="Enter Password"
            style={{ border: `${hasError ? '1px solid #fa9b8a' : ''}` }}
            handleChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
          />
          <label className="checkmark-container" htmlFor="checkbox">
            <Input
              id="checkbox"
              name="checkbox"
              type="checkbox"
              value={keepLoggedIn}
              handleChange={() => setKeepLoggedIn(!keepLoggedIn)}
            />
            Keep me signed in
          </label>
        </div>
        <Button
          label={`${loading ? 'SIGNIN IN PROGRESS...' : 'SIGNIN'}`}
          className="auth-button button"
          disabled={!username || !password}
        />

        <Link href={'/forgot-password'}>
          <span className="forgot-password">
            Forgot password? <FaArrowRight className="arrow-right" />
          </span>
        </Link>
      </form>
    </div>
  );
};
