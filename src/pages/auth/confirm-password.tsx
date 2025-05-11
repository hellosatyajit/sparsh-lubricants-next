// Components
import { useForm, SubmitHandler } from 'react-hook-form';
import { LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type FormValues = {
    password: string;
};

export default function ConfirmPassword() {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormValues>();

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        // Simulate a post request
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(data);
                reset();
                resolve(true);
            }, 1000);
        });
    };

    return (
        <AuthLayout
            title="Confirm your password"
            description="This is a secure area of the application. Please confirm your password before continuing."
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Password"
                            autoComplete="current-password"
                            autoFocus
                            {...register('password', { required: 'Password is required' })}
                        />

                        <InputError message={errors.password?.message} />
                    </div>

                    <div className="flex items-center">
                        <Button className="w-full" disabled={isSubmitting}>
                            {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Confirm password
                        </Button>
                    </div>
                </div>
            </form>
        </AuthLayout>
    );
}
