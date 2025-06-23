import { useParams } from 'react-router-dom';
import { useOrderById } from '@/hooks/useOrder';
import { Loader } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';

const statusColors = {
    pending: 'bg-amber-100 text-amber-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-red-100 text-red-800',
};

const OrderConfirmationPage = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const { data: order, isLoading, isError } = useOrderById(orderId!);

    if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <Loader className="w-6 h-6 animate-spin text-gray-600" />
        </div>
    );
    }

    if (isError || !order) {
    return (
        <div className="text-center py-20 text-red-500 font-medium">
            Unable to fetch order details. Please try again later.
        </div>
    );
    }

    const formattedDate = format(new Date(order.data.createdAt), 'MMMM d, yyyy - h:mm a');

    return (
    <div className="max-w-3xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold mb-2 text-gray-900">Order Confirmed 🎉</h1>
        <p className="text-sm text-gray-600 mb-6">
            Thank you for your purchase! Your order has been placed successfully.
        </p>

        <Card className="rounded-xl border border-gray-200 shadow-sm">
        <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center">
            <div>
                <h3 className="font-semibold text-lg text-gray-900">
                    Order #{order.data._id.slice(-6).toUpperCase()}
                </h3>
                <p className="text-sm text-gray-500">Placed on {formattedDate}</p>
            </div>
            <Badge
                className={`capitalize ${statusColors[order.data.status.toLowerCase() as keyof typeof statusColors]} px-3 py-1.5 rounded-full`}
            >
                {order.data.status}
            </Badge>
            </div>

            <div className="divide-y divide-gray-100">
            {order.data.items.map((item) => (
                <div key={item._id} className="py-4 flex justify-between items-start">
                <div>
                    <p className="font-medium text-gray-900">{item.productName}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                    <p className="text-gray-900 font-semibold">${item.price.toFixed(2)}</p>
                </div>
                </div>
            ))}
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-600">Total:</span>
            <span className="text-lg font-bold text-gray-900">${order.data.total.toFixed(2)}</span>
            </div>
        </CardContent>
        </Card>
    </div>
    );
};

export default OrderConfirmationPage;
