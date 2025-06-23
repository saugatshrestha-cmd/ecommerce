import { useProduct } from '@/hooks/useProduct';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Minus, Plus } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { useAuthContext } from '@/context/authContext';
import { useCreateCart, useCart } from '@/hooks/useCart';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';
import type { CreateCart } from '@/types/cartTypes';
import FeaturedProducts from './FeaturedProducts';

const ProductDetails = () => {
    const { id } = useParams<{ id: string }>();
    const { data: product, isLoading, isError } = useProduct(id || '');
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const { user, isAuthenticated } = useAuthContext();
    const { mutate: createCartMutation } = useCreateCart();
    const { data: cart } = useCart();
    const [isAdding, setIsAdding] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    if (isError || !product) return <p>Product not found.</p>;
    const handleAddToCart = () => {
    if (!isAuthenticated) {
        toast.error('Please login to add items to cart');
        navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
        return;
    }
    setIsAdding(true);

    try{
        const cartItem: CreateCart = {
            productId: product._id,
            quantity,
        };

        createCartMutation(cartItem, {
            onSuccess: () => {
                toast.success(`${product.name} added to cart`);
            },
            onError: () => {
                toast.error('Failed to add to cart');
            }
        })
    } catch (error) {
        console.error('Error adding to cart:', error);
        toast.error('Failed to add item to cart');
    } finally {
        setIsAdding(false);
    }
    };
    const isInCart = user && cart?.items.some(item => item.productId._id === product._id);

    if (isLoading) {
    return (
        <div className="p-6">
            <Skeleton className="w-1/2 h-6 mb-4" />
            <Skeleton className="w-full mb-4 h-96" />
            <Skeleton className="w-1/3 h-4 mb-2" />
            <Skeleton className="w-full h-4 mb-6" />
            <Skeleton className="w-40 h-10" />
        </div>
        );
    }

    const increaseQty = () => {
        if (quantity < product.quantity) setQuantity(quantity + 1);
    };

    const decreaseQty = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    return (
        <div className="min-h-screen bg-white">
        <div className="px-4 py-8 mx-auto max-w-7xl">
            {/* Desktop Layout */}
            <div className="hidden lg:grid lg:grid-cols-2 lg:gap-12">
                {/* Left Column - Images */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="overflow-hidden bg-gray-100 rounded-lg aspect-square">
                            <img
                                src={product.images[selectedImage].url}
                                alt={product.images[selectedImage].originalName}
                                className="object-contain w-full h-full"
                            />
                        </div>
                        
                        {/* Thumbnail Images */}
                        <div className="flex space-x-4">
                            {product.images.map((image, index) => (
                                <button
                                    key={image._id}
                                    onClick={() => setSelectedImage(index)}
                                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                                    selectedImage === index ? 'border-black' : 'border-gray-200'
                                }`}
                            >
                                <img
                                    src={image.url}
                                    alt={image.originalName}
                                    className="object-contain w-full h-full"
                                />
                            </button>
                            ))}
                        </div>
                    </div>
            
                    {/* Right Column - Product Info */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="mb-2 text-3xl font-bold text-gray-900">
                                {product.name}
                            </h1>
                            <div className="flex items-center mb-4 space-x-3">
                                <Badge variant="secondary" className="px-3 py-1 text-lg">
                                    ${product.price.toFixed(2)}
                                </Badge>
                                <span className="text-sm text-gray-500">In stock: {product.quantity}</span>
                            </div>
                            <p className="mb-6 text-gray-600">
                                {product.description}
                            </p>
                        </div>
            
                        {/* Quantity and Add to Cart */}
                        <div className="flex flex-col space-x-4">
                            <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                                <button
                                    onClick={decreaseQty}
                                    className="p-2 hover:bg-gray-100 disabled:opacity-30"
                                    disabled={quantity <= 1}
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <Input
                                    type="number"
                                    value={quantity}
                                    min={1}
                                    max={product.quantity}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        if (!isNaN(val)) {
                                            const clamped = Math.max(1, Math.min(val, product.quantity));
                                            setQuantity(clamped);
                                        }
                                    }}
                                    className="text-center border-none w-14 focus-visible:ring-0 focus-visible:ring-offset-0 no-spinner"
                                />
                                <button
                                    onClick={increaseQty}
                                    className="p-2 hover:bg-gray-100 disabled:opacity-30"
                                    disabled={quantity >= product.quantity}
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <Button 
                            onClick={handleAddToCart}
                            disabled={isAdding || !!isInCart}
                            className="w-full px-6 py-3 mt-4 text-base font-medium text-white transition-colors bg-black border border-black rounded-lg hover:bg-white hover:text-black">
                                {!isAuthenticated
                    ? 'Add to Cart'
                    : isAdding
                        ? 'Adding...'
                        : isInCart
                            ? 'In Cart'
                            : 'Add to Cart'}
                            </Button>
                        </div>
                    </div>
                    </div>
            
                    {/* Mobile Layout */}
                    <div className="lg:hidden">
                        {/* Mobile Images */}
                        <div className="mb-6 space-y-4">
                            <div className="overflow-hidden bg-gray-100 rounded-lg aspect-square">
                                <img
                                    src={product.images[selectedImage].url}
                                    alt={product.images[selectedImage].originalName}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            <div className="flex space-x-3 overflow-x-auto">
                                {product.images.map((image, index) => (
                                    <button
                                        key={image._id}
                                        onClick={() => setSelectedImage(index)}
                                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                                        selectedImage === index ? 'border-black' : 'border-gray-200'
                                    }`}
                                    >
                                    <img
                                        src={image.url}
                                        alt={image.originalName}
                                        className="object-cover w-full h-full"
                                    />
                                    </button>
                                ))}
                            </div>
                        </div>
            
                        {/* Mobile Product Info */}
                        <div className="space-y-4">
                            <div>
                                <h1 className="mb-2 text-2xl font-bold text-gray-900">
                                    {product.name}
                            </h1>
                            <div className="flex items-center mb-3 space-x-2">
                                <Badge variant="secondary" className="text-2xl font-bold text-gray-900">
                                    ${product.price.toFixed(2)}
                                </Badge>
                            <span className="text-sm text-gray-500">In stock: {product.quantity}</span>
                            </div>
            
                            <p className="mb-4 text-sm text-gray-600">
                                {product.description}
                            </p>
                        </div>
            
                        {/* Mobile Quantity and Add to Cart */}
                        <div className="space-y-3">
                            <div className="flex flex-col space-x-3">
                            <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                                <button
                                    onClick={decreaseQty}
                                    className="p-2 disabled:opacity-30"
                                    disabled={quantity <= 1}
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <Input
                                    type="number"
                                    value={quantity}
                                    min={1}
                                    max={product.quantity}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        if (!isNaN(val)) {
                                            const clamped = Math.max(1, Math.min(val, product.quantity));
                                            setQuantity(clamped);
                                        }
                                    }}
                                className="text-center border-none w-14 focus-visible:ring-0 focus-visible:ring-offset-0 no-spinner"
                                />
                                <button
                                    onClick={increaseQty}
                                    className="p-2 disabled:opacity-30"
                                    disabled={quantity >= product.quantity}
                                >
                                <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            
                            <Button 
                            onClick={handleAddToCart}
                            disabled={isAdding || !!isInCart}
                            className="flex-1 px-4 py-3 mt-4 text-sm font-medium text-white transition-colors bg-black border border-black rounded-lg hover:bg-white hover:text-black">
                                {!isAuthenticated
                    ? 'Add to Cart'
                    : isAdding
                        ? 'Adding...'
                        : isInCart
                            ? 'In Cart'
                            : 'Add to Cart'}
                            </Button>
                        </div>
                        </div>
                    </div>
                </div>
            {/* You Might Also Like Section */}
            <div className="mt-16">
                <h2 className="mb-8 text-2xl font-bold text-center">YOU MIGHT ALSO LIKE</h2>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
                    <FeaturedProducts />
                </div>
            </div>
        </div>
    </div>
    );
};

export default ProductDetails;
