import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { login, logout, registerCustomer, registerSeller, registerAdmin, fetchCurrentUser } from '@/services/authService';
import type { LoginResponse, LoginPayload, RegisterSeller, RegisterUser, ErrorResponse, User} from '@/types/authTypes';
import { useNavigate } from 'react-router-dom';
import type { AxiosError } from 'axios';

export const useLogin = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    
    return useMutation<LoginResponse, AxiosError<ErrorResponse>, LoginPayload>({
        mutationFn: login,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["authUser"] });
            // Get the updated user data
            const user = queryClient.getQueryData<User>(["authUser"]);
            // Navigate based on role
            if (user) {
                switch (user.role) {
                    case 'admin':
                        navigate('/admin');
                        break;
                    case 'seller':
                        navigate('/seller');
                        break;
                    case 'customer':
                    default:
                        navigate('/');
                        break;
                }
            }
        },
        onError: (err) => {
            console.error("Login failed", err);
        },
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
            queryClient.invalidateQueries({ queryKey: ["cart"] });
            queryClient.invalidateQueries({ queryKey: ["cart-summary"] });
            queryClient.removeQueries();
        },
        onError: (err) => {
            console.error("Logout failed", err);
        },
    });
};

export const useAuthUser = () => {
    return useQuery<User, AxiosError<ErrorResponse>>({
        queryKey: ["authUser"],
        queryFn: fetchCurrentUser,
        retry: false,
        staleTime: 15 * 60 * 1000, 
        refetchOnWindowFocus: false,
        enabled: true,
}
);
};

export const useRegisterCustomer = () => {
    return useMutation<void, AxiosError<ErrorResponse>, RegisterUser>({
        mutationFn: registerCustomer,
        onSuccess: () => {
            console.log('Customer registered successfully');
        },
        onError: (err) => {
            console.error('Customer registration failed', err);
        },
    });
};

export const useRegisterSeller = () => {
    return useMutation<void, AxiosError<ErrorResponse>, RegisterSeller>({
        mutationFn: registerSeller,
        onSuccess: () => {
            console.log('Seller registered successfully');
        },
        onError: (err) => {
            console.error('Seller registration failed', err);
        },
    });
};

export const useRegisterAdmin = () => {
    return useMutation<void, AxiosError<ErrorResponse>, RegisterUser>({
        mutationFn: registerAdmin,
        onSuccess: () => {
            console.log('Admin registered successfully');
        },
        onError: (err) => {
            console.error('Admin registration failed', err);
        },
    });
};


