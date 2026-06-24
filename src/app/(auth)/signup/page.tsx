"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, BookUser } from "lucide-react";
import { toast } from "sonner";
import { AuthForm, type AuthFormValues } from "@/components/auth-form";
import { useAuth } from "@/components/auth-provider";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const handleSubmit = async (values: AuthFormValues) => {
    try {
      await signup(values);

      void fetch("/api/welcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email }),
      });

      toast.success("Account created");
      router.replace("/contacts");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to create account",
      );
    }
  };

  return (
    <div className="glass noise rounded-3xl border border-white/10 p-7 sm:p-9">
      <div className="mb-8 lg:hidden">
        <div className="mb-6 grid size-11 place-items-center rounded-xl border border-white/10 bg-white/6">
          <BookUser className="size-5" />
        </div>
      </div>

      <p className="text-sm font-medium text-primary">Start fresh</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight">
        Create your account
      </h2>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        One account, one private contact space.
      </p>

      <AuthForm
        className="mt-8"
        submitLabel="Create account"
        onSubmit={handleSubmit}
      />

      <p className="mt-7 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="inline-flex items-center gap-1 font-medium text-foreground hover:text-primary"
        >
          Sign in
          <ArrowRight className="size-3.5" />
        </Link>
      </p>
    </div>
  );
}
