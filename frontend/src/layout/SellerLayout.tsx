import { Outlet } from 'react-router-dom';
import SellerSidebar from '@/components/seller/SellerSidebar';

const SellerLayout = () => {
    return (
    <div className="min-h-screen flex">
        <SellerSidebar />
        <main className="flex-1 bg-gray-50">
            <Outlet />
        </main>
    </div>
    );
};

export default SellerLayout;