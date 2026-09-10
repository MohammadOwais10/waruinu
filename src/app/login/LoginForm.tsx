"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { setStoredUser } from "@/lib/auth";
import { login, sendEmailVerification, verifyEmail, setToken, ApiError } from "@/lib/api";

export function LoginForm() {
  const router = useRouter();
  const [step, setStep] = useState<"credentials" | "verify-email">("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyOtp, setVerifyOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  useEffect(() => {
    if (step !== "verify-email" || resendTimer <= 0) return;
    const t = setInterval(() => setResendTimer((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [step, resendTimer]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password to continue.");
      return;
    }
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const data = await login({ email: email.trim(), password });
      setToken(data.token);
      setStoredUser({
        id: data.id,
        name: data.name ?? email.split("@")[0],
        phone: data.phone ?? "",
        email: data.email,
        role: data.role,
        createdAt: new Date().toISOString(),
      });
      router.push(data.role === "ADMIN" ? "/admin" : "/dashboard");
    } catch (err) {
      if (err instanceof ApiError && err.status === 403 && err.message.toLowerCase().includes("not verified")) {
        setMessage("Your email is not verified. Let's verify it now.");
        setStep("verify-email");
        await handleSendEmailVerification();
        return;
      }
      setError(err instanceof ApiError ? err.message : "Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSendEmailVerification() {
    setLoading(true);
    setError("");
    try {
      const res = await sendEmailVerification({ email: email.trim() });
      setMessage(res.message);
      setResendTimer(60);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not send verification code.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyEmail(e: React.FormEvent) {
    e.preventDefault();
    if (verifyOtp.length !== 6) {
      setError("Please enter the 6-digit code.");
      return;
    }
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await verifyEmail({ email: email.trim(), code: verifyOtp });
      setMessage(res.message + " You can now log in.");
      setStep("credentials");
      setVerifyOtp("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not verify email.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-girl">
        Welcome back
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-boy">
        {step === "credentials" ? "Sign in to your plan" : "Verify your email"}
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate-mist">
        {step === "credentials"
          ? "Access your package and pick up where you left off."
          : `Your email is not verified yet. We have sent a 6-digit code to ${email}. Verify to continue.`}
      </p>

      {step === "credentials" ? (
        <form onSubmit={handleLogin} className="mt-8 space-y-5" autoComplete="on">
          <div>
            <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-ink">
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
              <label htmlFor="login-password" className="block text-sm font-medium text-ink">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-girl hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="h-12 w-full rounded-xl border border-boy/15 bg-white px-4 pr-12 text-sm text-ink outline-none transition-colors focus:border-girl focus:ring-2 focus:ring-girl/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-mist hover:text-boy"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-full bg-boy text-sm font-semibold text-white transition-all hover:bg-boy-deep disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyEmail} className="mt-8 space-y-5">
          <div>
            <label htmlFor="verify-email-otp" className="mb-1.5 block text-sm font-medium text-ink">
              Email verification code
            </label>
            <input
              id="verify-email-otp"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={verifyOtp}
              onChange={(e) => setVerifyOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className="h-12 w-full rounded-xl border border-boy/15 bg-white px-4 text-center text-sm tracking-[0.3em] text-ink outline-none transition-colors focus:border-girl focus:ring-2 focus:ring-girl/20"
            />
          </div>

          {message && (
            <p className="rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              {message}
            </p>
          )}
          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || verifyOtp.length !== 6}
            className="h-12 w-full rounded-full bg-girl text-sm font-semibold text-white transition-all hover:bg-[#9555c9] disabled:opacity-60"
          >
            {loading ? "Verifying…" : "Verify email"}
          </button>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep("credentials")}
              className="text-xs font-semibold text-slate-mist hover:text-boy"
            >
              Back to login
            </button>
            <button
              type="button"
              onClick={handleSendEmailVerification}
              disabled={loading || resendTimer > 0}
              className="text-xs font-semibold text-girl hover:underline disabled:opacity-60"
            >
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend code"}
            </button>
          </div>
        </form>
      )}

      <p className="mt-8 border-t border-boy/10 pt-6 text-center text-sm text-slate-mist">
        New to Dagitari Waruinu?{" "}
        <Link href="/signup" className="font-semibold text-girl hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
