import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { useSellers, useDeleteSellerAdmin} from "@/hooks/useSeller";
import type { Seller } from "@/types/sellerTypes";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { Trash2 } from "lucide-react";
import { DataTable } from '../reusable/Table';
import { SearchBar } from '../reusable/SearchBar';
import { ConfirmationDialog } from "../reusable/Confirm";
import { toast } from "sonner";

const SellerTable = () => {
    const { data: sellers, isLoading, isError } = useSellers();
    const [sellerToDelete, setSellerToDelete] = useState<Seller | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const deleteMutation = useDeleteSellerAdmin();
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        if (searchTerm.trim()) {
            navigate(`/admin/seller?search=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm('');
        } else {
            navigate('/admin/seller');
        }
    };
    
    const filteredSellers = useMemo(() => {
        if (!sellers) return [];
        if (!searchTerm) return sellers;
            
        return sellers.filter(seller => 
            seller.storeName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [sellers, searchTerm]);

    const handleDeleteClick = (seller: Seller) => {
        setSellerToDelete(seller);
        setIsDeleteDialogOpen(true);
    };
    
    const handleConfirmDelete = () => {
        if (!sellerToDelete) return;
        deleteMutation.mutate(sellerToDelete._id, {
            onSuccess: () => {
                toast.success(`Deleted seller: ${sellerToDelete.storeName}`);
                setIsDeleteDialogOpen(false);
                setSellerToDelete(null);
            },
            onError: () => {
                toast.error(`Failed to delete ${sellerToDelete.storeName}`);
            }
        });
    };

    const columns: ColumnDef<Seller>[] = [
    {
        accessorKey: "name",
        header: "Store Name",
        cell: ({ row }) => <span className="font-black text-gray-900 text-base truncate block max-w-[180px]">{row.original.storeName}</span>,
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => <span className="text-base font-normal text-gray-900">{row.original.email}</span>,
    },
    {
        accessorKey: "address",
        header: "Address",
        cell: ({ row }) => <span className="text-base font-normal text-gray-900">{row.original.address}</span>,
    },
    {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => <span className="text-base font-normal text-gray-900">{row.original.phone}</span>,
    },
    {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
        return (
            <div className="flex gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteClick(row.original)}
                    aria-label={`Delete ${row.original.storeName}`}
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        );
    },
    },
    ];

    if (isLoading) return <p>Loading sellers...</p>;
    if (isError) return <p>Failed to load sellers.</p>;

    return (
    <div className="min-h-screen bg-gray-50">
        <div className="bg-white px-4 py-4 border-b md:px-8 md:py-[13px]">
                <div className="flex flex-col gap-0.5">
                    <span className='text-sm md:text-[14px] text-gray-400'>Home /</span>
                    <span className="text-xl md:text-[24px] text-gray-700 font-medium">Seller</span>
                </div>
            </div>
        <div className="px-4 py-6 mx-auto max-w-[1800px] md:px-8 md:py-[29px]">
            <div className="p-6 bg-white rounded-lg">
                <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
                    <h1 className="mb-2 text-2xl font-bold text-gray-900">All Sellers</h1>
                </div>
                <div className="p-4 md:p-4 md:py-3">
                <SearchBar 
                    value = {searchTerm}
                    onChange={setSearchTerm}
                    onSearch={handleSearch}
                    placeholder="Search"
                    className="pl-10 w-[400px] h-[44px] text-sm md:text-[16px] font-normal text-gray-500 rounded-full border-gray-200 focus:border-orange-300 focus:ring-orange-200"
                />
                </div>
                <DataTable 
                    data = { filteredSellers }
                    columns= { columns }
                    itemsPerPage={10}
                />
            </div>
        </div>

        <ConfirmationDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onConfirm={handleConfirmDelete}
            title="Are you sure?"
            description={`This will permanently delete "${sellerToDelete?.storeName}".`}
            confirmLabel="Delete"
            cancelLabel="Cancel"
            confirmColorClassName="bg-red-600"
        />
    </div>
    );
};

export default SellerTable;
