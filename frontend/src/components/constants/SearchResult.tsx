import { useSearchParams } from 'react-router-dom';
import { useSearchProducts } from '@/hooks/useProduct';
import ProductCard from '../products/ProductCard';

const SearchResult = () => {
    const [params] = useSearchParams();
    const query = params.get('query') || '';

    const { data, isLoading, error } = useSearchProducts(query);

    if (!query) return <p className="p-4">No search query provided.</p>;
    if (isLoading) return <p className="p-4">Searching...</p>;
    if (error) return <p className="p-4 text-red-500">Failed to fetch results.</p>;
    if (data?.length === 0) return <p className="p-4">No products found for "{query}".</p>;

    return (
    <>
    <section className="py-12">
        <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Search Results for: "{query}"</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data?.map((product) => (
                <div key={product._id}>
                <ProductCard product={product} />
                </div>
            ))}
        </div>
        </div>
    </section>
    </>
    );
};

export default SearchResult;
