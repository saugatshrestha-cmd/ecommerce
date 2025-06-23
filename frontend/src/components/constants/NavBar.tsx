import { 
    Search, 
    ShoppingCart, 
    User, 
    Menu,
    Store 
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from '@/components/ui/sheet';
import { DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '@/context/authContext';
import { useLogout } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';

const Navbar = () => {
    const { isAuthenticated, refetch } = useAuthContext();
    const { data: cart } = useCart();
    const navigate = useNavigate();

    const { mutate: serverLogout } = useLogout();
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const handleLogout = () => {
        serverLogout(undefined, {
            onSuccess: () => {
                refetch(); 
                navigate('/login');
                toast.success('Logged out Successfully');
            },
            onError: () => {
                refetch(); 
                navigate('/login');
                toast.error('Failed to log out');
            }
        });
    };

    const navLinks = [
        { name: 'Home', url: '/' },
        { name: 'Categories', url: '/categories' },
        { name: 'Contact', url: '/contact' },
    ];

    const handleSearch = () => {
        if (searchTerm.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm('');
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSearch();
    };

    const cartItemsCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm">
            
            {/* Main Navigation */}
            <div className="container px-3 py-3 mx-auto sm:px-4">
                <div className="flex items-center justify-between gap-2 sm:gap-4">
                {/* Logo */}
                <div className="flex items-center flex-shrink-0">
                <Link 
                    to="/" 
                    className="flex items-center gap-2 text-xl font-bold transition-opacity sm:text-2xl text-primary hover:opacity-90"
                    onClick={() => refetch()}
                >
                    <span>E-Commerce</span>
                </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="items-center hidden space-x-1 lg:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.url}
                            className="relative px-3 py-2 text-base font-bold text-gray-700 transition-colors hover:text-primary group"
                        >
                            {link.name}
                            <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-primary w-0 group-hover:w-4/5 transition-all duration-300"></span>
                        </Link>
                    ))}
                </nav>

                {/* Search and Actions */}
                <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
                    {/* Desktop Search */}
                    <div className={`hidden md:flex items-center transition-all duration-200 ${isSearchFocused ? 'w-64 lg:w-72' : 'w-48 lg:w-56'}`}>
                        <div className="relative w-full">
                            <Input
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                                className="pr-10 text-sm rounded-full shadow-sm"
                            />
                            <button 
                                onClick={handleSearch}
                                className="absolute text-gray-500 transition-colors -translate-y-1/2 right-3 top-1/2 hover:text-primary"
                            >
                                <Search className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Cart */}
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="relative w-8 h-8 rounded-full hover:bg-gray-100 sm:h-9 sm:w-9"
                        asChild
                    >
                        <Link to="/cart">
                            <ShoppingCart className="w-4 h-4 text-gray-700 sm:h-5 sm:w-5" />
                            {cartItemsCount > 0 && (
                        <span className="absolute flex items-center justify-center w-4 h-4 text-xs font-medium text-white rounded-full -right-1 -top-1 sm:h-5 sm:w-5 bg-primary">
                            {cartItemsCount > 9 ? '9+' : cartItemsCount}
                        </span>
                    )}
                        </Link>
                    </Button>

                    {/* Auth Dropdown */}
                    {isAuthenticated ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="hidden rounded-full sm:inline-flex hover:bg-gray-100 h-9 w-9"
                                >
                                    <User className="w-5 h-5 text-gray-700" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent 
                                align="end" 
                                className="w-48 py-1 border border-gray-100 rounded-md shadow-lg"
                            >
                                <DropdownMenuItem 
                                    onSelect={() => navigate('/account')}
                                    className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-50"
                                >
                                    My Account
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                    onSelect={() => navigate('/orders')}
                                    className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-50"
                                >
                                    My Orders
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                    onSelect={handleLogout}
                                    className="px-4 py-2 text-sm text-red-600 cursor-pointer hover:bg-gray-50"
                                >
                                    Sign Out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button 
                            variant="outline" 
                            className="items-center hidden gap-2 px-4 text-sm border-gray-300 rounded-full lg:flex h-9 hover:border-primary hover:text-primary"
                            asChild
                        >
                            <Link to="/login">
                                <User className="w-4 h-4" />
                                <span>Sign In</span>
                            </Link>
                        </Button>
                    )}

                    {/* Seller Button */}
                    <Button 
                        variant="default" 
                        size="sm"
                        className="items-center hidden h-8 gap-1 px-2 text-xs rounded-full md:flex sm:gap-2 sm:h-9 sm:px-4 bg-gradient-to-r from-primary to-blue-600 sm:text-sm"
                        asChild
                    >
                        <Link to="/register/seller">
                            <Store className="w-3 h-3 sm:h-4 sm:w-4" />
                            <span>Sell</span>
                        </Link>
                    </Button>

                    {/* Mobile Menu Trigger */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="w-8 h-8 rounded-full lg:hidden hover:bg-gray-100 sm:h-9 sm:w-9"
                            >
                                <Menu className="w-4 h-4 text-gray-700 sm:h-5 sm:w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[85vw] max-w-sm p-0">
                            <DialogTitle className="sr-only">Navigation Menu</DialogTitle>
                            <DialogDescription className="sr-only">Mobile navigation panel with links and actions</DialogDescription>
                            <div className="flex flex-col h-full">
                                {/* Mobile Header */}
                                <div className="px-4 py-6 border-b border-gray-100">
                                    <Link 
                                        to="/" 
                                        className="text-xl font-bold text-primary"
                                    >
                                        E-Commerce
                                    </Link>
                                </div>

                                {/* Mobile Search */}
                                <div className="px-4 py-4 border-b border-gray-100">
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            placeholder="Search products..." 
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            className="w-full px-4 py-3 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                        <Search className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 right-3 top-1/2" />
                                    </div>
                                </div>

                                {/* Mobile Navigation */}
                                <nav className="flex-1 py-2 overflow-y-auto">
                                    <ul className="px-4 space-y-2">
                                        {navLinks.map((link) => (
                                            <li key={link.name}>
                                                <Link
                                                    to={link.url}
                                                    className="block px-3 py-3 font-medium text-gray-700 transition-colors rounded-lg hover:text-primary hover:bg-gray-50"
                                                >
                                                    {link.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>

                                {/* Mobile Auth Section */}
                                <div className="px-4 py-6 border-t border-gray-100 bg-gray-50">
                                    {isAuthenticated ? (
                                        <div className="space-y-3">
                                            <Link
                                                to="/account"
                                                className="flex items-center gap-3 px-3 py-3 text-gray-700 transition-colors rounded-lg hover:bg-gray-50"
                                            >
                                                <User className="w-5 h-5" />
                                                <span>My Account</span>
                                            </Link>
                                            <Link
                                                to="/orders"
                                                className="flex items-center gap-3 px-3 py-2 text-gray-700 transition-colors rounded-lg hover:bg-gray-50"
                                            >
                                                <ShoppingCart className="w-5 h-5" />
                                                <span>My Orders</span>
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center w-full gap-3 px-3 py-2 text-red-600 transition-colors rounded-lg hover:bg-gray-50"
                                            >
                                                <User className="w-5 h-5" />
                                                <span>Sign Out</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <Link
                                                to="/login"
                                                className="block w-full px-4 py-2 text-center transition-colors border rounded-lg border-primary text-primary hover:bg-primary/5"
                                            >
                                                Sign In
                                            </Link>
                                            <Link
                                                to="/register"
                                                className="block w-full px-4 py-2 text-center text-white transition-colors rounded-lg bg-primary hover:bg-primary/90"
                                            >
                                                Create Account
                                            </Link>
                                        </div>
                                    )}
                                    
                                    <Link
                                        to="/register/seller"
                                        className="flex items-center gap-3 px-3 py-2 mt-4 text-gray-700 transition-colors rounded-lg hover:bg-gray-50"
                                    >
                                        <Store className="w-5 h-5" />
                                        <span>Sell on ShopEase</span>
                                    </Link>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;