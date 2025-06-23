import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { shippingSchema } from '@/validations/shippingValidation';
import { useCreateShipping, useUpdateShipping } from '@/hooks/useShipping';
import type { CreateShipmentInfo, ShipmentInfo } from '@/types/shippingTypes';

interface ShippingFormProps {
  onClose: () => void;
  onSuccess?: (newAddress: ShipmentInfo) => void;
  initialData?: ShipmentInfo | null;
}

const ShippingForm = ({ onClose, onSuccess, initialData }: ShippingFormProps) => {
  const queryClient = useQueryClient();
  const { mutate: createShipping,isPending } = useCreateShipping();
  const { mutate: updateShipping } = useUpdateShipping();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateShipmentInfo>({
    resolver: zodResolver(shippingSchema),
    defaultValues: initialData || {},
  });

  useEffect(() => {
    if (initialData) {
      reset({
      ...initialData,
      phone: String(initialData.phone), // Ensure phone is string
    });
    }
  }, [initialData, reset]);

  const onSubmit = (data: CreateShipmentInfo) => {
    if (initialData) {
      // Update existing address
      updateShipping(
        { id: initialData._id, data },
        {
          onSuccess: (updatedAddress) => {
            queryClient.invalidateQueries({ queryKey: ['shipping'] });
            onSuccess?.(updatedAddress);
            onClose();
          },
        }
      );
    } else {
      // Create new address
      createShipping(data, {
        onSuccess: (newAddress) => {
          queryClient.invalidateQueries({ queryKey: ['shipping'] });
          onSuccess?.(newAddress);
          onClose();
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold text-gray-800">{initialData ? 'Edit Shipping Address' : 'Add Shipping Address'}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            {...register('full_name')}
            className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="John Doe"
          />
          {errors.full_name && <p className="text-sm text-red-500 mt-1">{errors.full_name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            {...register('email')}
            type="email"
            className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="email@example.com"
          />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="text"
            {...register('phone')}
            className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="+1234567890"
          />
          {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Region</label>
          <input
            {...register('region')}
            className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="California"
          />
          {errors.region && <p className="text-sm text-red-500 mt-1">{errors.region.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">City</label>
          <input
            {...register('city')}
            className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Los Angeles"
          />
          {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input
            {...register('address')}
            className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="123 Main St"
          />
          {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>}
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 disabled:opacity-50"
        >
          {isPending ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default ShippingForm;