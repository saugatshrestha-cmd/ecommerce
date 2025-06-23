import { Minus, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { CartItem } from "@/types/cartTypes";

interface Props {
    item: CartItem;
    onUpdateQty: (productId: string, newQty: number) => void;
    onRemove: (productId: string) => void;
}

const CartItemCard = ({ item, onUpdateQty, onRemove }: Props) => {
    const handleInputChange = (value: string) => {
        const qty = parseInt(value);
        if (!isNaN(qty)) {
            onUpdateQty(item.productId._id, qty);
        }
    };

    return (
    <div className="flex items-start space-x-4 p-4 lg:p-6 bg-gray-50 rounded-lg">
        <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
        <img
            src={item.productId.images?.[0]?.url}
            alt={item.productId.name}
            className="w-full h-full object-contain"
        />
        </div>

        <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
            <div>
            <h3 className="font-semibold text-black text-base lg:text-lg">
                {item.productId.name}
            </h3>
            <p className="text-xs text-gray-500">
                Available: {item.productId.quantity}
            </p>
            </div>
            <button
            onClick={() => onRemove(item.productId._id)}
            className="text-red-500 hover:text-red-700 p-1"
            aria-label="Remove item"
            >
            <Trash2 className="w-4 h-4" />
            </button>
        </div>

        <div className="flex items-center justify-between mt-4">
            <p className="font-bold text-lg lg:text-xl text-black">
            ${item.priceAtAddition.toFixed(2)}
            </p>

            <div className="flex items-center space-x-3 bg-gray-200 rounded-full px-3 py-2">
            <button
                onClick={() => onUpdateQty(item.productId._id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className={`${item.quantity <= 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:text-black'} transition-colors`}
                aria-label="Decrease quantity"
            >
                <Minus className="w-4 h-4" />
            </button>
            <Input
                type="number"
                value={item.quantity}
                min={1}
                max={item.productId.quantity}
                onChange={(e) => handleInputChange(e.target.value)}
                className="text-center border-none w-14 focus-visible:ring-0 focus-visible:ring-offset-0 no-spinner"
            />
            <button
                onClick={() => onUpdateQty(item.productId._id, item.quantity + 1)}
                disabled={item.quantity >= item.productId.quantity}
                className={`${item.quantity >= item.productId.quantity ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:text-black'} transition-colors`}
                aria-label="Increase quantity"
            >
                <Plus className="w-4 h-4" />
            </button>
            </div>
        </div>
        </div>
    </div>
    );
};

export default CartItemCard;
