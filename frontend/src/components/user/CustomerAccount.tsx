import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/context/authContext';
import { Card } from '@/components/ui/card';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateUserSchema, updateEmailSchema, updatePasswordSchema } from '@/validations/userValidation';
import { toast } from 'sonner';
import { useUpdateUser, useUpdateEmail, useUpdatePassword } from '@/hooks/useUser';
import CustomerSidebar from '../user/CustomerSidebar';

type UpdateCustomerInput = z.infer<typeof updateUserSchema>;
type UpdateEmailInput = z.infer<typeof updateEmailSchema>;
type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;

const CustomerAccount = () => {
    const { user } = useAuthContext();
    const [editing, setEditing] = useState(false);
    const updateUserMutation = useUpdateUser();
    const updateEmailMutation = useUpdateEmail();
    const updatePasswordMutation = useUpdatePassword();
    const [originalValues, setOriginalValues] = useState<UpdateCustomerInput>({
            firstName: '',
            lastName: '',
            phone: '',
            address: '',
        });

    const {
            register: registerProfile,
            handleSubmit: handleSubmitProfile,
            reset: resetProfile,
            formState: { errors: errorsProfile },
        } = useForm<UpdateCustomerInput>({
            resolver: zodResolver(updateUserSchema),
            defaultValues: {
                firstName: '',
                lastName: '',
                phone: '',
                address: '',
            },
        });
    const {
            register: registerEmail,
            handleSubmit: handleSubmitEmail,
            reset: resetEmail,
            formState: { errors: errorsEmail },
        } = useForm<UpdateEmailInput>({
            resolver: zodResolver(updateEmailSchema),
            defaultValues: {
            email: '',
            },
        });
    
        const {
            register: registerPassword,
            handleSubmit: handleSubmitPassword,
            formState: { errors: errorsPassword },
        } = useForm<UpdatePasswordInput>({
            resolver: zodResolver(updatePasswordSchema),
        });
    
        useEffect(() => {
        if (user && user.role === 'customer') {
            const values = {
                firstName: user.firstName ?? '',
                lastName: user.lastName ?? '',
                phone: user.phone ? String(user.phone) : '',
                address: user.address ?? '',
            };
            resetProfile(values);
            setOriginalValues(values);
            resetEmail({
                email: user.email ?? '',
            });
        }
        }, [user, resetProfile, resetEmail]);

    const onSubmitProfile = (data: UpdateCustomerInput) => {
        updateUserMutation.mutate(data, {
        onSuccess: () => {
            toast.success('Profile updated successfully!');
            setEditing(false);
        },
        onError: () => {
            toast.error('Failed to update profile');
        },
    });
    };

    const onSubmitEmail = (data: UpdateEmailInput) => {
        updateEmailMutation.mutate(data, {
        onSuccess: () => {
            toast.success('Email updated successfully!');
        },
        onError: () => {
            toast.error('Failed to update email');
        },
    });
    };

    const onSubmitPassword = (data: UpdatePasswordInput) => {
        updatePasswordMutation.mutate(data, {
        onSuccess: () => {
            toast.success('Password updated successfully!');
        },
        onError: () => {
            toast.error('Failed to update password');
        },
    });
    };

    return (
    <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <CustomerSidebar />

        {/* Main Content */}
        <main className="flex-1 space-y-10">
          {/* Profile Form */}
            <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Profile Information</h2>
            <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block mb-1 font-medium">First Name</label>
                    <Input type="text"
                    {...registerProfile('firstName')}
                    disabled={!editing}
                    className="w-full px-3 py-2 border rounded-md text-sm disabled:bg-gray-100" />
                    {errorsProfile.firstName && (
                    <p className="text-sm text-red-600">{errorsProfile.firstName.message}</p>
                    )}
                </div>
                <div>
                    <label className="block mb-1 font-medium">Last Name</label>
                    <Input type="text"
                    {...registerProfile('lastName')}
                    disabled={!editing}
                    className="w-full px-3 py-2 border rounded-md text-sm disabled:bg-gray-100" />
                    {errorsProfile.lastName && (
                    <p className="text-sm text-red-600">{errorsProfile.lastName.message}</p>
                    )}
                </div>
                <div>
                    <label className="block mb-1 font-medium">Phone</label>
                    <Input type="text"
                    {...registerProfile('phone')}
                    disabled={!editing}
                    className="w-full px-3 py-2 border rounded-md text-sm disabled:bg-gray-100" />
                    {errorsProfile.phone && (
                    <p className="text-sm text-red-600">{errorsProfile.phone.message}</p>
                    )}
                </div>
                <div>
                    <label className="block mb-1 font-medium">Address</label>
                    <Input type="text"
                    {...registerProfile('address')}
                    disabled={!editing}
                    className="w-full px-3 py-2 border rounded-md text-sm disabled:bg-gray-100" />
                    {errorsProfile.address && (
                    <p className="text-sm text-red-600">{errorsProfile.address.message}</p>
                    )}
                </div>
                </div>
                {editing && (
                <div className="flex justify-between items-center pt-4">
                <Button type="submit">Save</Button>
                <Button 
                    variant="outline" 
                    type="button" 
                    onClick={() => {
                        setEditing(false);
                        resetProfile(originalValues);
                }}
                >
                    Cancel
                </Button>
                </div>
                )}
                {!editing && (
                    <Button 
                    type="button" 
                    onClick={() => setEditing(true)}
                    className="mb-4"
                    >
                    Edit Profile
                    </Button>
                )}
            </form>
            </Card>

          {/* Email Update Form */}
            <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Update Email</h2>
            <form onSubmit={handleSubmitEmail(onSubmitEmail)} className="space-y-4">
                <label className="block mb-1 font-medium">Email</label>
                <Input type="email"
                    {...registerEmail('email')}
                    className="w-full px-3 py-2 border rounded-md text-sm disabled:bg-gray-100" />
                    {errorsEmail.email && (
                    <p className="text-sm text-red-600">{errorsEmail.email.message}</p>
                    )}
                <div className="flex justify-end gap-2 pt-4">
                <Button type="submit">Update Email</Button>
                </div>
            </form>
            </Card>

          {/* Password Update Form */}
            <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Change Password</h2>
            <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-4">
                <label className="block mb-1 font-medium">Password</label>
                <div>
                <label className="block mb-1 font-medium">New Password</label>
                <input
                    type="password"
                    {...registerPassword('oldPassword')}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    placeholder='Old Password'
                />
                {errorsPassword.oldPassword && (
                    <p className="text-sm text-red-600">{errorsPassword.oldPassword.message}</p>
                )}
                </div>
                <div>
                <input
                    type="password"
                    {...registerPassword('newPassword')}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    placeholder='New Password'
                />
                {errorsPassword.newPassword && (
                    <p className="text-sm text-red-600">{errorsPassword.newPassword.message}</p>
                )}
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="submit">Change Password</Button>
                </div>
            </form>
            </Card>
        </main>
        </div>
    </div>
    );
};

export default CustomerAccount;