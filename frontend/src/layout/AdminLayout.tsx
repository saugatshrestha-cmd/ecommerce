import { Outlet } from 'react-router-dom';
import AdminSidebar from '@/components/admin/AdminSidebar';

const AdminLayout = () => {
    return (
    <div className="min-h-screen flex">
        <AdminSidebar />
        <main className="flex-1 bg-gray-50">
            <Outlet />
        </main>
    </div>
    );
};

export default AdminLayout;