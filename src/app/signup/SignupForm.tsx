"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { setStoredUser } from "@/lib/auth";

export function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields to create your account.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Your password must be at least 6 characters.");
      return;
    }
    setStoredUser({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      password: password,
      createdAt: new Date().toISOString(),
    });
    router.push("/packages");
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-girl">
        Get started
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-boy">
        Create your account
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate-mist">
        Join Waruinu to choose a plan and begin your personalised journey.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5"
        autoComplete="on"
      >
        <div>
          <label
            htmlFor="signup-name"
            className="mb-1.5 block text-sm font-medium text-ink"
          >
            Full name
          </label>
          <input
            id="signup-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Jane & Mark"
            autoComplete="name"
            className="h-12 w-full rounded-xl border border-boy/15 bg-white px-4 text-sm text-ink outline-none transition-colors focus:border-girl focus:ring-2 focus:ring-girl/20"
          />
        </div>

        <div>
          <label
            htmlFor="signup-phone"
            className="mb-1.5 block text-sm font-medium text-ink"
          >
            Mobile number
          </label>
          <input
            id="signup-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 0713 759 269"
            autoComplete="tel"
            inputMode="tel"
            className="h-12 w-full rounded-xl border border-boy/15 bg-white px-4 text-sm text-ink outline-none transition-colors focus:border-girl focus:ring-2 focus:ring-girl/20"
          />
        </div>

        <div>
          <label
            htmlFor="signup-email"
            className="mb-1.5 block text-sm font-medium text-ink"
          >
            Email address
          </label>
          <input
            id="signup-email"
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
          <label
            htmlFor="signup-password"
            className="mb-1.5 block text-sm font-medium text-ink"
          >
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            autoComplete="new-password"
            className="h-12 w-full rounded-xl border border-boy/15 bg-white px-4 text-sm text-ink outline-none transition-colors focus:border-girl focus:ring-2 focus:ring-girl/20"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="h-12 w-full rounded-full bg-girl text-sm font-semibold text-white transition-all hover:bg-[#9555c9]"
        >
          Create account
        </button>

        <p className="text-center text-xs leading-5 text-slate-mist">
          By continuing you agree to keep your details private. This demo
          stores your session in your browser only.
        </p>
      </form>

      <p className="mt-8 border-t border-boy/10 pt-6 text-center text-sm text-slate-mist">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-girl hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}