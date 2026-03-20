import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

export async function createDepositPaymentIntent(
  amount: number,
  bookingId: string,
  clientEmail: string
) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: "chf",
    receipt_email: clientEmail,
    metadata: { bookingId },
    description: `Acompte réservation #${bookingId}`,
  });
  return paymentIntent;
}
