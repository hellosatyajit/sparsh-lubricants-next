'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import AppLayout from '../../layouts/app-layout';
import SettingsLayout from '../../layouts/setting-layout';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const profileFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
});

type BreadcrumbItem = {
  title: string;
  href: string;
};

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Profile settings',
    href: '/settings/profile',
  },
];

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const form = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: session?.user?.name || '',
      email: session?.user?.email || '',
    },
  });

  const onSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    try {
      setIsSaving(true);
      // Call your API endpoint to update the profile
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        // Update the session to reflect changes
        await update({
          ...session,
          user: {
            ...session?.user,
            name: values.name,
            email: values.email,
          },
        });
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch('/api/profile', {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <SettingsLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium">Profile Information</h2>
            <p className="text-sm text-muted-foreground">
              Update your name and email address
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {session?.user?.emailVerified === false && (
                <div className="rounded-md bg-yellow-50 p-4 text-sm text-yellow-700">
                  Your email address is unverified. Please check your email for a
                  verification link.
                </div>
              )}

              <div className="flex items-center gap-4">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save changes'}
                </Button>
                {saveSuccess && (
                  <p className="text-sm text-green-600">Profile updated successfully</p>
                )}
              </div>
            </form>
          </Form>
        </div>

        <div className="mt-8 border-t pt-8">
          <div className="mb-4">
            <h2 className="text-lg font-medium text-destructive">Delete Account</h2>
            <p className="text-sm text-muted-foreground">
              Once your account is deleted, all of its resources and data will be permanently removed.
            </p>
          </div>

          <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">Delete Account</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure absolutely sure?</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  This action cannot be undone. This will permanently delete your account
                  and remove your data from our servers.
                </p>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDeleteAccount}>
                    Delete Account
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </SettingsLayout>
    </AppLayout>
  );
}