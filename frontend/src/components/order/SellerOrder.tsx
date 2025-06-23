import { useCallback, useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { useSellerOrders, useUpdateOrderItemStatus } from "@/hooks/useOrder";
import type { Order, OrderItem } from "@/types/orderTypes";
import { OrderItemStatus } from "@/types/enumTypes";
import { Truck, PackageCheck, X, User, CheckCircle, Clock, CreditCard,HandCoins } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from '../reusable/Table';
import { SearchBar } from '../reusable/SearchBar';
import { Badge } from "@/components/ui/badge";
import { useAuthContext } from "@/context/authContext";
import { toast } from "sonner";
import { ConfirmationDialog } from "../reusable/Confirm";

const LoadingSkeleton = () => (
    <div className="space-y-4">
        <Skeleton className="w-full h-10" />
        {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-full h-16" />
        ))}
    </div>
);

const SellerOrderTable = () => {
    const { refetch } = useAuthContext();
    const { data: orders, isLoading, isError } = useSellerOrders();
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [pendingChange, setPendingChange] = useState<{
        orderId: string;
        itemId: string;
        newStatus: OrderItemStatus;
    } | null>(null);

    const updateStatusMutation = useUpdateOrderItemStatus();

    const handleStatusChange = useCallback((orderId: string, itemId: string, newStatus: OrderItemStatus) => {
        updateStatusMutation.mutate(
            { orderId, itemId, sellerStatus: newStatus },
            {
                onSuccess: () => {
                    toast.success("Order status updated");
                    refetch();
                },
                onError: () => {
                    toast.error("Failed to update order status");
                }
            }
        );
    }, [updateStatusMutation, refetch]);

    const handleSearch = () => {
        if (searchTerm.trim()) {
            navigate(`/seller/order?search=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm('');
        } else {
            navigate('/seller/order');
        }
    };

    const filteredOrders = useMemo(() => {
        if (!orders) return [];
        if (!searchTerm) return orders;
        
        return orders.filter(order => 
            order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.userId.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.userId.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.items.some(item => 
                item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.sellerId.storeName.toLowerCase().includes(searchTerm.toLowerCase())
        ));
    }, [orders, searchTerm]);

    const getStatusBadge = (status: string) => {
        let icon, bgColor, textColor;
        
        switch (status) {
            case 'Pending':
                icon = <PackageCheck className="w-4 h-4 mr-1" />;
                bgColor = 'bg-yellow-100';
                textColor = 'text-yellow-800';
                break;
            case 'Shipped':
                icon = <Truck className="w-4 h-4 mr-1" />;
                bgColor = 'bg-blue-100';
                textColor = 'text-blue-800';
                break;
            case 'Delivered':
                icon = <PackageCheck className="w-4 h-4 mr-1" />;
                bgColor = 'bg-green-100';
                textColor = 'text-green-800';
                break;
            case 'Cancelled':
                icon = <X className="w-4 h-4 mr-1" />;
                bgColor = 'bg-red-100';
                textColor = 'text-red-800';
                break;
            default:
                icon = null;
                bgColor = 'bg-gray-100';
                textColor = 'text-gray-800';
        }
        
        return (
            <Badge className={`${bgColor} ${textColor} gap-1`}>
                {icon}
                {status}
            </Badge>
        );
    };

    const getStatusActions = (currentStatus: OrderItemStatus, orderId: string, itemId: string) => {
        const isUpdating = updateStatusMutation.isPending;
        
        switch (currentStatus) {
            case OrderItemStatus.PENDING:
                return (
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {setPendingChange({ orderId, itemId, newStatus: OrderItemStatus.SHIPPED });
                            setDialogOpen(true);}}
                            disabled={isUpdating}
                        >
                            Mark as Shipped
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {setPendingChange({ orderId, itemId, newStatus: OrderItemStatus.CANCELLED });
                            setDialogOpen(true);}}
                            disabled={isUpdating}
                        >
                            Cancel
                        </Button>
                    </div>
                );
            case OrderItemStatus.SHIPPED:
                return (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {setPendingChange({ orderId, itemId, newStatus: OrderItemStatus.DELIVERED });
                        setDialogOpen(true);}}
                        disabled={isUpdating}
                    >
                        Mark as Delivered
                    </Button>
                );
            case OrderItemStatus.DELIVERED:
                return (
                    <span className="text-sm text-gray-500">No actions available</span>
                );
            case OrderItemStatus.CANCELLED:
                return (
                    <span className="text-sm text-gray-500">Order cancelled</span>
                );
            default:
                return null;
        }
    };

    const columns: ColumnDef<Order>[] = useMemo(() => [
        {
            accessorKey: "user",
            header: "Customer",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">
                        {row.original.userId.firstName} {row.original.userId.lastName}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "items",
            header: "Items",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    {row.original.items.slice(0, 2).map((item: OrderItem) => (
                        <div key={item._id} className="flex items-start gap-2">
                            <span className="text-gray-700">
                                {item.productName} (x{item.quantity})
                            </span>
                        </div>
                    ))}
                </div>
            ),
        },
        {
            accessorKey: "address",
            header: "Address",
            cell: ({ row }) => (
                <span className="font-medium text-gray-900">
                    {row.original.shippingId.address}, {row.original.shippingId.city}
                </span>
            ),
        },
        {
            accessorKey: "total",
            header: "Total",
            cell: ({ row }) => (
                <span className="font-medium text-gray-900">
                    ${row.original.total.toFixed(2)}
                </span>
            ),
        },
        {
            accessorKey: "payment",
            header: "Payment Status",
            cell: ({ row }) => {
                const status = row.original.payment.payment_status;
                let badgeClass = "";
                let icon = null;

                switch (status.toLowerCase()) {
                    case "paid":
                    badgeClass = "bg-green-100 text-green-800";
                    icon = <CheckCircle className="w-4 h-4 mr-1" />;
                    break;
                case "pending":
                    badgeClass = "bg-yellow-100 text-yellow-800";
                    icon = <Clock className="w-4 h-4 mr-1" />;
                    break;
                default:
                    badgeClass = "bg-gray-100 text-gray-800";
                }

                return (
                    <Badge className={`${badgeClass} inline-flex items-center`}>
                        {icon}
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "paymentMethod",
            header: "Payment Method",
            cell: ({ row }) => {
                const method = row.original.payment?.method;

                switch (method) {
                    case "stripe":
                    return (
                        <Badge variant="outline" className="flex items-center gap-1">
                            <CreditCard className="w-4 h-4" /> Stripe
                        </Badge>
                    );
                    case "cod":
                    return (
                        <Badge variant="outline" className="flex items-center gap-1">
                            <HandCoins className="w-4 h-4" /> Cash on Delivery
                        </Badge>
                    );
                    default:
                    return null;
                }
            }
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <div className="flex flex-col gap-4">
                    {row.original.items.slice(0, 2).map((item: OrderItem) => (
                        <div key={item._id} className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                {getStatusBadge(item.sellerStatus)}
                            </div>
                            {getStatusActions(item.sellerStatus, row.original._id, item._id)}
                        </div>
                    ))}
                </div>
            ),
        },
    ], [handleStatusChange, updateStatusMutation.isPending]);

    if (isLoading) return <LoadingSkeleton />;
    if (isError) return <p className="text-red-500">Failed to load orders. Please try again.</p>;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white px-4 py-4 border-b md:px-8 md:py-[13px]">
                <div className="flex flex-col gap-0.5">
                    <span className='text-sm md:text-[14px] text-gray-400'>Home /</span>
                    <span className="text-xl md:text-[24px] text-gray-700 font-medium">Order Management</span>
                </div>
            </div>

            <div className="px-4 py-6 mx-auto max-w-[1800px] md:px-8 md:py-[29px]">
                <div className="p-6 bg-white rounded-lg">
                    <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
                        <h1 className="mb-2 text-lg font-bold text-gray-800">All Orders</h1>
                    </div>
                    
                    <div className="p-4 md:p-4 md:py-3">
                        <SearchBar 
                            value={searchTerm}
                            onChange={setSearchTerm}
                            onSearch={handleSearch}
                            placeholder="Search"
                            className="pl-10 w-[400px] h-[44px] text-sm md:text-[16px] font-normal text-gray-500 rounded-full border-gray-200 focus:border-orange-300 focus:ring-orange-200"
                        />
                    </div>
                    
                    <div className="overflow-x-auto">
                        <DataTable 
                            data={filteredOrders}
                            columns={columns}
                            itemsPerPage={10}
                        />
                    </div>
                </div>
            </div>
            {pendingChange && (
                <ConfirmationDialog
                    isOpen={dialogOpen}
                    onClose={() => {
                        setDialogOpen(false);
                        setPendingChange(null);
                    }}
                    onConfirm={() => {
                        if (pendingChange) {
                            handleStatusChange(
                                pendingChange.orderId,
                                pendingChange.itemId,
                                pendingChange.newStatus
                            );
                            setDialogOpen(false);
                            setPendingChange(null);
                        }
                    }}
                    title="Confirm Status Change"
                    description={`Are you sure you want to mark this item as ${pendingChange.newStatus}?`}
                    confirmLabel="Yes, change it"
                    cancelLabel="No, keep current"
                    confirmColorClassName="bg-primary"
                />
            )}
        </div>
    );
};

export default SellerOrderTable;