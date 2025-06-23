import type { Order } from '@/types/orderTypes';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Truck, Package, CheckCircle, Clock, XCircle, Calendar, ShoppingBag } from 'lucide-react';

const statusIcons = {
    pending: <Clock className="w-4 h-4" />,
    processing: <Package className="w-4 h-4" />,
    shipped: <Truck className="w-4 h-4" />,
    delivered: <CheckCircle className="w-4 h-4" />,
    cancelled: <XCircle className="w-4 h-4" />,
};

const statusColors = {
    pending: 'bg-amber-100 text-amber-800 hover:bg-amber-100',
    processing: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
    shipped: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-100',
    delivered: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100',
    cancelled: 'bg-red-100 text-red-800 hover:bg-red-100',
};

type Props = {
    order: Order;
};

const OrderCard = ({ order }: Props) => {
    const formattedDateTime = format(new Date(order.createdAt), 'MMMM d, yyyy - h:mm a');
    return (
    <Card className="rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-5 space-y-4">
        {/* Order Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div>
            <h3 className="font-semibold text-lg text-gray-900">
                Order #{order._id.slice(-6).toUpperCase()}
            </h3>
            <div className="flex items-center gap-2 text-sm text-slate-500">
                <Calendar className='w-4 h-4' /> Placed on {formattedDateTime}
            </div>
            </div>
            <Badge 
                className={`${statusColors[order.status.toLowerCase() as keyof typeof statusColors]} flex items-center gap-1.5 px-3 py-1.5 rounded-full`}
            >
                {statusIcons[order.status.toLowerCase() as keyof typeof statusIcons]}
                <span className="capitalize">{order.status}</span>
            </Badge>
        </div>

        <div className="flex items-center gap-2 text-sm font-medium text-slate-700 border-b border-slate-100 pb-2">
            <ShoppingBag className="w-4 h-4" />
            <span>Order Items ({order.items.length})</span>
        </div>
        {/* Order Items */}
        <div className="space-y-3">
            {order.items.map((item) => (
            <div 
                key={item._id} 
                className="border border-gray-100 rounded-lg p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors"
            >
                <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <p className="font-medium text-gray-900 truncate">{item.productName}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <div className="space-y-1 text-right">
                    <p className="font-medium text-gray-900">${item.price.toFixed(2)}</p>
                    <Badge 
                        variant="outline" 
                        className={`${statusColors[order.status.toLowerCase() as keyof typeof statusColors]} text-xs py-1 px-2 h-auto capitalize`}
                    >
                        {statusIcons[order.status.toLowerCase() as keyof typeof statusIcons]} {item.sellerStatus}
                    </Badge>
                </div>
                </div>
            </div>
            ))}
        </div>

        {/* Order Footer */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4 text-slate-600" />
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-900">Order Total</p>
                    <p className="text-xs text-slate-500">
                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </p>
                </div>
            </div>
            <div className="text-right">
                <div className="flex items-center gap-1 text-xl font-semibold text-slate-900">
                    ${order.total.toFixed(2)}
                </div>
                <p className="text-xs text-slate-500">including taxes</p>
            </div>
        </div>
        </CardContent>
    </Card>
    );
};

export default OrderCard;