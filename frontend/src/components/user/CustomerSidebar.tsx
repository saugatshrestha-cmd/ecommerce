import { useAuthContext } from '@/context/authContext';
import { UserRound } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Link, useLocation } from 'react-router-dom';

const CustomerSidebar = () => {
    const { user } = useAuthContext();
    const { pathname } = useLocation();
    
    const navItems = [
        { path: '/account', label: 'Account', icon: '👤', description: 'Manage your profile' },
        { path: '/orders', label: 'Orders', icon: '📦', description: 'View order history' },
    ];

    return (
        <aside className="w-full md:w-1/4">
            <Card className="border border-gray-200 shadow-lg bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
                {/* User Profile Section */}
                <div className="p-8 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="relative">
                            <UserRound />
                        </div>
                        
                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                {user?.role === 'customer' 
                                    ? `${user.firstName} ${user.lastName}` 
                                    : 'Welcome'
                                }
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                {user?.email}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation Section */}
                <nav className="p-6">
                    <div className="space-y-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.path;
                            
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className="block group"
                                >
                                    <div className={`
                                        relative flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ease-in-out
                                        ${isActive 
                                            ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 shadow-sm' 
                                            : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 border border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                                        }
                                        group-hover:scale-[1.02] group-active:scale-[0.98]
                                    `}>
                                        {/* Icon Container */}
                                        <div className={`
                                            w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-colors duration-200
                                            ${isActive
                                                ? 'bg-blue-100 dark:bg-blue-800/30' 
                                                : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'
                                            }
                                        `}>
                                            {item.icon}
                                        </div>
                                        
                                        {/* Text Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className={`
                                                font-medium transition-colors duration-200
                                                ${isActive 
                                                    ? 'text-blue-700 dark:text-blue-300' 
                                                    : 'text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-200'
                                                }
                                            `}>
                                                {item.label}
                                            </div>
                                            <div className={`
                                                text-xs transition-colors duration-200
                                                ${isActive 
                                                    ? 'text-blue-600 dark:text-blue-400' 
                                                    : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                                                }
                                            `}>
                                                {item.description}
                                            </div>
                                        </div>

                                        {/* Active Indicator */}
                                        {isActive && (
                                            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-sm"></div>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </nav>

            </Card>
        </aside>
    );
};

export default CustomerSidebar;