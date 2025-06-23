import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { useCategories, useDeleteCategory } from "@/hooks/useCategory";
import type { Category } from "@/types/categoryTypes";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { Trash2, Pencil, CloudUpload } from "lucide-react";
import { DataTable } from '../reusable/Table';
import { SearchBar } from '../reusable/SearchBar';
import { ConfirmationDialog } from "../reusable/Confirm";
import { toast } from "sonner";

const CategoryTable = () => {
    const { data: categories, isLoading, isError } = useCategories();
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const deleteMutation = useDeleteCategory();
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        if (searchTerm.trim()) {
            navigate(`/admin/category?search=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm('');
        } else {
            navigate('/admin/category');
        }
    };
        
    const filteredCategories = useMemo(() => {
        if (!categories) return [];
        if (!searchTerm) return categories;
                
        return categories.filter(category => 
            category.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [categories, searchTerm]);

    const handleDeleteClick = (category: Category) => {
        setCategoryToDelete(category);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!categoryToDelete) return;
        deleteMutation.mutate(categoryToDelete._id, {
            onSuccess: () => {
                toast.success(`Deleted category: ${categoryToDelete.name}`);
                setIsDeleteDialogOpen(false);
                setCategoryToDelete(null);
            },
            onError: () => {
                toast.error(`Failed to delete ${categoryToDelete.name}`);
            }
        });
    };

    const columns: ColumnDef<Category>[] = [
    {
        accessorKey: "name",
        header: "Category Name",
        cell: ({ row }) => <span className="font-black text-gray-900 text-base truncate block max-w-[180px]">{row.original.name}</span>,
    },
    {
        accessorKey: "description",
        header: "Category Description",
        cell: ({ row }) => <span className="text-base font-normal text-gray-900">{row.original.description}</span>,
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
                asChild
                aria-label={`Edit ${row.original.name}`}
            >          
                <a href={`/admin/category/edit/${row.original._id}`}>
                    <Pencil className="w-4 h-4" />
                </a>
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteClick(row.original)}
                aria-label={`Delete ${row.original.name}`}
            >
                <Trash2 className="w-4 h-4" />
            </Button>
        </div>
        );
    },
    },
    ];

    if (isLoading) return <p>Loading categories...</p>;
    if (isError) return <p>Failed to load categories.</p>;

    return (
    <div className="min-h-screen bg-gray-50">
        <div className="bg-white px-4 py-4 border-b md:px-8 md:py-[13px]">
                <div className="flex flex-col gap-0.5">
                    <span className='text-sm md:text-[14px] text-gray-400'>Home /</span>
                    <span className="text-xl md:text-[24px] text-gray-700 font-medium">Category</span>
                </div>
            </div>
        <div className="px-4 py-6 mx-auto max-w-[1800px] md:px-8 md:py-[29px]">
            {/* Header Section */}
            <div className="bg-white rounded-lg border border-[#EAECF0] overflow-hidden">
                <div className="flex flex-col p-4 border-b border-[#EAECF0] md:flex-row md:items-center md:justify-between gap-4 md:p-6">
                    <div className='flex-1'>
                        <h1 className="text-lg font-bold text-gray-800 ">Manage Your Categories</h1>
                        <p className="text-base text-gray-400 ">Add, edit or delete categories to keep your catalog updated.</p>
                    </div>
                    <div className="flex flex-col justify-end gap-3 sm:flex-row sm:gap-4">
                        <Button variant="outline" className="flex items-center gap-2 border-[#DF8D44] hover:bg-[#DF8D44] text-[#DF8D44] hover:text-white w-full sm:w-auto">
                            <CloudUpload className="w-4 h-4" />
                            <span className='text-sm font-bold md:text-[16px]'>Bulk Import</span>
                        </Button>
                        <Button className="flex items-center gap-2 border border-[#DF8D44] bg-[radial-gradient(50.27%_2723.2%_at_49.73%_42.98%,_#E5A469_50.4%,_#DF8D44_100%)] hover:bg-white hover:bg-none hover:text-[#DF8D44] w-full sm:w-auto">
                            <a href="/admin/category/new" className='text-sm font-bold md:text-[16px]'>
                                Add New Category
                            </a>
                        </Button>
                    </div>
                </div>
                <div className="p-4 border-b border-[#EAECF0] md:p-4 md:py-3">
                <SearchBar 
                    value = {searchTerm}
                    onChange={setSearchTerm}
                    onSearch={handleSearch}
                    placeholder="Search"
                    className="pl-10 w-[400px] h-[44px] text-sm md:text-[16px] font-normal text-gray-500 rounded-full border-gray-200 focus:border-orange-300 focus:ring-orange-200"
                />
                </div>
                <div className="overflow-x-auto">
                <DataTable 
                    data = { filteredCategories }
                    columns= { columns }
                    itemsPerPage={10}
                />
                </div>
            </div>
        </div>

        <ConfirmationDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onConfirm={handleConfirmDelete}
            title="Are you sure?"
            description={`This will permanently delete "${categoryToDelete?.name}".`}
            confirmLabel="Delete"
            cancelLabel="Cancel"
            confirmColorClassName="bg-red-600"
        />
    </div>
    );
};

export default CategoryTable;
