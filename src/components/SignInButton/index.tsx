import { useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import styles from './styles.module.scss';

export function SignInButton() {
  const [isUserLogged, setIsUserLogged] = useState(true);
  
  return isUserLogged ? (
    <button type='button' className={styles.signInButton}>
      <FaGithub size={20} color="#04d361"/>
      Gabriel Matos
      <FiX size={20} color="#737380" className={styles.closeIcon} />
    </button>
  ) : (
    <button type='button' className={styles.signInButton}>
      <FaGithub size={20} color="#eba417"/>
      Sign in with Github
    </button>
  )
}