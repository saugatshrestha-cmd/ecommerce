import { useState } from 'react';
import { CreditCard, Banknote, ArrowLeft, Loader2, Shield, CheckCircle, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/context/authContext';
import { useCreateUserOrder } from '@/hooks/useOrder';
import { useCheckout } from '@/hooks/usePayment';
import { useNavigate, Link } from 'react-router-dom';
import { useCart, useCartSummary } from '@/hooks/useCart';
import ShippingSelection from '@/components/shipping/ShippingSelection';
import CartSummaryCard from "@/components/cart/Summary";
import { toast } from 'sonner';

type PaymentMethod = 'cod' | 'stripe' | null;

const CheckoutPage = () => {
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(null);
    const navigate = useNavigate();
    
    const { mutate: createOrder, isPending: creatingOrder } = useCreateUserOrder();
    const { mutate: startCheckout, isPending: isCheckoutLoading } = useCheckout();
    const { data: summary } = useCartSummary();
    const { data: cart } = useCart();
    const { user } = useAuthContext();

    const handlePlaceOrder = () => {
        if (!selectedAddressId) {
            toast.error("Please select a shipping address");
            return;
        }
        
        if (!selectedPaymentMethod) {
            toast.error("Please select a payment method");
            return;
        }

        if (!user) {
            navigate('/login');
            return;
        }

        const cartItems = cart?.items.map((item) => ({
            productId: item.productId._id,
            quantity: item.quantity,
            sellerId: item.sellerId,
        })) || [];

        const orderData = {
            userId: user._id,
            shippingId: selectedAddressId,
            total: summary?.total ?? 0,
            cartItems,
            paymentMethod: selectedPaymentMethod,
        };

        if (selectedPaymentMethod === 'cod') {
            createOrder(orderData, {
                onSuccess: (response) => {
                    const orderId = response.data?._id;
                    if (orderId) {
                        navigate(`/order-confirmation/${orderId}`);
                    } else {
                        toast.error('Order ID not found in response');
                    }
                },
                onError: () => {
                    toast.error('Failed to create order');
                },
            });
        } else if (selectedPaymentMethod === 'stripe') {
            createOrder(orderData, {
                onSuccess: (response) => {
                    const orderId = response.data?._id;
                    if (orderId) {
                        startCheckout(orderId);
                    } else {
                        toast.error('Order ID not found in response');
                    }
                },
                onError: () => {
                    toast.error('Failed to create order');
                },
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link 
                                to="/cart" 
                                className="flex items-center text-slate-600 hover:text-slate-900 transition-colors group"
                            >
                                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                                <span className="font-medium">Back to cart</span>
                            </Link>
                            <div className="h-5 w-px bg-slate-300"></div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Shield className="w-5 h-5 text-emerald-600" />
                            <span className="text-sm font-medium text-slate-700">Secure Checkout</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Title */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">
                        Complete Your Order
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Review your order details and choose your preferred payment method
                    </p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
                    {/* Left Column */}
                    <div className="xl:col-span-3 space-y-8">
                        {/* Shipping Section */}
                        <section className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-200/20 overflow-hidden">
                            <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-8 py-6">
                                <div className="flex items-center">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mr-4">
                                        <Truck className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-white">Shipping Information</h2>
                                        <p className="text-blue-100 text-sm mt-1">Where should we deliver your order?</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8">
                                <ShippingSelection
                                    selectedAddressId={selectedAddressId}
                                    setSelectedAddressId={setSelectedAddressId}
                                />
                            </div>
                        </section>

                        {/* Payment Section */}
                        <section className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-200/20 overflow-hidden">
                            <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-8 py-6">
                                <div className="flex items-center">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mr-4">
                                        <CreditCard className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-white">Payment Method</h2>
                                        <p className="text-emerald-100 text-sm mt-1">Choose how you'd like to pay</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 space-y-4">
                                {/* Stripe */}
                                <div
                                    className={`group relative border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 ${
                                        selectedPaymentMethod === 'stripe'
                                            ? 'border-emerald-500 bg-emerald-50/50 ring-4 ring-emerald-500/10'
                                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                                    }`}
                                    onClick={() => setSelectedPaymentMethod('stripe')}
                                >
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 mt-1">
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                                                selectedPaymentMethod === 'stripe' 
                                                    ? 'border-emerald-500 bg-emerald-500 shadow-md' 
                                                    : 'border-slate-300 group-hover:border-slate-400'
                                            }`}>
                                                {selectedPaymentMethod === 'stripe' && (
                                                    <CheckCircle className="w-4 h-4 text-white" />
                                                )}
                                            </div>
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <div className="p-2 bg-slate-100 rounded-lg">
                                                    <CreditCard className="w-5 h-5 text-slate-600" />
                                                </div>
                                                <h3 className="font-semibold text-slate-900">Credit/Debit Card</h3>
                                            </div>
                                            <p className="text-sm text-slate-600 mb-3">
                                                Fast, secure payment powered by Stripe
                                            </p>
                                            {selectedPaymentMethod === 'stripe' && (
                                                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                                                    <div className="flex items-center space-x-2">
                                                        <Shield className="w-4 h-4 text-emerald-600" />
                                                        <span className="text-sm font-medium text-emerald-800">
                                                            You'll be redirected to Stripe's secure payment page
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* COD */}
                                <div
                                    className={`group relative border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 ${
                                        selectedPaymentMethod === 'cod'
                                            ? 'border-amber-500 bg-amber-50/50 ring-4 ring-amber-500/10'
                                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                                    }`}
                                    onClick={() => setSelectedPaymentMethod('cod')}
                                >
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 mt-1">
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                                                selectedPaymentMethod === 'cod' 
                                                    ? 'border-amber-500 bg-amber-500 shadow-md' 
                                                    : 'border-slate-300 group-hover:border-slate-400'
                                            }`}>
                                                {selectedPaymentMethod === 'cod' && (
                                                    <CheckCircle className="w-4 h-4 text-white" />
                                                )}
                                            </div>
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <div className="p-2 bg-slate-100 rounded-lg">
                                                    <Banknote className="w-5 h-5 text-slate-600" />
                                                </div>
                                                <h3 className="font-semibold text-slate-900">Cash on Delivery</h3>
                                            </div>
                                            <p className="text-sm text-slate-600 mb-3">
                                                Pay with cash when your order arrives at your door
                                            </p>
                                            {selectedPaymentMethod === 'cod' && (
                                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                                    <div className="flex items-center space-x-2">
                                                        <Banknote className="w-4 h-4 text-amber-600" />
                                                        <span className="text-sm font-medium text-amber-800">
                                                            Pay when the item is delivered
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="xl:col-span-2 space-y-6">
                        <section className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-200/20 overflow-hidden sticky top-24">
                            <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-5">
                                <h2 className="text-xl font-semibold text-white">Order Summary</h2>
                                <p className="text-slate-300 text-sm mt-1">Review your items</p>
                            </div>

                            <div className="p-6">
                                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                                    {cart?.items.map((item) => (
                                        <div
                                            key={`${item.productId._id}-${item.sellerId}`}
                                            className="flex items-start space-x-4 p-4 bg-slate-50/50 rounded-xl border border-slate-100"
                                        >
                                            <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl overflow-hidden flex-shrink-0">
                                                {item.productId.images?.[0] && (
                                                    <img 
                                                        src={item.productId.images[0].url} 
                                                        alt={item.productId.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-slate-900 truncate">{item.productId.name}</h4>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-sm text-slate-500">Qty: {item.quantity}</span>
                                                    <span className="font-semibold text-slate-900">
                                                        ${(item.productId.price * item.quantity).toFixed(2)}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-500 mt-1">
                                                    ${item.productId.price.toFixed(2)} each
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {summary && <CartSummaryCard summary={summary} />}

                                <Button
                                    onClick={handlePlaceOrder}
                                    disabled={
                                        !selectedAddressId || !selectedPaymentMethod || creatingOrder || isCheckoutLoading
                                    }
                                    className="w-full mt-6 py-4 text-base font-semibold bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    size="lg"
                                >
                                    {creatingOrder || isCheckoutLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            Processing...
                                        </>
                                    ) : selectedPaymentMethod === 'cod' ? (
                                        'Place Order'
                                    ) : (
                                        'Proceed to Payment'
                                    )}
                                </Button>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;