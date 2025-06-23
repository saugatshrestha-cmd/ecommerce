import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "@/context/authContext";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
    allowedRoles?: ("admin" | "seller" | "customer")[]; 
    redirectTo?: string; 
    children?: ReactNode; 
}

const ProtectedRoute = ({
    allowedRoles,
    redirectTo = "/login",
    children,
}: ProtectedRouteProps) => {
    const { user, isAuthenticated, isLoading } = useAuthContext();

    if (isLoading) return <div className="text-center py-10">Loading...</div>;

    if (!isAuthenticated || !user) {
        return <Navigate to={redirectTo} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
