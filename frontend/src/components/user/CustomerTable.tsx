import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { useUsers, useDeleteUserAdmin } from "@/hooks/useUser";
import type { User } from "@/types/userTypes";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { DataTable } from '../reusable/Table';
import { SearchBar } from '../reusable/SearchBar';
import { ConfirmationDialog } from "../reusable/Confirm";
import { toast } from "sonner";

const CustomerTable = () => {
    const { data: users, isLoading, isError } = useUsers();
    const [customerToDelete, setCustomerToDelete] = useState<User | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const deleteMutation = useDeleteUserAdmin();
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        if (searchTerm.trim()) {
            navigate(`/admin/customer?search=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm('');
        } else {
            navigate('/admin/customer');
        }
    };
        
    const filteredCustomers = useMemo(() => {
        if (!users) return [];
        if (!searchTerm) return users;
                
        return users.filter(customer => 
            customer.firstName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);
    
    const handleDeleteClick = (customer: User) => {
        setCustomerToDelete(customer);
        setIsDeleteDialogOpen(true);
    };
        
    const handleConfirmDelete = () => {
        if (!customerToDelete) return;
                
        deleteMutation.mutate(customerToDelete._id, {
            onSuccess: () => {
                toast.success(`Deleted customer: ${customerToDelete.firstName} ${customerToDelete.lastName}`);
                setIsDeleteDialogOpen(false);
                setCustomerToDelete(null);
            },
            onError: () => {
                toast.error(`Failed to delete ${customerToDelete.firstName} ${customerToDelete.lastName}`);
            }
        });
    };

    const columns: ColumnDef<User>[] = [
    {
        accessorKey: "name",
        header: "Full Name",
        cell: ({ row }) => <span className="font-black text-gray-900 text-base truncate block max-w-[180px]">{row.original.firstName} {row.original.lastName}</span>,
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
                    aria-label={`Delete ${row.original.firstName} ${row.original.lastName}`}
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        );
    },
    },
    ];


    if (isLoading) return <p>Loading customers...</p>;
    if (isError) return <p>Failed to load customers.</p>;

    return (
    <div className="min-h-screen bg-gray-50">
        <div className="bg-white px-4 py-4 border-b md:px-8 md:py-[13px]">
                <div className="flex flex-col gap-0.5">
                    <span className='text-sm md:text-[14px] text-gray-400'>Home /</span>
                    <span className="text-xl md:text-[24px] text-gray-700 font-medium">Customer</span>
                </div>
            </div>
        <div className="px-4 py-6 mx-auto max-w-[1800px] md:px-8 md:py-[29px]">
            <div className="p-6 bg-white rounded-lg">
                <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
                    <h1 className="mb-2 text-2xl font-bold text-gray-900">All Customers</h1>
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
                    data = { filteredCustomers }
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
            description={`This will permanently delete "${customerToDelete?.firstName} ${customerToDelete?.lastName}".`}
            confirmLabel="Delete"
            cancelLabel="Cancel"
            confirmColorClassName="bg-red-600"
        />
    </div>
    );
};

export default CustomerTable;
