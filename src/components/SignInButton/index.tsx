import { useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import styles from './styles.module.scss';

export function SignInButton() {
  const [isUserLogged, setIsUserLogged] = useState(false);
  
  return (
    <button type='button' className={styles.signInButton}>
      <FaGithub size={20} color="#eba417"/>
      Sign in with Github
    </button>
  );
}