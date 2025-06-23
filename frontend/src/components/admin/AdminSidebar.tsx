import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, User, Boxes, Store, Users, LogOut, Archive } from "lucide-react";
import { useLogout } from '@/hooks/useAuth';
import { toast } from "sonner";
import { useAuthContext } from '@/context/authContext';
import userIcon from "@/assets/icons/user.svg"

const AdminSidebar = () => {
    const { user, refetch } = useAuthContext();
    const navigate = useNavigate();
    const { mutate: logout } = useLogout();

    const handleLogout = () => {
        logout(undefined, {
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

    const menuItems = [
        { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { to: "/admin/products", label: "Products", icon: Archive },
        { to: "/admin/seller", label: "Seller", icon: Store },
        { to: "/admin/customer", label: "Customer", icon: Users },
        { to: "/admin/order", label: "Orders", icon: Package },
        { to: "/admin/category", label: "Category", icon: Boxes },
        { to: "/admin/profile", label: "Profile", icon: User },
        { to: "/login", label: "Logout", icon: LogOut, onclick: handleLogout },
    ];

    return (
    <aside className="w-[250px] h-auto border-r bg-white shadow-sm">
        <div className="w-[250px] h-[440px] px-6 mt-6">
        <div className="flex gap-2 w-[202px] h-[50px] mb-[60px]">
            <img src={userIcon} className="h-[44px] w-[44px]" />
            <div className="flex flex-col">
            <span className="font-semibold text-[12px] text-gray-400">Admin</span>
            <h2 className="text-[16px]  font-bold mb-6">{user?.role === "admin" ? `${user.firstName} ${user.lastName}` : "Admin Panel"}</h2>
            </div>
        </div>

        <nav className="space-y-[18px] w-[210px] h-[330px]">
        {menuItems.map((item) => 
            item.label === "Logout" ? (
                <button
                    key={item.label}
                    onClick={item.onclick}
                    className="w-[210px] h-[40px] flex items-center gap-[18px] px-3 py-2 rounded-md text-[16px] text-red-500 font-semibold hover:bg-red-100 transition"
                >
                    <item.icon size={24} />
                    {item.label}
                </button>
            ) : (
            <NavLink
            key={item.to}
            to={item.to}
            end
            className={({ isActive }) =>
                `w-[210px] h-[40px] flex items-center gap-[18px] px-3 py-2 rounded-md text-[16px] text-gray-400 font-semibold transition ${
                    isActive
                    ? "bg-[radial-gradient(50.27%_2723.2%_at_49.73%_42.98%,_#E5A469_50.4%,_#DF8D44_100%)] text-white font-semibold"
                    : "text-black hover:bg-[radial-gradient(50.27%_2723.2%_at_49.73%_42.98%,_#E5A469_50.4%,_#DF8D44_100%)] hover:text-white"
                }`
            }
            >
            <item.icon size={24} />
            {item.label}
            </NavLink>
        ))}
        </nav>
        </div>
    </aside>
    );
};

export default AdminSidebar;