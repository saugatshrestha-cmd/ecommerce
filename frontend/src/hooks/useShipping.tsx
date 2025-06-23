import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAllShipping, getShippingById, createShipping, updateShipping, deleteShipping } from '@/services/shippingService';
import type { ShipmentInfo, CreateShipmentInfo, UpdateShipmentInfo } from "@/types/shippingTypes";

export function useShipping() {
    return useQuery<ShipmentInfo[], unknown>({
        queryKey: ['shipping'],
        queryFn: getAllShipping,
    });
}

export const useShippingById = (id: string) => {
    return useQuery({
    queryKey: ['shipping', id],
    queryFn: () => getShippingById(id),
    enabled: !!id,
    });
};

export function useCreateShipping() {
    const qc = useQueryClient();
    return useMutation<ShipmentInfo, unknown, CreateShipmentInfo>({
        mutationFn: createShipping,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['ship'] }),
    });
}

export function useUpdateShipping() {
    const qc = useQueryClient();
    return useMutation<ShipmentInfo, unknown, { id: string; data: UpdateShipmentInfo }>({
        mutationFn: ({ id, data }) => updateShipping(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['shipping'] }),
    });
}

export function useDeleteShipping() {
    const qc = useQueryClient();
    return useMutation<void, unknown, string>({
        mutationFn: deleteShipping,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['shipping'] }),
    });
}