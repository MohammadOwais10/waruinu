"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { setStoredUser, getStoredUser } from "@/lib/auth";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password to continue.");
      return;
    }
    const existing = getStoredUser();
    if (
      existing &&
      existing.email &&
      existing.email.toLowerCase() !== email.trim().toLowerCase()
    ) {
      setError(
        "That email does not match the account on this device. Try again or create an account."
      );
      return;
    }
    setStoredUser({
      name: existing?.name ?? (email.split("@")[0] || "Family"),
      phone: existing?.phone ?? "",
      email: email.trim(),
      password: password,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    });
    router.push("/packages");
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-girl">
        Welcome back
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-boy">
        Sign in to your plan
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate-mist">
        Access your package and pick up where you left off.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5"
        autoComplete="on"
      >
        <div>
          <label
            htmlFor="login-email"
            className="mb-1.5 block text-sm font-medium text-ink"
          >
            Email address
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            inputMode="email"
            className="h-12 w-full rounded-xl border border-boy/15 bg-white px-4 text-sm text-ink outline-none transition-colors focus:border-girl focus:ring-2 focus:ring-girl/20"
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor="login-password"
              className="block text-sm font-medium text-ink"
            >
              Password
            </label>
            <button type="button" className="text-xs font-medium text-girl">
              Forgot password?
            </button>
          </div>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
            className="h-12 w-full rounded-xl border border-boy/15 bg-white px-4 text-sm text-ink outline-none transition-colors focus:border-girl focus:ring-2 focus:ring-girl/20"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </p>
        )}

        <div className="flex items-center gap-3">
          <input
            id="remember"
            type="checkbox"
            className="h-4 w-4 rounded border-boy/20 accent-girl"
          />
          <label htmlFor="remember" className="text-sm text-slate-mist">
            Keep me signed in on this device
          </label>
        </div>

        <button
          type="submit"
          className="h-12 w-full rounded-full bg-boy text-sm font-semibold text-white transition-all hover:bg-boy-deep"
        >
          Sign in
        </button>
      </form>

      <p className="mt-8 border-t border-boy/10 pt-6 text-center text-sm text-slate-mist">
        New to Waruinu?{" "}
        <Link
          href="/signup"
          className="font-semibold text-girl hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}