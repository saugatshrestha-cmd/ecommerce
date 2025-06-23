import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllSellers, getSellerById, getMyProfile, updateMyProfile, changeMyEmail, changeMyPassword, deleteMyAccount, deleteSellerAdmin } from "@/services/sellerService";
import type { Seller, UpdateSeller, UpdateEmail, UpdatePassword } from "@/types/sellerTypes";

export function useMyProfile() {
    return useQuery<Seller, unknown>({
        queryKey: ['myProfile'],
        queryFn: getMyProfile
    });
}

export function useSellers() {
    return useQuery<Seller[], unknown>({
        queryKey: ['seller'],
        queryFn: getAllSellers,
    });
}

export const useSellerById = (id: string) => {
    return useQuery({
    queryKey: ['seller', id],
    queryFn: () => getSellerById(id),
    enabled: !!id,
    });
};


export function useUpdateSeller() {
    const qc = useQueryClient();
    return useMutation<Seller, unknown,  UpdateSeller >({
        mutationFn: (data) => updateMyProfile(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['seller'] }),
    });
}

export function useUpdateSellerEmail() {
    const qc = useQueryClient();
    return useMutation<Seller, unknown,  UpdateEmail >({
        mutationFn: (data) => changeMyEmail(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['seller'] }),
    });
}

export function useUpdateSellerPassword() {
    const qc = useQueryClient();
    return useMutation<Seller, unknown,  UpdatePassword >({
        mutationFn: (data) => changeMyPassword(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['seller'] }),
    });
}

export function useDeleteSeller() {
    const qc = useQueryClient();
    return useMutation<void, unknown, string>({
        mutationFn: deleteMyAccount,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['seller'] }),
    });
}

export function useDeleteSellerAdmin() {
    const qc = useQueryClient();
    return useMutation<void, unknown, string>({
        mutationFn: deleteSellerAdmin,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['seller'] }),
    });
}
