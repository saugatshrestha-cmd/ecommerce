import { api } from "@/utils/api";

export const initiateCheckout = async (orderId: string) => {
    const res = await api.post('/payment/create-checkout-session', { orderId });
    return res.data as { url: string };
};