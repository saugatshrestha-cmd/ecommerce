import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { useProducts, useDeleteProductAdmin } from "@/hooks/useProduct";
import type { Product } from "@/types/productTypes";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from '../reusable/Table';
import { SearchBar } from '../reusable/SearchBar';
import { ImageModal } from '../reusable/ImageModal';
import { ConfirmationDialog } from '../reusable/Confirm';
import { Switch } from "@/components/ui/switch";
import { useUpdateBannerStatus, useUpdateActiveStatus } from "@/hooks/useProduct";

const LoadingSkeleton = () => (
    <div className="space-y-4">
        <Skeleton className="w-full h-10" />
        {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-full h-16" />
        ))}
    </div>
);

const AdminProducts = () => {
    const { data: products, isLoading, isError } = useProducts();
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [targetBannerProduct, setTargetBannerProduct] = useState<Product | null>(null);
    const [isBannerDialogOpen, setIsBannerDialogOpen] = useState(false);

    const [targetActiveProduct, setTargetActiveProduct] = useState<Product | null>(null);
    const [isActiveDialogOpen, setIsActiveDialogOpen] = useState(false);
    const updateBannerStatusMutation = useUpdateBannerStatus();
  const updateActiveStatusMutation = useUpdateActiveStatus();
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const deleteProductMutation = useDeleteProductAdmin();
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        if (searchTerm.trim()) {
            navigate(`/admin/products?search=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm('');
        } else {
            navigate('/admin/products');
        }
    };

    const handleConfirmBannerToggle = () => {
    if (!targetBannerProduct) return;

    updateBannerStatusMutation.mutate(
        { id: targetBannerProduct._id, status: !targetBannerProduct.bannerProduct },
        {
            onSuccess: () => {
                toast.success(`Banner status updated for ${targetBannerProduct.name}`);
                setTargetBannerProduct(null);
                setIsBannerDialogOpen(false);
            },
            onError: () => {
                toast.error("Failed to update banner status");
            },
        }
        );
    };

    const handleConfirmActiveToggle = () => {
    if (!targetActiveProduct) return;

    updateActiveStatusMutation.mutate(
        { id: targetActiveProduct._id, status: !targetActiveProduct.isActive },
        {
        onSuccess: () => {
            toast.success(`Active status updated for ${targetActiveProduct.name}`);
            setTargetActiveProduct(null);
            setIsActiveDialogOpen(false);
        },
        onError: () => {
            toast.error("Failed to update active status");
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
            header: "Product Name",
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
                <span className="text-base font-normal text-gray-900">${row.original.price.toFixed(2)}</span>
            ),
        },
        {
            accessorKey: "quantity",
            header: "Quantity",
            cell: ({ row }) => (
                <span className={row.original.quantity <= 0 ? "text-red-500 text-base font-normal" : "text-base font-normal text-gray-900"}>
                    {row.original.quantity}
                </span>
            ),
        },
        {
            accessorKey: "status",
            header: "Product Status",
            cell: ({ row }) => {
            const status = row.original.status;
            let color = "";
            switch (status) {
                case "active":
                color = "text-green-700 bg-green-100";
                break;
                case "deleted":
                color = "text-red-700 bg-red-100";
                break;
                case "archived":
                color = "text-gray-700 bg-gray-100";
                break;
            }
            return (
                <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold inline-block ${color}`}
                >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
            );
            },
        },
        {
            accessorKey: "sellerId.storeName",
            header: "Seller Store",
            cell: ({ row }) => (
                <span className="text-base font-normal text-gray-900">
                    {typeof row.original.sellerId === "object" 
                        ? row.original.sellerId.storeName 
                        : "N/A"}
                </span>
            ),
        },
        {
                accessorKey: "banner product",
                header: "Banner Product",
                cell: ({ row }) => {
                    const product = row.original;
                    const isActive = product.bannerProduct === true;
                    const handleToggleBanner = (product: Product) => {
                        setTargetBannerProduct(product);
                        setIsBannerDialogOpen(true);
                    };
                return (
                    <Switch
                checked={isActive}
                onCheckedChange={() => handleToggleBanner(product)}
                disabled={updateBannerStatusMutation.isPending}
                className="data-[state=checked]:bg-[#DF8D44]"
            />
                    );
                },
            },
            {
                accessorKey: "Active",
                header: "Banner Status",
                cell: ({ row }) => {
                    const product = row.original;
                    const isActive = product.isActive === true;
                    const handleToggleActive = (product: Product) => {
                        setTargetActiveProduct(product);
                        setIsActiveDialogOpen(true);
                    };
                return (
                    <Switch
                checked={isActive}
                onCheckedChange={() => handleToggleActive(product)}
                disabled={updateActiveStatusMutation.isPending}
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
                        onClick={() => handleDeleteClick(row.original)}
                        aria-label={`Delete ${row.original.name}`}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ),
        },
    ], [updateActiveStatusMutation, updateBannerStatusMutation]);


    if (isLoading) return <LoadingSkeleton />;
    if (isError) return <p className="text-red-500">Failed to load products. Please try again.</p>;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white px-4 py-4 border-b md:px-8 md:py-[13px]">
                <div className="flex flex-col gap-0.5">
                    <span className='text-sm md:text-[14px] text-gray-400'>Home /</span>
                    <span className="text-xl md:text-[24px] text-gray-700 font-medium">Product</span>
                </div>
            </div>

            <div className="px-4 py-6 mx-auto max-w-[1800px] md:px-8 md:py-[29px]">
            {/* Header Section */}
            <div className="p-6 bg-white rounded-lg">
                <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
                    <h1 className="mb-2 text-lg font-bold text-gray-800 ">All Products</h1>
                </div>
                    {/* Search Bar */}
                <div className="p-4 md:p-4 md:py-3">
                <SearchBar 
                    value = {searchTerm}
                    onChange={setSearchTerm}
                    onSearch={handleSearch}
                    placeholder="Search"
                    className="pl-10 w-[400px] h-[44px] text-sm md:text-[16px] font-normal text-gray-500 rounded-full border-gray-200 focus:border-orange-300 focus:ring-orange-200"
                />
                </div>
                    {/* Table Section */}
                <div className="overflow-x-auto">
                <DataTable 
                    data = { filteredProducts }
                    columns= { columns }
                    itemsPerPage={10}
                />
                </div>
            </div>
            </div>


            <ImageModal
                images={selectedImages}
                isOpen={isImageModalOpen}
                onClose={() => setIsImageModalOpen(false)}
            />

            <ConfirmationDialog
                isOpen={isBannerDialogOpen}
                onClose={() => {
                    setTargetBannerProduct(null);
                    setIsBannerDialogOpen(false);
                }}
                onConfirm={handleConfirmBannerToggle}
                title="Change Product Status?"
                description={`Are you sure you want to mark "${targetBannerProduct?.name}" as ${targetBannerProduct?.bannerProduct === true ? false : true}?`}
                confirmLabel="Yes"
                cancelLabel="No"
                confirmColorClassName="bg-[#DF8D44]"
            />

            <ConfirmationDialog
                isOpen={isActiveDialogOpen}
                onClose={() => {
                    setTargetActiveProduct(null);
                    setIsActiveDialogOpen(false);
                }}
                onConfirm={handleConfirmActiveToggle}
                title="Change Product Status?"
                description={`Are you sure you want to mark "${targetActiveProduct?.name}" as ${targetActiveProduct?.isActive === true ? false : true}?`}
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

export default AdminProducts;