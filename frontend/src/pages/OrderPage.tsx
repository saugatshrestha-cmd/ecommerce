import { useUserOrders } from '@/hooks/useOrder';
import { Loader2 } from 'lucide-react';
import OrderCard from '@/components/user/CustomerOrders';
import CustomerSidebar from '@/components/user/CustomerSidebar';

const CustomerOrdersPage = () => {
    const { data: orders, isLoading, isError } = useUserOrders();

    if (isLoading) {
    return (
        <div className="flex justify-center mt-10">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
    );
    }

    if (isError || !orders?.length) {
    return (
        <div className="text-center mt-10 text-muted-foreground">
            You haven't placed any orders yet.
        </div>
        );
    }

    const filteredOrders = orders.filter(order => order.items && order.items.length > 0);

    if (filteredOrders.length === 0) {
        return (
            <div className="text-center mt-10 text-muted-foreground">
                You haven't placed any orders yet.
            </div>
        );
    }

    return (
    <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
            <CustomerSidebar />
        <main className="flex-1 space-y-10">
        <h1 className="text-2xl font-bold">My Orders</h1>
        {filteredOrders.map((order) => (
            <OrderCard key={order._id} order={order} />
        ))}
        </main>
        </div>
        
    </div>
    );
};

export default CustomerOrdersPage;
