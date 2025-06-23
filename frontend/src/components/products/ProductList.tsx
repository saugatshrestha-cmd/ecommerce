import { useProducts } from '@/hooks/useProduct';
import ProductCard from './ProductCard';

const ProductList = () => {
    const { data: products, isLoading, isError } = useProducts();

    if (isLoading) return <p>Loading products...</p>;
    if (isError) return <p>Failed to load products.</p>;

    return (
        <>
        <section className="py-12">
        <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">All Products</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products?.map((product) => (
            <ProductCard key={product._id} product={product} />
        ))}
        </div>
    </div>
    </section>
    </>
    );
};

export default ProductList;
