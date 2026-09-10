"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { forgotPassword, resetPassword, ApiError } from "@/lib/api";

export function ForgotPasswordView() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (step !== "reset" || resendTimer <= 0) return;
    const t = setInterval(() => setResendTimer((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [step, resendTimer]);

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await forgotPassword({ email: email.trim() });
      setMessage(res.message);
      setStep("reset");
      setResendTimer(60);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not send reset code.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setLoading(true);
    setError("");
    try {
      const res = await forgotPassword({ email: email.trim() });
      setMessage(res.message);
      setResendTimer(60);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not resend the code.");
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    if (code.length !== 6) {
      setError("Please enter the 6-digit code.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await resetPassword({
        email: email.trim(),
        code,
        newPassword,
      });
      setMessage(res.message);
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not reset password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-girl">
        Account recovery
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-boy">
        {step === "email" ? "Forgot password" : "Reset password"}
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate-mist">
        {step === "email"
          ? "Enter your email and we will send you a verification code to reset your password."
          : `We have sent a 6-digit code to ${email}. Enter it below with your new password.`}
      </p>

      {step === "email" ? (
        <form onSubmit={handleSendOtp} className="mt-8 space-y-5">
          <div>
            <label htmlFor="forgot-email" className="mb-1.5 block text-sm font-medium text-ink">
              Email address
            </label>
            <input
              id="forgot-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              inputMode="email"
              className="h-12 w-full rounded-xl border border-boy/15 bg-white px-4 text-sm text-ink outline-none transition-colors focus:border-girl focus:ring-2 focus:ring-girl/20"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </p>
          )}
          {message && (
            <p className="rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-full bg-girl text-sm font-semibold text-white transition-all hover:bg-[#9555c9] disabled:opacity-60"
          >
            {loading ? "Sending code…" : "Send reset code"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleReset} className="mt-8 space-y-5">
          <div>
            <label htmlFor="reset-code" className="mb-1.5 block text-sm font-medium text-ink">
              Verification code
            </label>
            <input
              id="reset-code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className="h-12 w-full rounded-xl border border-boy/15 bg-white px-4 text-center text-sm tracking-[0.3em] text-ink outline-none transition-colors focus:border-girl focus:ring-2 focus:ring-girl/20"
            />
          </div>

          <div>
            <label htmlFor="reset-password" className="mb-1.5 block text-sm font-medium text-ink">
              New password
            </label>
            <div className="relative">
              <input
                id="reset-password"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                autoComplete="new-password"
                className="h-12 w-full rounded-xl border border-boy/15 bg-white px-4 pr-12 text-sm text-ink outline-none transition-colors focus:border-girl focus:ring-2 focus:ring-girl/20"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-mist hover:text-boy"
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="reset-confirm" className="mb-1.5 block text-sm font-medium text-ink">
              Confirm new password
            </label>
            <div className="relative">
              <input
                id="reset-confirm"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                autoComplete="new-password"
                className="h-12 w-full rounded-xl border border-boy/15 bg-white px-4 pr-12 text-sm text-ink outline-none transition-colors focus:border-girl focus:ring-2 focus:ring-girl/20"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-mist hover:text-boy"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
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
          {message && (
            <p className="rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || code.length !== 6 || !newPassword || !confirmPassword}
            className="h-12 w-full rounded-full bg-girl text-sm font-semibold text-white transition-all hover:bg-[#9555c9] disabled:opacity-60"
          >
            {loading ? "Resetting…" : "Reset password"}
          </button>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep("email")}
              className="text-xs font-semibold text-slate-mist hover:text-boy"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={loading || resendTimer > 0}
              className="text-xs font-semibold text-girl hover:underline disabled:opacity-60"
            >
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend code"}
            </button>
          </div>
        </form>
      )}

      <p className="mt-8 border-t border-boy/10 pt-6 text-center text-sm text-slate-mist">
        Remembered your password?{" "}
        <Link href="/login" className="font-semibold text-girl hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
