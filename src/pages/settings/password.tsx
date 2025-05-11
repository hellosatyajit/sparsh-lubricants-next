import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/setting-layout';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { useForm, Controller } from 'react-hook-form';
import { useRef } from 'react';

import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Password settings',
    href: '/settings/password',
  },
];

interface FormData {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export default function Password() {
  const passwordInput = useRef<HTMLInputElement>(null);
  const currentPasswordInput = useRef<HTMLInputElement>(null);

  const { control, handleSubmit, formState: { errors, isSubmitting, isSubmitSuccessful }, reset } = useForm<FormData>({
    defaultValues: {
      current_password: '',
      password: '',
      password_confirmation: '',
    },
  });

  const updatePassword = handleSubmit(async (data) => {
    try {
      const response = await fetch(route('password.update'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        reset();
      } else {
        const errorData = await response.json();
        if (errorData.errors.password) {
          reset({ password: '', password_confirmation: '' });
          passwordInput.current?.focus();
        }

        if (errorData.errors.current_password) {
          reset({ current_password: '' });
          currentPasswordInput.current?.focus();
        }
      }
    } catch (error) {
      console.error('Error updating password:', error);
    }
  });

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall title="Update password" description="Ensure your account is using a long, random password to stay secure" />

          <form onSubmit={updatePassword} className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="current_password">Current password</Label>

              <Controller
                name="current_password"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="current_password"
                    ref={currentPasswordInput}
                    type="password"
                    className="mt-1 block w-full"
                    autoComplete="current-password"
                    placeholder="Current password"
                  />
                )}
              />

              <InputError message={errors.current_password?.message} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">New password</Label>

              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="password"
                    ref={passwordInput}
                    type="password"
                    className="mt-1 block w-full"
                    autoComplete="new-password"
                    placeholder="New password"
                  />
                )}
              />

              <InputError message={errors.password?.message} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password_confirmation">Confirm password</Label>

              <Controller
                name="password_confirmation"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="password_confirmation"
                    type="password"
                    className="mt-1 block w-full"
                    autoComplete="new-password"
                    placeholder="Confirm password"
                  />
                )}
              />

              <InputError message={errors.password_confirmation?.message} />
            </div>

            <div className="flex items-center gap-4">
              <Button disabled={isSubmitting}>Save password</Button>

              <Transition
                show={isSubmitSuccessful}
                enter="transition ease-in-out"
                enterFrom="opacity-0"
                leave="transition ease-in-out"
                leaveTo="opacity-0"
              >
                <p className="text-sm text-neutral-600">Saved</p>
              </Transition>
            </div>
          </form>
        </div>
      </SettingsLayout>
    </AppLayout>
  );
}
