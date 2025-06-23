import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import type { Product } from '@/types/productTypes';
import { useAuthContext } from '@/context/authContext';
import { useCart, useCreateCart } from '@/hooks/useCart';
import { useState } from 'react';
import { toast } from 'sonner';
import type { CreateCart } from '@/types/cartTypes';

interface ProductCardProps {
    product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
    const { user, isAuthenticated } = useAuthContext();
    const { data: cart } = useCart();
    const { mutate: createCartMutation } = useCreateCart();
    const [isAdding, setIsAdding] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation();

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            toast.error('Please login to add items to cart');
            navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
            return;
        }

        setIsAdding(true);
        
        try {
            const cartItem: CreateCart = {
                productId: product._id,
                quantity: 1,
            };

            createCartMutation(cartItem, {
                onSuccess: () => {
                    toast.success(`${product.name} added to cart!`);
                },
                onError: () => {
                    toast.error('Failed to add item to cart');
                }
            });
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Failed to add item to cart');
        } finally {
            setIsAdding(false);
        }
    };

    const isInCart = user && cart?.items.some(item => item.productId._id === product._id);

    return (
        <>
            <Link to={`/${product._id}`}>
                <div className="mb-3 overflow-hidden bg-gray-100 rounded-lg aspect-square">
                    <img
                        src={product.images?.[0]?.url}
                        alt={product.name}
                        className="object-contain w-full h-full transition-transform duration-200 group-hover:scale-105"
                    />
                </div>
            </Link>

            <div className="flex-1 mb-4 space-y-2 text-center">
                <Link to={`/${product._id}`}>
                    <h3 className="text-sm font-semibold text-gray-900 transition lg:text-base line-clamp-2 hover:text-indigo-600">
                        {product.name}
                    </h3>
                </Link>
                <span className="block text-lg font-bold text-gray-900">${product.price}</span>
            </div>

            <Button
                onClick={handleAddToCart}
                disabled={isAdding || !!isInCart}
                className="w-full text-base font-medium text-white transition-colors bg-black border border-black rounded-lg h-11 hover:bg-white hover:text-black"
            >
                {!isAuthenticated
                    ? 'Add to Cart'
                    : isAdding
                        ? 'Adding...'
                        : isInCart
                            ? 'In Cart'
                            : 'Add to Cart'}
            </Button>
        </>
    );
};

export default ProductCard;
