import { useForm } from 'react-hook-form';
import { useLogin } from '@/hooks/useAuth';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/validations/authValidation';
import { z } from 'zod';
import { toast } from 'sonner';

type LoginPayload = z.infer<typeof loginSchema>

const LoginForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginPayload>({resolver: zodResolver(loginSchema),});
    const [serverError, setServerError] = useState<string | null>(null);
    const { mutate: login, isPending } = useLogin();

    const onSubmit = (data: LoginPayload) => {
      setServerError(null);
      login(data, {
        onSuccess: () => {
            toast.success("Logged in successfully");
        }, 
        onError: () => {
            toast.error("Failed to login");
        },
    });
    };

    return (
    <>
    <div className="flex items-center justify-center min-h-[70vh] bg-gray-50 px-4">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center">Login to your account</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {/* Email Field */}
            <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
            <input
                type="email"
                {...register('email')}
                className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
            </div>

          {/* Password Field */}
            <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
            <input
                type="password"
                {...register('password')}
                className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
            </div>

          {/* Server Error */}
            {serverError && (
            <p className="text-sm text-center text-red-600">{serverError}</p>
            )}

          {/* Submit Button */}
            <button
            type="submit"
            disabled={isPending}
            className="w-full py-2 text-base font-medium text-white transition bg-black border border-black rounded-md hover:bg-white hover:text-black disabled:opacity-50"
            >
            {isPending ? 'Logging in...' : 'Login'}
            </button>

          {/* Register Link */}
            <p className="text-sm text-center text-gray-600">
            Don't have an account?{' '}
            <Link to="/register/customer" className="text-blue-600 hover:underline">
                Register
            </Link>
            </p>
        </form>
        </div>
    </div>
    </>
    );
};

export default LoginForm;
