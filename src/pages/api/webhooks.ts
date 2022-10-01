import { NextApiRequest, NextApiResponse } from "next";

import { Readable } from "stream";
import Stripe from "stripe";
import { stripe } from "../../services/stripe";
import { saveSubscription } from "./_lib/manageSubscription";

// Converts Stream request in a traditional HTTP request
async function buffer(readable: Readable) {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

async function WebhooksHandler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === "POST") {
    const buf = await buffer(request);
    const secret = request.headers["stripe-signature"];

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        buf,
        secret,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return response
        .status(400)
        .json({ error: `Webhook error: ${err.message}`, request });
    }

    const eventType = event.type;

    // Handled event
    if (relevantEvents.has(eventType)) {
      try {
        switch (eventType) {
          case "customer.subscription.updated":
          case "customer.subscription.deleted":
            const subscription = event.data.object as Stripe.Subscription;

            await saveSubscription(
              subscription.id,
              subscription.customer.toString(),
              false
            );
            break;
          case "checkout.session.completed":
            const checkoutSession = event.data
              .object as Stripe.Checkout.Session;

            await saveSubscription(
              checkoutSession.subscription.toString(),
              checkoutSession.customer.toString(),
              true
            );
            break;
          default:
            throw new Error("Unhandled event.");
        }
      } catch (err) {
        return response.json({ error: "Webhook handler failed." });
      }
      console.log("Evento interessante!!!", event);
    }

    return response.json({ status: "received" });
  } else {
    response.setHeader("Allow", "POST");
    return response.status(405).end("Method not allowed");
  }
}

export default WebhooksHandler;
