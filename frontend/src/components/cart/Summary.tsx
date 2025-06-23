import type { CartSummary } from "@/types/cartTypes";

interface SummaryProps {
    summary: CartSummary;
}

const CartSummaryCard = ({ summary }: SummaryProps) => {
    return (
    <>
        <div className="space-y-4 mb-6">
        <div className="flex justify-between text-gray-600">
            <span>Subtotal:</span> <span className="font-medium text-black">${summary?.subtotal?.toFixed(2) || '0.00'}</span>
        </div>

        <div className="flex justify-between text-gray-600">
            <span>Shipping:</span> <span className="font-medium text-black">${summary?.shipping?.toFixed(2) || '0.00'}</span>
        </div>

        <div className="flex justify-between text-gray-600">
            <span>VAT:</span> <span className="font-medium text-black">${summary?.vat?.toFixed(2) || '0.00'}</span>
        </div>

        <hr className="border-gray-200" />

        <div className="flex justify-between text-lg font-bold text-black">
            <span>Total:</span> <span>${summary?.total?.toFixed(2) || '0.00'}</span>
        </div>
        </div>
        </>
    );
};

export default CartSummaryCard;
