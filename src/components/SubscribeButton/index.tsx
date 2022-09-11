import styles from "./styles.module.scss";
import { useSession, signIn } from "next-auth/react";
import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";
import { useRouter } from "next/router";

// Button for the subscribe action
export function SubscribeButton() {
  const { data, status } = useSession(); // Get the session info (next-auth)
  const route = useRouter(); // Get the route (next/route)

  // Function who handles with subscribe button click
  async function handleSubscribe() {
    // Ensures an existing session (the user should be logged in to subscribe)
    if (status !== "authenticated") {
      signIn("github");
      return;
    }

    // Ensures that only non subscribed users can create a subscription
    if (data.activeSubscription) {
      route.push("/");
      alert("You have an active subscription!");
      return;
    }

    // Checkout session creation
    try {
      // Submits a request for the node server of Next on subscribe route (create a new checkout session)
      const response = await api.post("/subscribe");

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

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
}
