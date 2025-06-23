import { useFeaturedProducts } from '@/hooks/useProduct';
import ProductCard from './ProductCard';

const FeaturedProducts = () => {
    const { data: products, isLoading, isError } = useFeaturedProducts();

    if (isLoading) return <p>Loading products...</p>;
    if (isError) return <p>Failed to load products.</p>;

    return (
        <>
            {products?.map((product) => (
                <div key={product._id}>
                    <ProductCard product={product} />
                </div>
            ))}
        </>
    );
};

export default FeaturedProducts;