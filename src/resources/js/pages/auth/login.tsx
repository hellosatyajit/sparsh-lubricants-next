// src/app/login/page.tsx or src/pages/login.tsx

'use client';

import Head from 'next/head';
import { useState } from 'react';
import { LoaderCircle } from 'lucide-react';

import InputError from '../../components/input-error';
import TextLink from '../../components/text-link';
import { Button } from '../../components/ui/button';
import { Checkbox } from '../../components/ui/checkbox';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import AuthLayout from '../../layouts/auth-layout';


interface LoginProps {
  status?: string;
  canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setErrors({});

    try {
      // Replace with your real login POST logic (e.g., fetch/axios)
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, remember }),
      });

      if (!response.ok) {
        const data = await response.json();
        setErrors(data.errors || {});
      } else {
        // On success, redirect or show success
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setProcessing(false);
      setPassword(''); // Clear password
    }
  };

  return (
    <>
      <Head>
        <title>Log in</title>
      </Head>

      <AuthLayout title="Log in to your account" description="Enter your email and password below to log in">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                required
                autoFocus
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
              />
              <InputError message={errors.email} />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                {canResetPassword && (
                  <TextLink href="/forgot-password" className="ml-auto text-sm">
                    Forgot password?
                  </TextLink>
                )}
              </div>
              <Input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              <InputError message={errors.password} />
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="remember"
                name="remember"
                checked={remember}
                onClick={() => setRemember(!remember)}
              />
              <Label htmlFor="remember">Remember me</Label>
            </div>

            <Button type="submit" className="mt-4 w-full" disabled={processing}>
              {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
              Log in
            </Button>
          </div>
        </form>

        {status && (
          <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>
        )}
      </AuthLayout>
    </>
  );
}
