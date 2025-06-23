import { useForm } from 'react-hook-form';
import { useRegisterCustomer } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import type { ErrorResponse } from '@/types/authTypes';
import { AxiosError } from 'axios';
import { Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerCustomerSchema } from '@/validations/authValidation';
import { z } from 'zod';

type RegisterUser = z.infer<typeof registerCustomerSchema>

const RegisterForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterUser>({resolver: zodResolver(registerCustomerSchema),});
    const [serverError, setServerError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { mutate: registerCustomer, isPending } = useRegisterCustomer();

    const onSubmit = (data: RegisterUser) => {
        setServerError(null);
        registerCustomer(data, {
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
        <div className="w-full max-w-md mt-10 p-6 bg-white shadow-md rounded-2xl">
        <h2 className="text-2xl font-bold text-center mb-6">Create Your Account</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <input
                {...register('firstName')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {errors.firstName && <p className="text-red-600 text-sm">{errors.firstName.message}</p>}
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <input
                {...register('lastName')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {errors.lastName && <p className="text-red-600 text-sm">{errors.lastName.message}</p>}
            </div>
            </div>

            <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
                type="email"
                {...register('email')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
            </div>

            <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
                type="password"
                {...register('password')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
            </div>

            <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
                type="text"
                {...register('phone')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.phone && <p className="text-red-600 text-sm">{errors.phone.message}</p>}
            </div>

            <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
                {...register('address')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.address && <p className="text-red-600 text-sm">{errors.address.message}</p>}
            </div>

            {serverError && (
            <p className="text-red-600 text-center text-sm">{serverError}</p>
            )}

            <button
            type="submit"
            disabled={isPending}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
            {isPending ? 'Registering...' : 'Register'}
            </button>

            <p className="text-sm text-center text-gray-600 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
                Login
            </Link>
            </p>
        </form>
        </div>
    </div>
    </>
    );
};

export default RegisterForm;
