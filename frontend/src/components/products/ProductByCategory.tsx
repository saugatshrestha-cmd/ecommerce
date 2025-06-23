import { useSearchParams } from "react-router-dom";
import { useFilteredProducts, usePriceRange } from "@/hooks/useProduct";
import { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { useCategories, useSearchCategory } from "@/hooks/useCategory";
import { useDebounce } from "@/hooks/useDebounce";
import ProductCard from "./ProductCard";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { SearchIcon, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { DialogTitle, DialogDescription } from '@/components/ui/dialog';

export default function ProductCategoryPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedCategories = searchParams.get("categories")?.split(",") || [];
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState<"newest" | "price-high-low" | "price-low-high" | "name-a-z" | "name-z-a">("newest");
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const debouncedSearchTerm = useDebounce(searchTerm, 300); 

    const { data: searchResults } = useSearchCategory(debouncedSearchTerm);
    const { data: allCategories } = useCategories();

    const categoriesToDisplay = debouncedSearchTerm ? searchResults : allCategories;

    const { data: priceRangeData } = usePriceRange(
        selectedCategories.length > 0 ? selectedCategories.join(",") : undefined
    );
    const [priceRange, setPriceRange] = useState<[number, number]>();

    useEffect(() => {
        if (priceRangeData) {
            setPriceRange([priceRangeData.minPrice, priceRangeData.maxPrice]);
        }
    }, [priceRangeData]);

    const { data: products, isLoading } = useFilteredProducts({
        categoryId: selectedCategories.length > 0 ? selectedCategories.join(",") : undefined,
        minPrice: priceRange?.[0],
        maxPrice: priceRange?.[1],
        sort: sortOption,
    });

    const handleCategoryToggle = (categoryId: string) => {
        const newSelected = selectedCategories.includes(categoryId)
            ? selectedCategories.filter(id => id !== categoryId)
            : [...selectedCategories, categoryId];
        
        if (newSelected.length > 0) {
            setSearchParams({ categories: newSelected.join(",") });
        } else {
            setSearchParams({});
        }
    };

    const handleSortChange = (value: string) => {
        const sortValue = value as "newest" | "price-high-low" | "price-low-high" | "name-a-z" | "name-z-a";
        setSortOption(sortValue);
    };

    return (
        <div className="container px-4 mx-auto">
            {/* Mobile Filters Button */}
            <div className="flex items-center justify-between mt-4 mb-4 lg:hidden">
                <h1 className="text-xl font-bold">Products</h1>
                <div className="flex gap-2">
                    <Drawer open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                        <DrawerTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2">
                                <Filter className="w-4 h-4" />
                                Filters
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent className="h-[80vh]">
                            <DialogTitle className="sr-only">Filter Menu</DialogTitle>
                            <DialogDescription className="sr-only">Mobile filter panel with links and actions</DialogDescription>
                            <div className="p-4 overflow-y-auto">
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="mb-2 text-lg font-semibold">Categories</h3>
                                        <div className="relative mb-4">
                                            <SearchIcon className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
                                            <Input
                                                type="text"
                                                placeholder="Search categories..."
                                                className="rounded-full pl-9"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                        <ul className="space-y-2">
                                            {categoriesToDisplay?.length ? (
                                                categoriesToDisplay.map((cat) => (
                                                    <li key={cat._id} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`mobile-category-${cat._id}`}
                                                            checked={selectedCategories.includes(cat._id)}
                                                            onCheckedChange={() => handleCategoryToggle(cat._id)}
                                                        />
                                                        <label
                                                            htmlFor={`mobile-category-${cat._id}`}
                                                            className="text-lg font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                        >
                                                            {cat.name}
                                                        </label>
                                                    </li>
                                                ))
                                            ) : (
                                                <p className="text-sm text-muted-foreground">
                                                    {debouncedSearchTerm ? "No matching categories found" : "No categories available"}
                                                </p>
                                            )}
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="mb-2 text-lg font-semibold">Price</h3>
                                        {priceRangeData && priceRange ? (
                                            <>
                                                <Slider
                                                    min={priceRangeData.minPrice}
                                                    max={priceRangeData.maxPrice}
                                                    value={priceRange}
                                                    onValueChange={(val) => setPriceRange([val[0], val[1]])}
                                                    step={10}
                                                />
                                                <div className="mt-1 text-sm text-muted-foreground">
                                                    ${priceRange[0]} – ${priceRange[1]}
                                                </div>
                                            </>
                                        ) : (
                                            <div>Loading price range...</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </DrawerContent>
                    </Drawer>
                                            
                    <Select onValueChange={handleSortChange} value={sortOption}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest</SelectItem>
                            <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                            <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                            <SelectItem value="name-a-z">Name: A to Z</SelectItem>
                            <SelectItem value="name-z-a">Name: Z to A</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                {/* Desktop Filters - Hidden on mobile */}
                <aside className="hidden py-8 lg:block lg:col-span-1">
                    <div className="p-6 space-y-6 bg-white border shadow-sm rounded-2xl">
                    <div>
                        <h3 className="mb-2 text-lg font-semibold">Categories</h3>
                        <div className="relative mb-4">
                            <SearchIcon className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search categories..."
                                className="rounded-full pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <ul className="space-y-2">
                            {categoriesToDisplay?.length ? (
                                categoriesToDisplay.map((cat) => (
                                    <li key={cat._id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`category-${cat._id}`}
                                            checked={selectedCategories.includes(cat._id)}
                                            onCheckedChange={() => handleCategoryToggle(cat._id)}
                                        />
                                        <label
                                            htmlFor={`category-${cat._id}`}
                                            className="text-lg font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {cat.name}
                                        </label>
                                    </li>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    {debouncedSearchTerm ? "No matching categories found" : "No categories available"}
                                </p>
                            )}
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-2 text-lg font-semibold">Price</h3>
                        {priceRangeData && priceRange ? (
                            <>
                                <Slider
                                    min={priceRangeData.minPrice}
                                    max={priceRangeData.maxPrice}
                                    value={priceRange}
                                    onValueChange={(val) => setPriceRange([val[0], val[1]])}
                                    step={10}
                                />
                                <div className="mt-1 text-sm text-muted-foreground">
                                    ${priceRange[0]} – ${priceRange[1]}
                                </div>
                            </>
                        ) : (
                            <div>Loading price range...</div>
                        )}
                    </div>
                </div>
                </aside>

                {/* Product Grid - Full width on mobile, 3 cols on desktop */}
                <section className="col-span-1 mb-6 space-y-4 lg:p-6 lg:col-span-3">
                    {/* Desktop Sort - Hidden on mobile */}
                    <div className="items-center justify-between hidden mb-4 lg:flex">
                        <div className="text-lg text-muted-foreground">
                            {products?.length === 1
                                ? `Showing 1 of 1 product`
                                : `Showing ${products?.length || 0} ${products?.length === 1 ? "product" : "products"}`}
                        </div>
                        <div className="flex items-center justify-end gap-2 mb-4">
                            <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
                            <Select onValueChange={handleSortChange} value={sortOption}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="newest">Newest</SelectItem>
                                    <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                                    <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                                    <SelectItem value="name-a-z">Name: A to Z</SelectItem>
                                    <SelectItem value="name-z-a">Name: Z to A</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <p>Loading products...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {products?.map((product) => (
                                <div key={product._id}>
                                    <ProductCard product={product} />
                                </div>
                            ))}
                            {products?.length === 0 && (
                                <div className="py-12 text-center col-span-full">
                                    <p className="text-lg text-muted-foreground">No products found.</p>
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}