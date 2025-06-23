import { ChevronLeft, ChevronRight } from "lucide-react";
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    type ColumnDef,
    getPaginationRowModel,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Button } from "../ui/button";

interface DataTableProps<TData> {
    data: TData[];
    columns: ColumnDef<TData>[];
    itemsPerPage?: number;
}

export function DataTable<TData>({
    data,
    columns,
    itemsPerPage = 10,
}: DataTableProps<TData>) {
    const [currentPage, setCurrentPage] = useState(1);
    
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            pagination: {
                pageIndex: currentPage - 1,
                pageSize: itemsPerPage,
            }
        },
        onPaginationChange: (updater) => {
            if (typeof updater === 'function') {
                const newState = updater({
                    pageIndex: currentPage - 1,
                    pageSize: itemsPerPage
                });
                setCurrentPage(newState.pageIndex + 1);
            } else {
                setCurrentPage(updater.pageIndex + 1);
            }
        },
        manualPagination: false,
    });

    const totalPages = table.getPageCount();

    const generatePages = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            const left = Math.max(1, currentPage - 1);
            const right = Math.min(totalPages, currentPage + 1);

            if (left > 1) pages.push(1);
            if (left > 2) pages.push("...");

            for (let i = left; i <= right; i++) pages.push(i);

            if (right < totalPages - 1) pages.push("...");
            if (right < totalPages) pages.push(totalPages);
        }

        return pages;
    };

    const pages = generatePages();

    return (
        <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
            <div className="overflow-x-auto">
                <Table className="min-w-full">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="border-gray-200 bg-[#FCF4EC]">
                                {headerGroup.headers.map((header) => (
                                    <TableHead 
                                        key={header.id} 
                                        className="px-4 py-3 text-sm font-semibold text-gray-600 md:px-6"
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} className="border-gray-200 hover:bg-gray-50">
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell 
                                            key={cell.id} 
                                            className="px-4 py-2 overflow-hidden text-lg md:px-6"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell 
                                    colSpan={columns.length} 
                                    className="py-6 text-center text-gray-500"
                                >
                                    No results found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-2 px-4 py-4 border-t border-gray-200">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="h-8 w-8 bg-[#FCF4EC]"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    
                    <div className="flex flex-wrap items-center justify-center gap-1">
                        {pages.map((page, index) => (
                            <Button
                                key={index}
                                onClick={() => typeof page === "number" && setCurrentPage(page)}
                                variant={currentPage === page ? "default" : "ghost"}
                                size="sm"
                                className={`h-8 min-w-8 ${currentPage === page ? 'bg-[#FCF4EC] text-black' : ''}`}
                            >
                                {page}
                            </Button>
                        ))}
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                                currentPage < totalPages && setCurrentPage(currentPage + 1)
                            }
                        disabled={currentPage === totalPages}
                        className="h-8 w-8 bg-[#FCF4EC]"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}