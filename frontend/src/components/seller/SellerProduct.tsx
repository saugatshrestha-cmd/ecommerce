import { useSellerProducts, useDeleteProduct } from '@/hooks/useProduct';
import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/productTypes";
import { toast } from "sonner";
import { Trash2, Pencil, CloudUpload } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from '../reusable/Table';
import { SearchBar } from '../reusable/SearchBar';
import { ImageModal } from '../reusable/ImageModal';
import { ConfirmationDialog } from '../reusable/Confirm';
import { Switch } from "@/components/ui/switch";
import { useUpdateProduct } from "@/hooks/useProduct";

const LoadingSkeleton = () => (
    <div className="space-y-4">
        <Skeleton className="w-full h-10" />
        {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-full h-16" />
        ))}
    </div>
);

const SellerProducts = () => {
    const { data: products, isLoading, isError } = useSellerProducts();
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
    const [statusTargetProduct, setStatusTargetProduct] = useState<Product | null>(null);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const deleteProductMutation = useDeleteProduct();
    const mutation = useUpdateProduct();
    const [searchParams] = useSearchParams();
    const urlSearchTerm = searchParams.get('search') || '';
    const [searchTerm, setSearchTerm] = useState(urlSearchTerm);
    const navigate = useNavigate();

    const handleSearch = () => {
        if (searchTerm.trim()) {
            navigate(`/seller/products?search=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm('');
        } else {
            navigate('/seller/products');
        }
    };
    const handleConfirmStatusChange = () => {
    if (!statusTargetProduct) return;
    const isCurrentlyActive = statusTargetProduct.status === 'active';

    const formData = new FormData();
    formData.append("status", isCurrentlyActive ? "archived" : "active");

    mutation.mutate(
        { id: statusTargetProduct._id, data: formData },
        {
            onSuccess: () => {
                toast.success(`Product is now ${isCurrentlyActive ? "archived" : "active"}`);
                setStatusTargetProduct(null);
                setIsStatusDialogOpen(false);
            },
            onError: () => {
                toast.error("Failed to update status");
            },
        }
    );
    };


    const filteredProducts = useMemo(() => {
        if (!products) return [];
        if (!searchTerm) return products;
        
        return products.filter(product => 
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.categoryId?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            product.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [products, searchTerm]);

    const handleOpenImageModal = (images: string[]) => {
        setSelectedImages(images);
        setIsImageModalOpen(true);
    };

    const handleDeleteClick = (product: Product) => {
        setProductToDelete(product);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!productToDelete) return;
        
        deleteProductMutation.mutate(productToDelete._id, {
        onSuccess: () => {
            toast.success(`Deleted product: ${productToDelete.name}`);
            setIsDeleteDialogOpen(false);
            setProductToDelete(null);
        },
        onError: () => {
            toast.error(`Failed to delete ${productToDelete.name}`);
        }
    });
    };

    const columns: ColumnDef<Product>[] = useMemo(() => [
            {
                accessorKey: "name",
                header: "Name",
                cell: ({ row }) => (
                    <span className="font-black text-gray-900 text-base truncate block max-w-[180px]">
                        {row.original.name}
                    </span>
                ),
            },
            {
                accessorKey: "images",
                header: "Images",
                cell: ({ row }) => {
                    const images = row.original.images?.map((img) => img.url) || [];
                    return images.length ? (
                        <img
                            src={images[0]}
                            alt={`Thumbnail for ${row.original.name}`}
                            onClick={() => handleOpenImageModal(images)}
                            className="h-[59px] w-[59px] object-cover rounded-md cursor-pointer border"
                        />
                    ) : (
                        <span className="text-sm text-muted-foreground">No image</span>
                    );
                },
            },
            {
                accessorKey: "category",
                header: "Category",
                cell: ({ row }) => (
                    <span className="text-base font-normal text-gray-900">
                        {row.original.categoryId?.name || "N/A"}
                    </span>
                ),
            },
            {
                accessorKey: "price",
                header: "Price",
                cell: ({ row }) => (
                    <span className='text-base font-normal text-gray-900'>${row.original.price.toFixed(2)}</span>
                ),
            },
            {
                accessorKey: "quantity",
                header: "Quantity",
                cell: ({ row }) => (
                    <span className={row.original.quantity <= 0 ? "text-red-500 text-base font-normal" : "font-normal text-gray-900 text-base"}>
                        {row.original.quantity}
                    </span>
                ),
            },
            {
                accessorKey: "status",
                header: "Status",
                cell: ({ row }) => {
                    const product = row.original;
                    const isActive = product.status === "active";
                    const handleToggle = (product: Product) => {
                        setStatusTargetProduct(product);
                        setIsStatusDialogOpen(true);
                    };
                return (
                    <Switch
                checked={isActive}
                onCheckedChange={() => handleToggle(product)}
                disabled={mutation.isPending}
                className="data-[state=checked]:bg-[#DF8D44]"
            />
                    );
                },
            },
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }) => (
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            aria-label={`Edit ${row.original.name}`}
                            className='w-10 h-10'
                        >          
                            <a href={`/seller/products/edit/${row.original._id}`}>
                                <Pencil className="w-5 h-5" />
                            </a>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(row.original)}
                            aria-label={`Delete ${row.original.name}`}
                            className='w-10 h-10'
                        >
                            <Trash2 className="w-5 h-5" />
                        </Button>
                    </div>
                ),
            },
    ], [mutation]);

    if (isLoading) return <LoadingSkeleton />;
    if (isError) return <p className="text-red-500">Failed to load products. Please try again.</p>;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-white px-4 py-4 border-b md:px-8 md:py-[13px]">
                <div className="flex flex-col gap-0.5">
                    <span className='text-sm md:text-[14px] text-gray-400'>Home /</span>
                    <span className="text-xl md:text-[24px] text-gray-700 font-medium">Product</span>
                </div>
            </div>
            
            {/* Main Content */}
            <div className="px-4 py-6 mx-auto max-w-[1800px] md:px-8 md:py-[29px]">
                <div className="bg-white rounded-lg border border-[#EAECF0] overflow-hidden">
                    {/* Top Bar with Title and Buttons */}
                    <div className="flex flex-col p-4 border-b border-[#EAECF0] md:flex-row md:items-center md:justify-between gap-4 md:p-6">
                        <div className='flex-1'>
                            <h1 className="text-lg font-bold text-gray-800 ">Manage Your Products</h1>
                            <p className="text-base text-gray-400 ">
                                Add, edit or delete products to keep your catalog updated.
                            </p>
                        </div>
                        <div className="flex flex-col justify-end gap-3 sm:flex-row sm:gap-4">
                            <Button 
                                variant="outline" 
                                className="flex items-center gap-2 border-[#DF8D44] hover:bg-[#DF8D44] text-[#DF8D44] hover:text-white w-full sm:w-auto"
                            >
                                <CloudUpload className="!w-5 !h-[18px]"/>
                                <span className='text-sm font-bold md:text-[16px]'>Bulk Import</span>
                            </Button>
                            <Button className="flex items-center gap-2 border border-[#DF8D44] bg-[radial-gradient(50.27%_2723.2%_at_49.73%_42.98%,_#E5A469_50.4%,_#DF8D44_100%)] hover:bg-white hover:bg-none hover:text-[#DF8D44] w-full sm:w-auto">
                                <a href="/seller/products/new" className='text-sm font-bold md:text-[16px]'>
                                    Add New Product
                                </a>
                            </Button>
                        </div>
                    </div>

                    {/* Search Bar Section */}
                    <div className="p-4 border-b border-[#EAECF0] md:p-4 md:py-3">
                        <SearchBar 
                            value={searchTerm}
                            onChange={setSearchTerm}
                            onSearch={handleSearch}
                            placeholder="Search"
                            className="pl-10 w-[400px] h-[44px] text-sm md:text-[16px] font-normal text-gray-500 rounded-full border-gray-200 focus:border-orange-300 focus:ring-orange-200"
                        />
                    </div>
                    
                    {/* Table Section */}
                    <div className="overflow-x-auto">
                        <DataTable 
                            data={filteredProducts}
                            columns={columns}
                            itemsPerPage={10}
                        />
                    </div>
                </div>
            </div>
    
            {/* Modals (keep existing) */}
            <ImageModal
                images={selectedImages}
                isOpen={isImageModalOpen}
                onClose={() => setIsImageModalOpen(false)}
            />

            <ConfirmationDialog
                isOpen={isStatusDialogOpen}
                onClose={() => {
                    setStatusTargetProduct(null);
                    setIsStatusDialogOpen(false);
                }}
                onConfirm={handleConfirmStatusChange}
                title="Change Product Status?"
                description={`Are you sure you want to mark "${statusTargetProduct?.name}" as ${statusTargetProduct?.status === 'active' ? 'archived' : 'active'}?`}
                confirmLabel="Yes"
                cancelLabel="No"
                confirmColorClassName="bg-[#DF8D44]"
            />
    
            <ConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Are you sure?"
                description={`This will permanently delete "${productToDelete?.name}".`}
                confirmLabel="Delete"
                cancelLabel="Cancel"
                confirmColorClassName="bg-red-600"
            />
        </div>
    );
};

export default SellerProducts;