'use client';

import Head from 'next/head';
import { useState, FormEventHandler } from 'react';
import { LoaderCircle } from 'lucide-react';

import InputError from '../../components/input-error';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import AuthLayout from '../../layouts/auth-layout';

interface ResetPasswordProps {
  token: string;
  email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
  const [form, setForm] = useState({
    token: token || '',
    email: email || '',
    password: '',
    password_confirmation: '',
  });

  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [processing, setProcessing] = useState(false);

  const setData = (key: keyof typeof form, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const reset = (...fields: (keyof typeof form)[]) => {
    const updated = { ...form };
    for (const field of fields) updated[field] = '';
    setForm(updated);
  };

  const submit: FormEventHandler = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setErrors({});

    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrors(data.errors || {});
      } else {
        // Redirect or show confirmation
        window.location.href = '/login';
      }
    } catch (err) {
      console.error('Reset failed:', err);
    } finally {
      setProcessing(false);
      reset('password', 'password_confirmation');
    }
  };

  return (
    <AuthLayout title="Reset password" description="Please enter your new password below">
      <Head>
        <title>Reset password</title>
      </Head>

      <form onSubmit={submit}>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              value={form.email}
              className="mt-1 block w-full"
              readOnly
              onChange={(e) => setData('email', e.target.value)}
            />
            <InputError message={errors.email} className="mt-2" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              autoComplete="new-password"
              value={form.password}
              className="mt-1 block w-full"
              autoFocus
              onChange={(e) => setData('password', e.target.value)}
              placeholder="Password"
            />
            <InputError message={errors.password} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password_confirmation">Confirm password</Label>
            <Input
              id="password_confirmation"
              type="password"
              name="password_confirmation"
              autoComplete="new-password"
              value={form.password_confirmation}
              className="mt-1 block w-full"
              onChange={(e) => setData('password_confirmation', e.target.value)}
              placeholder="Confirm password"
            />
            <InputError message={errors.password_confirmation} className="mt-2" />
          </div>

          <Button type="submit" className="mt-4 w-full" disabled={processing}>
            {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
            Reset password
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
