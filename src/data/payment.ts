import type { PaymentDetails } from '../pages/payment-page';

export function createPaymentDetails(nameOnCard: string): PaymentDetails {
  // Synthetic details for the exercise website
  return {
    nameOnCard,
    cardNumber: '4242424242424242',
    cvc: '123',
    expiryMonth: '12',
    expiryYear: String(new Date().getUTCFullYear() + 2),
  };
}
