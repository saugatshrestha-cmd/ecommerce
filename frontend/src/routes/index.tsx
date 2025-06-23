import { createBrowserRouter } from 'react-router-dom';
import ProductDetails from '../components/products/ProductDetails';
import ProductCategoryPage from '../components/products/ProductByCategory';
import SearchResult from '../components/constants/SearchResult';
import CustomerAccount from '../components/user/CustomerAccount';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import RegisterSeller from '../components/auth/RegisterSeller';
import HomePage from '../pages/HomePage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import OrderDetails from '../pages/OrderDetails';
import CustomerOrdersPage from '@/pages/OrderPage';
import CheckoutSuccess from '../pages/CheckoutSuccess';
import OrderConfirmationPage from '@/pages/OrderConfirmation';
import SellerDashboard from '../components/seller/SellerDashboard';
import SellerProfilePage from '../components/seller/SellerProfile';
import SellerProducts from '../components/seller/SellerProduct';
import AddProductPage from '../components/products/AddProducts';
import EditProductPage from '../components/products/EditProducts';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminProfilePage from '../components/admin/AdminProfile';
import AdminProducts from '../components/admin/AdminProducts';
import CustomerTable from '../components/user/CustomerTable';
import SellerTable from '../components/seller/SellerTable';
import AdminOrderTable from '../components/order/OrderTable';
import SellerOrderTable from '../components/order/SellerOrder';
import CategoryTable from '../components/category/CategoryTable';
import NewCategory from '../components/category/NewCategory';
import EditCategory from '../components/category/EditCategory';
import CustomerLayout from '../layout/CustomerLayout';
import SellerLayout from '../layout/SellerLayout';
import AdminLayout from '../layout/AdminLayout';
import ProtectedRoute from './ProtectedRoute';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <CustomerLayout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
        {
            path: 'cart',
            element: (
                <ProtectedRoute allowedRoles={['customer']}>
                    <CartPage />
                </ProtectedRoute>
            ),
        },
        {
            path: 'checkout',
            element: (
                <ProtectedRoute allowedRoles={['customer']}>
                    <CheckoutPage />
                </ProtectedRoute>
            ),
        },
        {
            path: '/checkout/success',
            element: (
                <ProtectedRoute allowedRoles={['customer']}>
                    <CheckoutSuccess />
                </ProtectedRoute>
            ),
        },
        {
            path: '/order/:orderId',
            element: (
                <ProtectedRoute allowedRoles={['customer']}>
                    <OrderDetails />
                </ProtectedRoute>
            ),
        },
        {
            path: '/order-confirmation/:orderId',
            element: (
                <ProtectedRoute allowedRoles={['customer']}>
                    <OrderConfirmationPage />
                </ProtectedRoute>
        ),
        },
        {
            path: 'categories',
            element: <ProductCategoryPage />,
        },
        {
            path: 'search',
            element: <SearchResult />,
        },
        {
            path: 'login',
            element: <LoginForm />,
        },
        {
            path: 'register/customer',
            element: <RegisterForm />,
        },
        {
            path: 'register/seller',
            element: <RegisterSeller />,
        },
        {
            path: 'account',
            element: (
                <ProtectedRoute allowedRoles={['customer']}>
                    <CustomerAccount />
                </ProtectedRoute>
            ),
        },
        {
            path: 'orders',
            element: (
                <ProtectedRoute allowedRoles={['customer']}>
                    <CustomerOrdersPage />
                </ProtectedRoute>
            ),
        },
        {
            path: '/:id',
            element: <ProductDetails />,
        },
    ]},
    {
        path: '/seller',
        element: (
            <ProtectedRoute allowedRoles={['seller']}>
                <SellerLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <SellerDashboard />,
            },
            {
                path: '/seller/products',
                element: <SellerProducts />,
            },
            {
                path: '/seller/products/new',
                element: <AddProductPage />,
            },
            {
                path: '/seller/products/edit/:id',
                element: <EditProductPage />,
            },
            {
                path: '/seller/order',
                element: <SellerOrderTable />,
            },
            {
                path: '/seller/profile',
                element: <SellerProfilePage />,
            },
        ]},
    {
        path: '/admin',
        element: (
            <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <AdminDashboard />,
            },
            {
                path: '/admin/products',
                element: <AdminProducts />,
            },
            {
                path: '/admin/seller',
                element: <SellerTable />,
            },
            {
                path: '/admin/customer',
                element: <CustomerTable />,
            },
            {
                path: '/admin/order',
                element: <AdminOrderTable />,
            },
            {
                path: '/admin/category',
                element: <CategoryTable />,
            },
            {
                path: '/admin/category/new',
                element: <NewCategory />,
            },
            {
                path: '/admin/category/edit/:id',
                element: <EditCategory />,
            },
            {
                path: '/admin/profile',
                element: <AdminProfilePage />,
            },
        ]
    },
]);