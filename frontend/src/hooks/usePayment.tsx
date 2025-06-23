import { useMutation } from '@tanstack/react-query';
import { initiateCheckout } from '@/services/paymentService';

export const useCheckout = () => {
  return useMutation({
    mutationFn: initiateCheckout,
    onSuccess: (data) => {
      if (data?.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout
      }
    },
  });
};
