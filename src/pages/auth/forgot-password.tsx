// Components
import { LoaderCircle } from 'lucide-react';
import { useForm, SubmitHandler } from 'react-hook-form';

import InputError from '../../components/input-error';
import TextLink from '../../components/text-link';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import AuthLayout from '../../layouts/auth-layout';

type FormValues = {
    email: string;
};

export default function ForgotPassword({ status }: { status?: string }) {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormValues>({
        defaultValues: {
            email: '',
        }
    });

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
        <AuthLayout title="Forgot password" description="Enter your email to receive a password reset link">

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}

            <div className="space-y-6">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            autoComplete="off"
                            autoFocus
                            {...register('email', { required: 'Email is required' })}
                            placeholder="email@example.com"
                        />

                        <InputError message={errors.email?.message} />
                    </div>

                    <div className="my-6 flex items-center justify-start">
                        <Button className="w-full" disabled={isSubmitting}>
                            {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Email password reset link
                        </Button>
                    </div>
                </form>

                <div className="text-muted-foreground space-x-1 text-center text-sm">
                    <span>Or, return to</span>
                    <TextLink href={"/login"}>log in</TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
