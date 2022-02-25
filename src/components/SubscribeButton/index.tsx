import styles from './styles.module.scss';
import { useSession, signIn } from 'next-auth/react';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';

// Typing the subscribe button properties
interface SubscribeButtonProps {
  priceId: string;
}

// Button for the subscribe action
export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  // Get the session info (next-auth)
  const { data, status } = useSession();
  
  // Function who handles with subscribe button click
  async function handleSubscribe() {
    // Ensures an existing session (the user should be logged in to subscribe)
    if (status !== 'authenticated') {
      signIn('github');
      return;
    }
    
    // Checkout session creation
    try {
      // Submits a request for the node server of Next on subscribe route (create a new checkout session)
      const response = await api.post('/subscribe');

      // Destructuring sessionId from response data
      const { sessionId } = response.data;

      // Get stripe sdk for front-end by stripe-js archive
      const stripe = await getStripeJs();

      // Redirect user to payment page (checkout page)
      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      // Shows the error message on a "alert" modal
      alert(err.message);
    }
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