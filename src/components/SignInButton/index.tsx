import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import styles from './styles.module.scss';

import { signIn, signOut, useSession } from 'next-auth/react';

// Button for login on the app
export function SignInButton() {
  // Get the session info (next-auth)
  const { status, data } = useSession();
  
  // Returns different buttons depending the session status
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