import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
    getMyProfile, 
    updateMyProfile, 
    changeMyEmail, 
    changeMyPassword, 
    deleteMyAccount,
    deleteUserAdmin, 
    getAllUsers, 
    getUserById, 
    getAdminProfile,
    updateAdminProfile, 
    changeAdminEmail, 
    changeAdminPassword, 
    deleteAdminAccount 
} from "@/services/userService";
import type { User, UpdateUser, UpdateEmail, UpdatePassword } from "@/types/userTypes";

export function useMyProfile() {
    return useQuery<User, unknown>({
        queryKey: ['myProfile'],
        queryFn: getMyProfile
    });
}

export function useUsers() {
    return useQuery<User[], unknown>({
        queryKey: ['user'],
        queryFn: getAllUsers,
    });
}

export const useUserById = (id: string) => {
    return useQuery({
    queryKey: ['user', id],
    queryFn: () => getUserById(id),
    enabled: !!id,
    });
};


export function useUpdateUser() {
    const qc = useQueryClient();
    return useMutation<User, unknown,  UpdateUser >({
        mutationFn: (data) => updateMyProfile(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['user'] }),
    });
}

export function useUpdateEmail() {
    const qc = useQueryClient();
    return useMutation<User, unknown,  UpdateEmail >({
        mutationFn: (data) => changeMyEmail(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['user'] }),
    });
}

export function useUpdatePassword() {
    const qc = useQueryClient();
    return useMutation<User, unknown,  UpdatePassword >({
        mutationFn: (data) => changeMyPassword(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['user'] }),
    });
}

export function useDeleteUser() {
    const qc = useQueryClient();
    return useMutation<void, unknown, string>({
        mutationFn: deleteMyAccount,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['user'] }),
    });
}

export function useDeleteUserAdmin() {
    const qc = useQueryClient();
    return useMutation<void, unknown, string>({
        mutationFn: deleteUserAdmin,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['user'] }),
    });
}

export function useAdminProfile() {
    return useQuery<User, unknown>({
        queryKey: ['myProfile'],
        queryFn: getAdminProfile
    });
}

export function useUpdateAdmin() {
    const qc = useQueryClient();
    return useMutation<User, unknown,  UpdateUser >({
        mutationFn: (data) => updateAdminProfile(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['user'] }),
    });
}

export function useUpdateAdminEmail() {
    const qc = useQueryClient();
    return useMutation<User, unknown,  UpdateEmail >({
        mutationFn: (data) => changeAdminEmail(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['user'] }),
    });
}

export function useUpdateAdminPassword() {
    const qc = useQueryClient();
    return useMutation<User, unknown,  UpdatePassword >({
        mutationFn: (data) => changeAdminPassword(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['user'] }),
    });
}

export function useDeleteAdmin() {
    const qc = useQueryClient();
    return useMutation<void, unknown, string>({
        mutationFn: deleteAdminAccount,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['user'] }),
    });
}