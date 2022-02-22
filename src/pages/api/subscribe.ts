import { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "../../services/stripe";
import { getSession } from 'next-auth/react';

export default async function CreateNewCheckoutSession (request: NextApiRequest, response: NextApiResponse) {
  if (request.method === 'POST') {
    const session = await getSession({ req: request });

    const stripeCustomer = await stripe.customers.create({
      email: session.user.email
    })
  
    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomer.id,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [
        { price: 'price_1KUBBDDZVlnLB2EzdpjQrR4b', quantity: 1 }
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.CANCEL_URL
    });

    return response.status(200).json({ sessionId: stripeCheckoutSession.id });

  } else {
    response.setHeader('Allow', 'POST');
    return response.status(405).end('Methot not allowed');
  }
}