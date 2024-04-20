'use client';
import { useEffect, useState } from 'react';
import '@app/(auth)/auth-tabs/auth-tabs.scss';
import backgroundImage from '@shared/assets/images/background.jpg';
import { Login } from '@features/authentication/components/login/login';
import { Register } from '@features/authentication/components/register/register';
import { useLocalStorage } from '@shared/hooks/useLocalStorage';
import { Utils } from '@shared/services/utils/utils.service';
import PageLoader from '@components/page-loader/PageLoader';
import { useRouter } from 'next/navigation';

const AuthTabs = () => {
  const [type, setType] = useState('Sign In');
  const keepLoggedIn = useLocalStorage('keepLoggedIn', 'get');
  const [environment, setEnvironment] = useState('');
  const router = useRouter();

  useEffect(() => {
    const env = Utils.appEnvironment();
    setEnvironment(env);
    if (keepLoggedIn) router.push('/app/social/streams');
  }, [keepLoggedIn, router]);

  return (
    <>
      {keepLoggedIn ? (
        <PageLoader />
      ) : (
        <div className="container-wrapper" style={{ backgroundImage: `url(${backgroundImage})` }}>
          <div className="environment">{environment}</div>
          <div className="container-wrapper-auth">
            <div className="tabs">
              <div className="tabs-auth">
                <ul className="tab-group">
                  <li className={`tab ${type === 'Sign In' ? 'active' : ''}`} onClick={() => setType('Sign In')}>
                    <button className="login">Sign In</button>
                  </li>
                  <li className={`tab ${type === 'Sign Up' ? 'active' : ''}`} onClick={() => setType('Sign Up')}>
                    <button className="signup">Sign Up</button>
                  </li>
                </ul>
                {type === 'Sign In' && (
                  <div className="tab-item">
                    <Login />
                  </div>
                )}
                {type === 'Sign Up' && (
                  <div className="tab-item">
                    <Register />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AuthTabs;
