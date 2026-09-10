"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { setStoredUser } from "@/lib/auth";
import { register, verifyOtp, resendOtp, setToken, ApiError } from "@/lib/api";

export function SignupForm() {
  const router = useRouter();
  const [step, setStep] = useState<"details" | "otp">("details");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (step !== "otp" || resendTimer <= 0) return;
    const t = setInterval(() => setResendTimer((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [step, resendTimer]);

  async function handleSendOtp(e: React.FormEvent) {
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
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await register({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        password,
      });
      setMessage(res.message);
      setStep("otp");
      setResendTimer(60);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not send verification code.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Please enter the 6-digit code.");
      return;
    }
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const data = await verifyOtp({ email: email.trim(), code: otp });
      setToken(data.token);
      setStoredUser({
        id: data.id,
        name: data.name ?? name.trim(),
        phone: data.phone ?? phone.trim(),
        email: data.email,
        role: data.role,
        createdAt: new Date().toISOString(),
      });
      router.push(data.role === "ADMIN" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not verify the code.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setLoading(true);
    setError("");
    try {
      const res = await resendOtp({ email: email.trim() });
      setMessage(res.message);
      setResendTimer(60);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not resend the code.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-girl">
        Get started
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-boy">
        {step === "details" ? "Create your account" : "Verify your email"}
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate-mist">
        {step === "details"
          ? "Join Dagitari Waruinu to choose a plan and begin your personalised journey."
          : `We have sent a 6-digit code to ${email}. Enter it below to complete your registration.`}
      </p>

      {step === "details" ? (
        <form onSubmit={handleSendOtp} className="mt-8 space-y-5" autoComplete="on">
          <div>
            <label htmlFor="signup-name" className="mb-1.5 block text-sm font-medium text-ink">
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
            <label htmlFor="signup-phone" className="mb-1.5 block text-sm font-medium text-ink">
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
            <label htmlFor="signup-email" className="mb-1.5 block text-sm font-medium text-ink">
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
            <label htmlFor="signup-password" className="mb-1.5 block text-sm font-medium text-ink">
              Password
            </label>
            <div className="relative">
              <input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                autoComplete="new-password"
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
            className="h-12 w-full rounded-full bg-girl text-sm font-semibold text-white transition-all hover:bg-[#9555c9] disabled:opacity-60"
          >
            {loading ? "Sending code…" : "Send verification code"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="mt-8 space-y-5">
          <div>
            <label htmlFor="signup-otp" className="mb-1.5 block text-sm font-medium text-ink">
              Verification code
            </label>
            <input
              id="signup-otp"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
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
            disabled={loading || otp.length !== 6}
            className="h-12 w-full rounded-full bg-girl text-sm font-semibold text-white transition-all hover:bg-[#9555c9] disabled:opacity-60"
          >
            {loading ? "Verifying…" : "Verify and create account"}
          </button>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep("details")}
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
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-girl hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
