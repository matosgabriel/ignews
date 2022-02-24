import { useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import styles from './styles.module.scss';

import { signIn, signOut, useSession } from 'next-auth/react';

export function SignInButton() {
  const { status, data } = useSession();
  
  return status === 'authenticated' ? (
    <button type='button' className={styles.signInButton} onClick={() => signOut()}>
      <FaGithub size={20} color="#04d361"/>
      { data.user.name }
      <FiX size={20} color="#737380" className={styles.closeIcon} />
    </button>
  ) : (
    <button type='button' className={styles.signInButton} onClick={() => signIn('github')}>
      <FaGithub size={20} color="#eba417"/>
      Sign in with Github
    </button>
  )
}