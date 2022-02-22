import styles from './styles.module.scss';
import { useSession, signIn } from 'next-auth/react';

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const { data, status } = useSession();
  
  function handleSubscribe() {
    if (status !== 'authenticated') {
      signIn('github');
      return;
    }

    // criação da checkout session
  }
  
  return(
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
}