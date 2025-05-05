"use client";

import Head from "next/head";
import { useState, FormEventHandler } from "react";
import { LoaderCircle } from "lucide-react";

import TextLink from "../../components/text-link";
import { Button } from "../../components/ui/button";
import AuthLayout from "../../layouts/auth-layout";

export default function VerifyEmail({ status }: { status?: string }) {
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const submit: FormEventHandler = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setMessage(null);

    try {
      const res = await fetch("/api/verify-email/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setMessage("A new verification link has been sent to your email.");
      } else {
        const data = await res.json();
        setMessage(data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("Error sending verification email:", err);
      setMessage("An unexpected error occurred.");
    } finally {
      setProcessing(false);
    }
  };

  const logout = async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <AuthLayout
      title="Verify email"
      description="Please verify your email address by clicking on the link we just emailed to you."
    >
      <Head>
        <title>Email verification</title>
      </Head>

      {status === "verification-link-sent" && (
        <div className="mb-4 text-center text-sm font-medium text-green-600">
          A new verification link has been sent to the email address you
          provided during registration.
        </div>
      )}

      {message && (
        <div className="mb-4 text-center text-sm font-medium text-green-600">
          {message}
        </div>
      )}

      <form onSubmit={submit} className="space-y-6 text-center">
        <Button disabled={processing} variant="secondary">
          {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
          Resend verification email
        </Button>

        <button
          type="button"
          onClick={logout}
          className="mx-auto block text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Log out
        </button>
      </form>
    </AuthLayout>
  );
}
