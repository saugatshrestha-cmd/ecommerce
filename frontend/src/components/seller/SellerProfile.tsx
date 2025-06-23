import { useAuthContext } from '@/context/authContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { updateSellerSchema, updateEmailSchema, updatePasswordSchema } from '@/validations/sellerValidation';
import { useUpdateSeller, useUpdateSellerEmail, useUpdateSellerPassword } from '@/hooks/useSeller';
import { toast } from 'sonner';

type UpdateSellerInput = z.infer<typeof updateSellerSchema>;
type UpdateEmailInput = z.infer<typeof updateEmailSchema>;
type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;

const SellerProfilePage = () => {
    const { user } = useAuthContext();
    const [editing, setEditing] = useState(false);
    const updateUserMutation = useUpdateSeller();
    const updateEmailMutation = useUpdateSellerEmail();
    const updatePasswordMutation = useUpdateSellerPassword();
    const [originalValues, setOriginalValues] = useState<UpdateSellerInput>({
        storeName: '',
        phone: '',
        address: '',
    });

    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        reset: resetProfile,
        formState: { errors: errorsProfile },
    } = useForm<UpdateSellerInput>({
        resolver: zodResolver(updateSellerSchema),
        defaultValues: {
        storeName: '',
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
    if (user && user.role === 'seller') {
        const values = {
        storeName: user.storeName ?? '',
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

    const onSubmitProfile = (data: UpdateSellerInput) => {
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

    if (!user) return <p className="mt-10 text-center">Loading user data...</p>;
    if (!user || user.role !== 'seller') {
        return <p className="mt-10 text-center">Unauthorized access.</p>;
    }

    return (
    <>
    <div className="bg-white px-4 py-4 border-b md:px-8 md:py-[13px]">
        <div className="flex flex-col gap-0.5">
            <span className='text-sm md:text-[14px] text-gray-400'>Home /</span>
            <span className="text-xl md:text-[24px] text-gray-700 font-medium">Profile</span>
        </div>
    </div>
    <div className="max-w-2xl px-4 py-8 mx-auto space-y-10">
        <section>
        <h2 className="mb-4 text-xl font-bold">Store Information</h2>
        <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-4">
            <div>
            <label className="block mb-1 font-medium">Store Name</label>
            <input
                type="text"
                {...registerProfile('storeName')}
                disabled={!editing}
                className="w-full px-3 py-2 text-sm border rounded-md disabled:bg-gray-100"
            />
            {errorsProfile.storeName && (
                <p className="text-sm text-red-600">{errorsProfile.storeName.message}</p>
            )}
            </div>

            <div>
            <label className="block mb-1 font-medium">Phone</label>
            <input
                type="text"
                {...registerProfile('phone')}
                disabled={!editing}
                className="w-full px-3 py-2 text-sm border rounded-md disabled:bg-gray-100"
            />
            {errorsProfile.phone && (
                <p className="text-sm text-red-600">{errorsProfile.phone.message}</p>
            )}
            </div>

            <div>
            <label className="block mb-1 font-medium">Address</label>
            <input
                {...registerProfile('address')}
                disabled={!editing}
                className="w-full px-3 py-2 text-sm border rounded-md disabled:bg-gray-100"
            />
            {errorsProfile.address && (
                <p className="text-sm text-red-600">{errorsProfile.address.message}</p>
            )}
            </div>

            {editing && (
                <div className="flex items-center justify-between pt-4">
                <Button type="submit" className='border border-[#DF8D44] bg-[#DF8D44] hover:bg-white hover:text-[#DF8D44] font-bold'>Save</Button>
                <Button 
                    variant="outline" 
                    type="button" 
                    onClick={() => {
                        setEditing(false);
                        resetProfile(originalValues);
                }}
                    className='font-bold'
                >
                    Cancel
                </Button>
            </div>
            )}
            {!editing && (
                <Button 
                type="button" 
                onClick={() => setEditing(true)}
                className="mb-4 border border-[#DF8D44] bg-[#DF8D44] hover:bg-white hover:text-[#DF8D44] font-bold"
                >
                Edit Profile
                </Button>
            )}
        </form>
        </section>

        <section>
        <h2 className="mb-4 text-xl font-bold">Update Email</h2>
        <form onSubmit={handleSubmitEmail(onSubmitEmail)} className="space-y-4">
            <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
                type="email"
                {...registerEmail('email')}
                className="w-full px-3 py-2 text-sm border rounded-md"
            />
            {errorsEmail.email && (
                <p className="text-sm text-red-600">{errorsEmail.email.message}</p>
            )}
            </div>
            <Button type="submit" className='border border-[#DF8D44] bg-[#DF8D44] hover:bg-white hover:text-[#DF8D44] font-bold'>Update Email</Button>
        </form>
        </section>

        <section>
        <h2 className="mb-4 text-xl font-bold">Change Password</h2>
        <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-4">
            <div>
            <label className="block mb-1 font-medium">New Password</label>
            <input
                type="password"
                {...registerPassword('oldPassword')}
                className="w-full px-3 py-2 text-sm border rounded-md"
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
                className="w-full px-3 py-2 text-sm border rounded-md"
                placeholder='New Password'
            />
            {errorsPassword.newPassword && (
                <p className="text-sm text-red-600">{errorsPassword.newPassword.message}</p>
            )}
            </div>
            <Button type="submit" className='border border-[#DF8D44] bg-[#DF8D44] hover:bg-white hover:text-[#DF8D44] font-bold'>Change Password</Button>
        </form>
        </section>
    </div>
    </>
    );
};

export default SellerProfilePage;
