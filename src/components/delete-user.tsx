'use client';

import { useRef, useState } from 'react';

import InputError from './input-error';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import HeadingSmall from './heading-small';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

export default function DeleteUser() {
  const passwordInput = useRef<HTMLInputElement>(null);

  const [password, setPassword] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const closeModal = () => {
    setPassword('');
    setError(null);
  };

  const deleteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);

    try {
      const res = await fetch('/api/user/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const result = await res.json();
        setError(result.error || 'Failed to delete account.');
        passwordInput.current?.focus();
      } else {
        closeModal();
        // Optional: redirect or show confirmation
        window.location.href = '/goodbye';
      }
    } catch (err) {
      setError('Something went wrong.');
      passwordInput.current?.focus();
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <HeadingSmall
        title="Delete account"
        description="Delete your account and all of its resources"
      />

      <div className="space-y-4 rounded-lg border border-red-100 bg-red-50 p-4">
        <div className="relative space-y-0.5 text-red-600">
          <p className="font-medium">Warning</p>
          <p className="text-sm">Please proceed with caution, this cannot be undone.</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">Delete account</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogTitle>Are you sure you want to delete your account?</DialogTitle>
            <DialogDescription>
              Once your account is deleted, all of its resources and data will also be permanently
              deleted. Please enter your password to confirm.
            </DialogDescription>

            <form className="space-y-6" onSubmit={deleteUser}>
              <div className="grid gap-2">
                <Label htmlFor="password" className="sr-only">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  ref={passwordInput}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  autoComplete="current-password"
                />
                <InputError message={error ?? ''} />
              </div>

              <DialogFooter className="gap-2">
                <DialogClose asChild>
                  <Button variant="secondary" onClick={closeModal}>
                    Cancel
                  </Button>
                </DialogClose>

                <Button variant="destructive" disabled={processing} asChild>
                  <button type="submit">Delete account</button>
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
