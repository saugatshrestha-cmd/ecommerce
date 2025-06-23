import { useCart, useUpdateCartItem, useRemoveCartItem, useCartSummary } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/authContext";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import CartItemCard from "@/components/cart/ItemCart";
import CartSummaryCard from "@/components/cart/Summary";

const CartPage = () => {
    const { data: cart, isLoading } = useCart();
    const { isAuthenticated } = useAuthContext();
    const { data: summary, isLoading: isSummaryLoading } = useCartSummary();
    const updateCart = useUpdateCartItem();
    const removeCart = useRemoveCartItem();

    const handleUpdateQty = (productId: string, newQty: number) => {
    if (newQty < 1) {
        toast.error("Quantity must be at least 1");
        return;
    }
    updateCart.mutate({ productId, quantity: newQty });
    };

    const handleRemove = (productId: string) => {
    removeCart.mutate(productId, {
        onSuccess: () => toast.success("Item removed from cart"),
        onError: () => toast.error("Failed to remove item from cart"),
    });
    };

    const items = cart?.items || [];
    if (!isAuthenticated) {
    return (
        <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">You need to log in to view your cart</h2>
        <p className="text-gray-600 mb-6">Sign in to access your saved items and checkout faster.</p>
        <Link to="/login" className="inline-block bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition">
            Go to Login
        </Link>
        </div>
    );
    }

    if (isLoading || isSummaryLoading) return <div className="p-8">Loading...</div>;

    return (
    <div className="h-auto bg-white">
        <div className="border-b border-gray-200 px-4 py-4 lg:px-8">
        <div className="flex items-center text-sm text-gray-500 mb-4">
            <span>Home</span>
            <span className="mx-2"> / </span>
            <span>Cart</span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-black">YOUR CART</h1>
        </div>

        <div className="px-4 py-6 lg:px-8 lg:py-8">
        {items.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
            <p className="text-lg font-medium">Your cart is empty</p>
            <p className="mt-2 text-sm">Start adding products to see them here.</p>
            </div>
        ) : (
            <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            <div className="lg:col-span-2 space-y-4 lg:space-y-6">
                {items.map((item) => (
                <CartItemCard
                    key={item.productId._id}
                    item={item}
                    onUpdateQty={handleUpdateQty}
                    onRemove={handleRemove}
                />
                ))}
            </div>

            <div className="mt-8 lg:mt-0">
                <div className="bg-white border border-gray-200 rounded-lg p-6 lg:sticky lg:top-8">
                    <h2 className="text-xl font-bold text-black mb-6">Order Summary</h2>
                {summary && <CartSummaryCard summary={summary} />}
                <Button className="w-full bg-black text-white py-4 rounded-full font-medium text-lg hover:bg-gray-800 transition-colors">
                    <a href="/checkout">Go to Checkout</a>
                </Button>
            </div>
            </div>
            </div>
        )}
        </div>
    </div>
    );
};

export default CartPage;
