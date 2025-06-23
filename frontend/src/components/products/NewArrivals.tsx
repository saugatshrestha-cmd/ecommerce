import { useNewProductsLimit } from '@/hooks/useProduct';
import ProductCard from './ProductCard';

const NewArrivals = () => {
    const { data: products, isLoading, isError } = useNewProductsLimit(8);


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

export default NewArrivals;