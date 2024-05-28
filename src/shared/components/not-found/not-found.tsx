'use client';

import { Button } from '@shared/components/button/button';
import { useRouter } from 'next/navigation';
import styles from '@shared/components/not-found/not-found.module.scss';

export const NotFound = () => {
  const router = useRouter();

  return (
    <div className={styles['error-container']}>
      <div className={styles['oops']}>Oops!</div>
      <p className={styles['not-found']}>Error 404: Page Not Found</p>
      <Button label="Back Home" className={`${styles['back-button']} button`} handleClick={() => router.push('/')} />
    </div>
  );
};
