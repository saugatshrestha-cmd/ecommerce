import { Outlet } from 'react-router-dom';
import Navbar from '@/components/constants/NavBar';
import Footer from '@/components/constants/Footer';

const CustomerLayout = () => {
    return (
    <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
            <Outlet />
        </main>
        <Footer />
    </div>
    );
};

export default CustomerLayout;