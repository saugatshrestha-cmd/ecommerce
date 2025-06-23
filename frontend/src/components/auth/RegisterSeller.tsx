import { useForm } from 'react-hook-form';
import { useRegisterSeller } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import type { ErrorResponse } from '@/types/authTypes';
import { AxiosError } from 'axios';
import { Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSellerSchema } from '@/validations/authValidation';
import { z } from 'zod';

type RegisterUser = z.infer<typeof registerSellerSchema>

const RegisterSeller = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterUser>({resolver: zodResolver(registerSellerSchema),});
    const [serverError, setServerError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { mutate: registerSeller, isPending } = useRegisterSeller();

    const onSubmit = (data: RegisterUser) => {
        setServerError(null);
        registerSeller(data, {
            onSuccess: () => navigate('/login'),
            onError: (error: AxiosError<ErrorResponse>) => {
                const message = error.response?.data?.message || 'Registration failed.';
                setServerError(message);
            },
        });
    };

    return (
    <>
    <div className="flex items-center justify-center min-h-[85vh] bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white p-6 rounded-md shadow">
        <h2 className="text-xl font-semibold text-center mb-5">Register as Seller</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Store Name */}
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
            <input
                {...register('storeName')}
                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring focus:ring-green-500"
            />
            {errors.storeName && (
                <p className="text-xs text-red-600 mt-1">{errors.storeName.message}</p>
            )}
            </div>

          {/* Email */}
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
                type="email"
                {...register('email')}
                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring focus:ring-green-500"
            />
            {errors.email && (
                <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
            )}
            </div>

          {/* Password */}
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
                type="password"
                {...register('password')}
                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring focus:ring-green-500"
            />
            {errors.password && (
                <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
            )}
            </div>

          {/* Phone */}
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
                type="text"
                {...register('phone')}
                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring focus:ring-green-500"
            />
            {errors.phone && (
                <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>
            )}
            </div>

          {/* Address */}
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
                {...register('address')}
                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring focus:ring-green-500"
            />
            {errors.address && (
                <p className="text-xs text-red-600 mt-1">{errors.address.message}</p>
            )}
            </div>

          {/* Server Error */}
            {serverError && (
            <p className="text-xs text-center text-red-600">{serverError}</p>
            )}

          {/* Submit Button */}
            <button
            type="submit"
            disabled={isPending}
            className="w-full bg-green-600 text-white py-2 text-sm rounded-md hover:bg-green-700 transition disabled:opacity-50"
            >
            {isPending ? 'Registering...' : 'Register'}
            </button>

          {/* Login Link */}
            <p className="text-xs text-center text-gray-600 mt-2">
            Already have an account?{' '}
            <Link to="/login" className="text-green-600 hover:underline">
                Login
            </Link>
            </p>
        </form>
        </div>
    </div>
    </>
    );
};

export default RegisterSeller;
