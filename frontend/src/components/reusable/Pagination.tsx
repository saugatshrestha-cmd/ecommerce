import { ArrowLeft, ArrowRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const generatePages = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        const left = Math.max(1, currentPage - 1);
        const right = Math.min(totalPages, currentPage + 1);

        if (left > 1) pages.push(1);
        if (left > 2) pages.push('...');

        for (let i = left; i <= right; i++) pages.push(i);

        if (right < totalPages - 1) pages.push('...');
        if (right < totalPages) pages.push(totalPages);
    }

    return pages;
    };

    const pages = generatePages();

    return (
    <div className="flex items-center justify-between mt-4">
        <button
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
        <ArrowLeft className="w-4 h-4" />
        Previous
        </button>

        <div className="flex items-center gap-2">
        {pages.map((page, index) => (
            <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            className={`px-3 py-2 rounded-lg ${
                page === currentPage
                ? 'bg-black text-white'
                : 'text-gray-600 hover:bg-gray-100'
            } ${page === '...' ? 'cursor-default' : ''}`}
            disabled={page === '...'}
            >
            {page}
            </button>
        ))}
        </div>

        <button
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
            Next
            <ArrowRight className="w-4 h-4" />
        </button>
    </div>
    );
}
