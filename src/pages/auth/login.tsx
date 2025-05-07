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
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';


interface LoginProps {
  status?: string;
  canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  // const { data: session } = useSession();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);

  // if (session) {
  //   router.push("/"); // Redirect if already logged in
  // }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    const res = await signIn("credentials", {
      redirect: false,
      email: email,
      password
    });

    if (res?.error) {
      setError("Invalid username or password.");
    } else {
      router.push("/");
    }
    setProcessing(false);
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
            </div>

            <InputError message={error!} />

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
