"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getStoredUser } from "@/lib/auth";
import {
  getMe,
  getMembershipPackages,
  getConsultations,
  getUserPayments,
  initiatePayment,
  simulatePayment,
  MembershipPackage,
  ApiError,
} from "@/lib/api";

export function PackagesView() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user] = useState<ReturnType<typeof getStoredUser>>(() => getStoredUser());

  const [packages, setPackages] = useState<MembershipPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<MembershipPackage | null>(null);
  const [phone, setPhone] = useState("");
  const [canBuy, setCanBuy] = useState(true);
  const [activePlanName, setActivePlanName] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [waitingPayment, setWaitingPayment] = useState(false);
  const [paymentModal, setPaymentModal] = useState<"success" | "failed" | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    setPhone(user.phone ?? "");

    getMembershipPackages()
      .then((p) => {
        setPackages(p);
        if (p.length > 0) setSelectedPackage(p[0]);
      })
      .catch(() => setError("Could not load membership packages."));

    getMe()
      .then(async (me) => {
        if (me.membership?.status === "ACTIVE") {
          const expired = me.membership.expiresAt && new Date(me.membership.expiresAt) < new Date();
          if (expired) {
            setCanBuy(true);
            return;
          }
          // Check if tickets are exhausted (for limited packages)
          if (me.membership.package?.ticketLimit !== null && me.membership.package?.ticketLimit !== undefined) {
            try {
              const list = await getConsultations();
              const usedSince = list.filter(
                (c) => new Date(c.createdAt) >= new Date(me.membership!.updatedAt)
              ).length;
              if (usedSince >= (me.membership.package!.ticketLimit as number)) {
                setCanBuy(true);
                return;
              }
            } catch {
              // ignore
            }
          }
          // Still active with tickets remaining (or unlimited)
          setCanBuy(false);
          setActivePlanName(me.membership.package?.name ?? "your plan");
        }
      })
      .catch(() => {});
  }, [mounted, user, router]);

  useEffect(
    () => () => {
      stopPolling();
    },
    []
  );

  if (!mounted || !user) {
    return null;
  }

  function stopPolling() {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }

  function startPolling() {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const [me, payments] = await Promise.all([getMe(), getUserPayments()]);
        if (me.membership?.status === "ACTIVE") {
          stopPolling();
          setPaymentModal("success");
          setCanBuy(false);
          return;
        }
        const latest = payments[0];
        if (latest?.status === "SUCCESS") {
          stopPolling();
          setPaymentModal("success");
          setCanBuy(false);
        } else if (latest?.status === "FAILED") {
          stopPolling();
          setWaitingPayment(false);
          setPaymentModal("failed");
        }
      } catch {
        // keep polling
      }
    }, 5000);
  }

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedPackage) {
      setError("Please select a membership package.");
      return;
    }
    if (!phone.trim()) {
      setError("Please enter your M-Pesa phone number.");
      return;
    }
    setPaying(true);
    setError("");
    setNotice("");
    try {
      const res = await initiatePayment(phone.trim(), selectedPackage.id);
      setWaitingPayment(true);
      setNotice(
        `M-Pesa payment of ${res.amount.toLocaleString()} initiated. Check your phone and enter your M-Pesa PIN to complete.`
      );
      startPolling();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not initiate payment. Please try again."
      );
    } finally {
      setPaying(false);
    }
  }

  async function handleSimulate() {
    if (!selectedPackage) return;
    setError("");
    try {
      await simulatePayment(selectedPackage.id);
      setPaymentModal("success");
      setWaitingPayment(false);
      stopPolling();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Simulation failed");
    }
  }

  const formatPrice = (price: number, currency: string) =>
    `${currency === "KES" ? "KSh" : currency} ${price.toLocaleString()}`;

  return (
    <section className="bg-linen pb-24 pt-28 md:pt-36">
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-girl">
            Choose your plan
          </p>
          <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-boy md:text-5xl">
            Select a membership package
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-mist">
            Welcome, {user.name.split(" ")[0]}. Pick the option that fits your needs.
          </p>
        </div>

        {!canBuy ? (
          <div className="mx-auto mt-12 max-w-xl rounded-2xl border border-boy/10 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-4 font-display text-2xl font-semibold text-boy">
              Your plan is still active
            </h2>
            <p className="mt-2 text-sm text-slate-mist">
              {activePlanName ? `You are on the ${activePlanName} plan.` : "You already have an active membership."} You can buy a new plan after your tickets are used or your membership expires.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="mt-6 h-12 w-full rounded-full bg-boy text-sm font-semibold text-white transition-colors hover:bg-boy-deep"
            >
              Go to dashboard
            </button>
          </div>
        ) : (
        <>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {packages.map((pkg) => {
            const selected = selectedPackage?.id === pkg.id;
            const unlimited = pkg.ticketLimit === null;
            const hasExpiry = pkg.durationMonths !== null;
            return (
              <button
                key={pkg.id}
                type="button"
                onClick={() => setSelectedPackage(pkg)}
                className={`rounded-2xl border p-8 text-left shadow-sm transition-all ${
                  selected
                    ? "border-girl bg-white shadow-girl/10 shadow-xl ring-1 ring-girl"
                    : "border-boy/10 bg-white hover:border-girl/50"
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-girl">
                  {pkg.name}
                </p>
                <p className="mt-4 font-display text-4xl font-semibold text-boy">
                  {formatPrice(pkg.price, pkg.currency)}
                </p>
                <ul className="mt-6 space-y-3">
                  {pkg.ticketLimit !== null && (
                    <li className="flex items-center gap-3 text-sm text-ink">
                      <Tick />
                      {pkg.ticketLimit} consultation ticket{pkg.ticketLimit === 1 ? "" : "s"}
                    </li>
                  )}
                  {pkg.ticketLimit === null && (
                    <li className="flex items-center gap-3 text-sm text-ink">
                      <Tick />
                      Unlimited consultation tickets
                    </li>
                  )}
                  {pkg.durationMonths !== null && (
                    <li className="flex items-center gap-3 text-sm text-ink">
                      <Tick />
                      {pkg.durationMonths} month{pkg.durationMonths === 1 ? "" : "s"} validity
                    </li>
                  )}
                  <li className="flex items-center gap-3 text-sm text-ink">
                    <Tick />
                    Personalised guidance
                  </li>
                </ul>
              </button>
            );
          })}
        </div>

        <form onSubmit={handlePay} className="mx-auto mt-10 max-w-xl space-y-4">
          <div>
            <label
              htmlFor="mpesa-phone"
              className="mb-1.5 block text-sm font-medium text-ink"
            >
              M-Pesa phone number
            </label>
            <input
              id="mpesa-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 0713 759 269"
              inputMode="tel"
              disabled={waitingPayment}
              className="h-12 w-full rounded-xl border border-boy/15 bg-white px-4 text-sm text-ink outline-none transition-colors focus:border-girl focus:ring-2 focus:ring-girl/20 disabled:opacity-60"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </p>
          )}
          {notice && (
            <p className="rounded-lg bg-girl/10 px-4 py-3 text-sm font-medium text-boy">
              {notice}
            </p>
          )}

          {waitingPayment && process.env.NODE_ENV === "production" && (
            <p className="rounded-lg bg-yellow-50 px-4 py-3 text-sm font-medium text-yellow-700">
              Payment pending. Please complete the M-Pesa prompt on your phone. If you cancel, refresh the page to try again.
            </p>
          )}

          {waitingPayment && process.env.NODE_ENV !== "production" && (
            <button
              type="button"
              onClick={handleSimulate}
              className="h-12 w-full rounded-full border border-boy/30 bg-white text-sm font-semibold text-boy transition-colors hover:bg-linen"
            >
              Simulate M-Pesa approval (dev only)
            </button>
          )}

          <button
            type="submit"
            disabled={paying || waitingPayment || !selectedPackage}
            className="h-12 w-full rounded-full bg-girl text-sm font-semibold text-white transition-colors hover:bg-[#9555c9] disabled:opacity-60"
          >
            {waitingPayment
              ? "Waiting for M-Pesa confirmation…"
              : paying
                ? "Initiating payment…"
                : selectedPackage
                  ? `Pay ${formatPrice(selectedPackage.price, selectedPackage.currency)} with M-Pesa`
                  : "Select a package"}
          </button>
        </form>
        </>
        )}
      </div>

      {paymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-boy/50 px-5 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-boy/10 bg-white p-8 shadow-xl">
            {paymentModal === "success" ? (
              <>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="mt-4 text-center font-display text-2xl font-semibold text-boy">
                  Payment successful!
                </h2>
                <p className="mt-2 text-center text-sm text-slate-mist">
                  Your membership is now active. You can now create your consultation ticket.
                </p>
                <button
                  onClick={() => router.push("/plan")}
                  className="mt-6 h-12 w-full rounded-full bg-boy text-sm font-semibold text-white transition-colors hover:bg-boy-deep"
                >
                  Start consultation
                </button>
              </>
            ) : (
              <>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="mt-4 text-center font-display text-2xl font-semibold text-boy">
                  Payment failed
                </h2>
                <p className="mt-2 text-center text-sm text-slate-mist">
                  We couldn&apos;t confirm your payment. Please try again or use a different number.
                </p>
                <button
                  onClick={() => {
                    setPaymentModal(null);
                    setPhone("");
                    setNotice("");
                  }}
                  className="mt-6 h-12 w-full rounded-full bg-boy text-sm font-semibold text-white transition-colors hover:bg-boy-deep"
                >
                  Try again
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

function Tick() {
  return (
    <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-girl/15">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#A768D5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    </span>
  );
}
