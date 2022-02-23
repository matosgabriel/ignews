import { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "../../services/stripe";
import { getSession } from 'next-auth/react';
import { fauna } from "../../services/fauna";
import { query as q } from 'faunadb';

type User = {
  ref: {
    id: string;
  };
  data: {
    stripe_customer_id: string;
  }
}

export default async function CreateNewCheckoutSession (request: NextApiRequest, response: NextApiResponse) {
  if (request.method === 'POST') {
    const session = await getSession({ req: request });

    const user = await fauna.query<User>(
      q.Get(
        q.Match(
          q.Index('user_by_email'),
          q.Casefold(session.user.email) // Normaliza em caixa baixa
        )
      )
    );

    let customerId = user.data.stripe_customer_id;

    if (!customerId) {
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email
      });

      await fauna.query(
        q.Update(
          q.Ref(q.Collection('users'), user.ref.id),
          { data: { stripe_customer_id: stripeCustomer.id } }
        )
      );

      customerId = stripeCustomer.id;
    }

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [
        { price: 'price_1KUBBDDZVlnLB2EzdpjQrR4b', quantity: 1 }
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL
    });

    return response.status(200).json({ sessionId: stripeCheckoutSession.id });

  } else {
    response.setHeader('Allow', 'POST');
    return response.status(405).end('Methot not allowed');
  }
}