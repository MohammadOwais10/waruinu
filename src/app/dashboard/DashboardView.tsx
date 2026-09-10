"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { getStoredUser, clearStoredUser } from "@/lib/auth";
import {
  Consultation,
  ConsultationSummary,
  Payment,
  getMe,
  getConsultations,
  getConsultation,
  getUserPayments,
  createConsultationMessage,
  ApiError,
  MeProfile,
} from "@/lib/api";

type Section = "dashboard" | "plan" | "tickets" | "payments" | "account";

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
  );
}

function CardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function PageControls({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
  if (totalPages <= 1) return null;
  return (
    <div className="mt-4 flex items-center justify-between">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="h-10 rounded-full border border-boy/15 px-4 text-sm font-semibold text-boy transition-colors hover:bg-linen disabled:opacity-50"
      >
        Previous
      </button>
      <span className="text-sm text-slate-mist">
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="h-10 rounded-full border border-boy/15 px-4 text-sm font-semibold text-boy transition-colors hover:bg-linen disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}

const PAYMENT_PAGE_SIZE = 5;
const TICKET_PAGE_SIZE = 5;

export function DashboardView() {
  const router = useRouter();
  const [section, setSection] = useState<Section>("dashboard");
  const [profile, setProfile] = useState<MeProfile | null>(null);
  const [consultations, setConsultations] = useState<ConsultationSummary[]>([]);
  const [activeConsultation, setActiveConsultation] = useState<Consultation | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentPage, setPaymentPage] = useState(1);
  const [ticketPage, setTicketPage] = useState(1);
  const [newMessage, setNewMessage] = useState("");

  const totalPaymentPages = Math.max(1, Math.ceil(payments.length / PAYMENT_PAGE_SIZE));
  const currentPaymentPage = Math.min(paymentPage, totalPaymentPages);
  const paginatedPayments = useMemo(
    () => payments.slice((currentPaymentPage - 1) * PAYMENT_PAGE_SIZE, currentPaymentPage * PAYMENT_PAGE_SIZE),
    [payments, currentPaymentPage]
  );

  const totalTicketPages = Math.max(1, Math.ceil(consultations.length / TICKET_PAGE_SIZE));
  const currentTicketPage = Math.min(ticketPage, totalTicketPages);
  const paginatedTickets = useMemo(
    () => consultations.slice((currentTicketPage - 1) * TICKET_PAGE_SIZE, currentTicketPage * TICKET_PAGE_SIZE),
    [consultations, currentTicketPage]
  );

  const ticketsUsed = useMemo(() => {
    if (!profile?.membership?.updatedAt) return consultations.length;
    const updatedAt = new Date(profile.membership.updatedAt).getTime();
    return consultations.filter((c) => new Date(c.createdAt).getTime() >= updatedAt).length;
  }, [consultations, profile?.membership?.updatedAt]);

  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  const hasOpenTicket = consultations.some((c) => c.status !== "CLOSED");
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const user = getStoredUser();

  async function loadDashboard() {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const [p, c, pay] = await Promise.all([
        getMe(),
        getConsultations(),
        getUserPayments(),
      ]);
      setProfile(p);
      setConsultations(c);
      setPayments(pay);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        clearStoredUser();
        router.replace("/login");
        return;
      }
      setError(err instanceof ApiError ? err.message : "Could not load dashboard.");
    } finally {
      setLoading(false);
    }
  }

  async function loadActiveConsultation() {
    if (!user || consultations.length === 0) return;
    setError("");
    try {
      const full = await getConsultation(consultations[0].id);
      setActiveConsultation(full);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load ticket.");
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    if (!activeConsultation) return;
    const interval = setInterval(() => {
      getConsultation(activeConsultation.id)
        .then(setActiveConsultation)
        .catch(() => {});
    }, 5000);
    return () => clearInterval(interval);
  }, [activeConsultation?.id]);

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!activeConsultation || !newMessage.trim()) return;
    setSending(true);
    try {
      await createConsultationMessage(activeConsultation.id, newMessage.trim());
      const full = await getConsultation(activeConsultation.id);
      setActiveConsultation(full);
      setNewMessage("");
      loadDashboard();
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not send message.");
    } finally {
      setSending(false);
    }
  }

  function logout() {
    clearStoredUser();
    window.location.href = "/login";
  }

  const navItem = (key: Section, label: string, icon: React.ReactNode) => (
    <button
      key={key}
      onClick={() => setSection(key)}
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition-colors ${
        section === key
          ? "bg-boy text-white"
          : "text-slate-mist hover:bg-linen hover:text-ink"
      }`}
    >
      {icon}
      {label}
    </button>
  );

  if (loading) {
    return (
      <section className="min-h-screen bg-linen pb-24 pt-28 md:pt-36">
        <div className="mx-auto max-w-6xl px-5 text-center text-sm text-slate-mist">
          Loading dashboard…
        </div>
      </section>
    );
  }

  if (error || !profile) {
    return (
      <section className="min-h-screen bg-linen pb-24 pt-28 md:pt-36">
        <div className="mx-auto max-w-6xl px-5 text-center">
          <p className="text-sm text-red-600">{error || "Not logged in."}</p>
          <Link href="/login" className="mt-4 inline-block text-sm font-semibold text-boy">
            Go to login
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-linen pb-8 pt-28 md:pt-36">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 md:flex-row md:px-8">
        {/* Sidebar */}
        <aside className="w-full shrink-0 md:w-64">
          <div className="rounded-2xl border border-boy/10 bg-white p-4 shadow-sm">
            <p className="mb-4 px-4 text-xs font-semibold uppercase tracking-[0.2em] text-girl">
              Menu
            </p>
            <div className="space-y-2">
              {navItem("dashboard", "Dashboard", <HomeIcon className="h-5 w-5" />)}
              {navItem("plan", "My Plan", <CardIcon className="h-5 w-5" />)}
              {navItem("tickets", "Tickets", <ChatIcon className="h-5 w-5" />)}
              {navItem("payments", "Payments", <CardIcon className="h-5 w-5" />)}
              {navItem("account", "Account", <UserIcon className="h-5 w-5" />)}
            </div>
            <button
              onClick={logout}
              className="mt-6 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Log out
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="w-full flex-1">
          {section === "dashboard" && (
            <div className="space-y-8">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-girl">
                  Dashboard
                </p>
                <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-boy">
                  Hello, {profile.name ?? profile.email}
                </h1>
              </div>

              <div className="rounded-2xl border border-boy/10 bg-white p-6 shadow-sm">
                <h2 className="font-display text-xl font-semibold text-boy">
                  Membership
                </h2>
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <span className="text-sm text-slate-mist">Status:</span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      profile.membership?.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {profile.membership?.status === "ACTIVE" ? "Active" : "Inactive"}
                  </span>
                </div>

                {profile.membership?.status === "ACTIVE" && profile.membership.package && (
                  <div className="mt-4 grid gap-2 text-sm">
                    <p><span className="text-slate-mist">Plan:</span> <span className="font-medium text-ink">{profile.membership.package.name}</span></p>
                    {profile.membership.package.ticketLimit !== null && (
                      <p>
                        <span className="text-slate-mist">Tickets remaining:</span>{" "}
                        <span className="font-medium text-ink">
                          {Math.max(0, profile.membership.package.ticketLimit - ticketsUsed)} of {profile.membership.package.ticketLimit}
                        </span>
                      </p>
                    )}
                    {profile.membership.package.ticketLimit === null && (
                      <p><span className="text-slate-mist">Tickets:</span> <span className="font-medium text-ink">Unlimited</span></p>
                    )}
                    {profile.membership.expiresAt && (
                      <p><span className="text-slate-mist">Expires:</span> <span className="font-medium text-ink">{new Date(profile.membership.expiresAt).toLocaleDateString()}</span></p>
                    )}
                  </div>
                )}

                <div className="mt-4">
                  {profile.membership?.status !== "ACTIVE" ? (
                    <Link
                      href="/packages"
                      className="inline-block h-10 rounded-full bg-girl px-5 text-sm font-semibold leading-10 text-white transition-colors hover:bg-[#9555c9]"
                    >
                      Activate membership
                    </Link>
                  ) : (() => {
                    const expired = profile.membership.expiresAt && new Date(profile.membership.expiresAt) < new Date();
                    const exhausted = profile.membership.package?.ticketLimit !== null && profile.membership.package?.ticketLimit !== undefined
                      && ticketsUsed >= profile.membership.package.ticketLimit;
                    if (expired || exhausted) {
                      return (
                        <Link
                          href="/packages"
                          className="inline-block h-10 rounded-full bg-girl px-5 text-sm font-semibold leading-10 text-white transition-colors hover:bg-[#9555c9]"
                        >
                          {expired ? "Renew plan" : "Buy new plan"}
                        </Link>
                      );
                    }
                    return (
                      <button
                        onClick={() => setSection("plan")}
                        className="h-10 rounded-full bg-boy px-5 text-sm font-semibold leading-10 text-white transition-colors hover:bg-boy-deep"
                      >
                        Open my plan
                      </button>
                    );
                  })()}
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-boy/10 bg-white p-6 shadow-sm">
                  <h2 className="font-display text-xl font-semibold text-boy">
                    Recent payments
                  </h2>
                  {payments.length === 0 ? (
                    <p className="mt-4 text-sm text-slate-mist">No payments yet.</p>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {payments.slice(0, 3).map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between rounded-xl border border-boy/10 p-3"
                        >
                          <div>
                            <p className="text-sm font-medium text-ink">
                              {p.currency} {p.amount.toLocaleString()}
                            </p>
                            <p className="text-xs text-slate-mist">
                              {new Date(p.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              p.status === "SUCCESS"
                                ? "bg-green-100 text-green-700"
                                : p.status === "FAILED"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {p.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-boy/10 bg-white p-6 shadow-sm">
                  <h2 className="font-display text-xl font-semibold text-boy">
                    My consultations
                  </h2>
                  {consultations.length === 0 ? (
                    <p className="mt-4 text-sm text-slate-mist">No consultations yet.</p>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {consultations.slice(0, 3).map((c) => (
                        <button
                          key={c.id}
                          onClick={() => setSection("plan")}
                          className="w-full rounded-xl border border-boy/10 p-3 text-left transition-colors hover:bg-linen"
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-ink">
                              {c.motherName} — {c.desiredGender}
                            </p>
                            <span className="rounded-full px-2.5 py-1 text-xs font-semibold bg-linen text-boy">
                              {c.status}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-slate-mist">
                            {new Date(c.createdAt).toLocaleDateString()}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {section === "plan" && (
            <div className="space-y-6">
              <h1 className="font-display text-3xl font-semibold tracking-tight text-boy">
                My Plan
              </h1>

              {/* Membership / plan details */}
              <div className="rounded-2xl border border-boy/10 bg-white p-6 shadow-sm">
                <h2 className="font-display text-xl font-semibold text-boy">
                  Membership
                </h2>
                {profile.membership?.status !== "ACTIVE" ? (
                  <div className="mt-3">
                    <p className="text-sm text-slate-mist">
                      Your membership is not active. Activate it to create a consultation ticket.
                    </p>
                    <Link
                      href="/packages"
                      className="mt-4 inline-block h-10 rounded-full bg-girl px-5 text-sm font-semibold leading-10 text-white transition-colors hover:bg-[#9555c9]"
                    >
                      Activate membership
                    </Link>
                  </div>
                ) : (
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl bg-linen p-4">
                      <p className="text-xs text-slate-mist">Plan</p>
                      <p className="mt-1 font-display text-lg font-semibold text-boy">{profile.membership.package?.name ?? "Membership"}</p>
                    </div>
                    <div className="rounded-xl bg-linen p-4">
                      <p className="text-xs text-slate-mist">Price</p>
                      <p className="mt-1 font-display text-lg font-semibold text-boy">
                        {profile.membership.package?.currency ?? "KES"} {profile.membership.package?.price?.toLocaleString() ?? "--"}
                      </p>
                    </div>
                    <div className="rounded-xl bg-linen p-4">
                      <p className="text-xs text-slate-mist">Status</p>
                      <p className="mt-1 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">Active</p>
                    </div>
                    {profile.membership.expiresAt ? (
                      <div className="rounded-xl bg-linen p-4">
                        <p className="text-xs text-slate-mist">Valid until</p>
                        <p className="mt-1 font-display text-lg font-semibold text-boy">{new Date(profile.membership.expiresAt).toLocaleDateString()}</p>
                      </div>
                    ) : (
                      <div className="rounded-xl bg-linen p-4">
                        <p className="text-xs text-slate-mist">Validity</p>
                        <p className="mt-1 font-display text-lg font-semibold text-boy">No expiry</p>
                      </div>
                    )}
                    {profile.membership.package?.ticketLimit !== null && profile.membership.package?.ticketLimit !== undefined && (
                      <div className="rounded-xl bg-linen p-4 sm:col-span-2">
                        <p className="text-xs text-slate-mist">Tickets</p>
                        <p className="mt-1 text-sm text-ink">
                          {ticketsUsed} of {profile.membership.package.ticketLimit} used
                          {(() => {
                            const remaining = profile.membership.package.ticketLimit - ticketsUsed;
                            return remaining > 0 ? (
                              <span className="ml-2 text-xs text-green-700">({remaining} remaining)</span>
                            ) : (
                              <span className="ml-2 text-xs text-red-600">(all used)</span>
                            );
                          })()}
                        </p>
                        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white">
                          <div
                            className="h-full rounded-full bg-boy transition-all"
                            style={{ width: `${Math.min(100, (ticketsUsed / profile.membership.package.ticketLimit) * 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                    {profile.membership.package?.ticketLimit === null && (
                      <div className="rounded-xl bg-linen p-4 sm:col-span-2">
                        <p className="text-xs text-slate-mist">Tickets</p>
                        <p className="mt-1 font-display text-lg font-semibold text-boy">Unlimited</p>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-3 pt-2 sm:col-span-2">
                      {hasOpenTicket ? (
                        <p className="h-10 rounded-full border border-yellow-200 bg-yellow-50 px-5 text-sm font-semibold leading-10 text-yellow-700">
                          Close your active ticket to create a new one
                        </p>
                      ) : profile.membership.package?.ticketLimit === null || profile.membership.package?.ticketLimit === undefined || ticketsUsed < profile.membership.package.ticketLimit ? (
                        <Link
                          href="/plan"
                          className="h-10 rounded-full bg-boy px-5 text-sm font-semibold leading-10 text-white transition-colors hover:bg-boy-deep"
                        >
                          + Create new ticket
                        </Link>
                      ) : (
                        <Link
                          href="/packages"
                          className="h-10 rounded-full bg-girl px-5 text-sm font-semibold leading-10 text-white transition-colors hover:bg-[#9555c9]"
                        >
                          Buy new plan
                        </Link>
                      )}
                      <button
                        onClick={() => setSection("tickets")}
                        className="h-10 rounded-full border border-boy/20 px-5 text-sm font-semibold leading-10 text-boy transition-colors hover:bg-linen"
                      >
                        View all tickets
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {section === "tickets" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-girl">
                    Tickets
                  </p>
                  <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-boy">
                    My Tickets
                  </h1>
                </div>
                {profile.membership?.status === "ACTIVE" && (
                  hasOpenTicket ? (
                    <span className="rounded-full border border-yellow-200 bg-yellow-50 px-4 py-2 text-xs font-semibold text-yellow-700">
                      Close your active ticket to create a new one
                    </span>
                  ) : (
                    <Link
                      href="/plan"
                      className="h-10 rounded-full bg-boy px-5 text-sm font-semibold leading-10 text-white transition-colors hover:bg-boy-deep"
                    >
                      + Create new ticket
                    </Link>
                  )
                )}
              </div>

              {consultations.length === 0 ? (
                <div className="rounded-2xl border border-boy/10 bg-white p-8 text-center shadow-sm">
                  <p className="text-sm text-slate-mist">
                    {profile.membership?.status === "ACTIVE"
                      ? "You have not created any tickets yet."
                      : "Activate your membership to create a ticket."}
                  </p>
                  {profile.membership?.status !== "ACTIVE" && (
                    <Link
                      href="/packages"
                      className="mt-4 inline-block h-10 rounded-full bg-girl px-5 text-sm font-semibold leading-10 text-white transition-colors hover:bg-[#9555c9]"
                    >
                      Activate membership
                    </Link>
                  )}
                </div>
              ) : (
                <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
                  {/* Ticket list */}
                  <div className="space-y-3">
                    <div className="space-y-3">
                      {paginatedTickets.map((c) => {
                        const isActive = activeConsultation?.id === c.id;
                        return (
                          <button
                            key={c.id}
                            onClick={async () => {
                              try {
                                const full = await getConsultation(c.id);
                                setActiveConsultation(full);
                              } catch (err) {
                                setError(err instanceof ApiError ? err.message : "Could not load ticket.");
                              }
                            }}
                            className={`w-full rounded-xl border p-4 text-left transition-colors ${
                              isActive
                                ? "border-girl bg-white shadow-sm ring-1 ring-girl"
                                : "border-boy/10 bg-white hover:bg-linen"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-ink">{c.motherName}</p>
                                <p className="mt-1 text-xs text-slate-mist">
                                  {c.desiredGender} · {new Date(c.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <span
                                className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                                  c.status === "PENDING"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : c.status === "ANSWERED"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {c.status}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Pagination */}
                    {totalTicketPages > 1 && (
                      <div className="flex items-center justify-between pt-2">
                        <button
                          onClick={() => setTicketPage((p) => Math.max(1, p - 1))}
                          disabled={currentTicketPage === 1}
                          className="h-9 rounded-full border border-boy/15 px-4 text-xs font-semibold text-boy transition-colors hover:bg-linen disabled:opacity-40"
                        >
                          Prev
                        </button>
                        <span className="text-xs text-slate-mist">
                          Page {currentTicketPage} of {totalTicketPages}
                        </span>
                        <button
                          onClick={() => setTicketPage((p) => Math.min(totalTicketPages, p + 1))}
                          disabled={currentTicketPage === totalTicketPages}
                          className="h-9 rounded-full border border-boy/15 px-4 text-xs font-semibold text-boy transition-colors hover:bg-linen disabled:opacity-40"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Chat panel */}
                  <div className="rounded-2xl border border-boy/10 bg-white p-6 shadow-sm">
                    {!activeConsultation ? (
                      <div className="flex h-full min-h-[20rem] flex-col items-center justify-center text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-linen text-boy">
                          <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path d="M8 12h8M8 8h8m-8 8h5" />
                          </svg>
                        </div>
                        <p className="mt-4 text-sm text-slate-mist">
                          Select a ticket from the list to view the conversation.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="mb-4 flex items-center justify-between border-b border-boy/10 pb-4">
                          <div>
                            <p className="font-medium text-ink">{activeConsultation.motherName}</p>
                            <p className="text-xs text-slate-mist">
                              Status: {activeConsultation.status}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="rounded-full bg-linen px-3 py-1 text-xs font-semibold text-boy">
                              {activeConsultation.desiredGender}
                            </span>
                            <button
                              onClick={() => setActiveConsultation(null)}
                              className="text-xs font-semibold text-girl hover:underline lg:hidden"
                            >
                              Close
                            </button>
                          </div>
                        </div>

                        <div className="flex h-80 flex-col md:h-[24rem]">
                          <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                            <div className="rounded-lg bg-linen p-4 text-sm text-ink">
                              <p className="font-semibold text-boy">Initial request</p>
                              <div className="mt-2 grid grid-cols-1 gap-1.5 text-xs sm:grid-cols-2">
                                <p><span className="text-slate-mist">Mother:</span> <span className="font-medium">{activeConsultation.motherName}</span></p>
                                <p><span className="text-slate-mist">Desired gender:</span> <span className="font-medium">{activeConsultation.desiredGender}</span></p>
                                <p><span className="text-slate-mist">DOB:</span> <span className="font-medium">{activeConsultation.dateOfBirthMonth}/{activeConsultation.dateOfBirthYear}</span></p>
                                <p><span className="text-slate-mist">Plan year:</span> <span className="font-medium">{activeConsultation.plannedConceptionYear}</span></p>
                                <p><span className="text-slate-mist">Regular cycle:</span> <span className="font-medium">{activeConsultation.regularMenstrualCycle ? "Yes" : "No"}</span></p>
                                <p><span className="text-slate-mist">Condition:</span> <span className="font-medium">{activeConsultation.underlyingCondition ? "Yes" : "No"}</span></p>
                                {activeConsultation.underlyingCondition && activeConsultation.underlyingConditionDetails && (
                                  <p className="sm:col-span-2"><span className="text-slate-mist">Condition details:</span> <span className="font-medium">{activeConsultation.underlyingConditionDetails}</span></p>
                                )}
                              </div>
                            </div>

                            {activeConsultation.messages.map((m) => (
                              <div
                                key={m.id}
                                className={`flex ${m.sender === "USER" ? "justify-end" : "justify-start"}`}
                              >
                                <div
                                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                                    m.sender === "USER"
                                      ? "rounded-br-none bg-boy text-white"
                                      : "rounded-bl-none border border-boy/10 bg-linen text-ink"
                                  }`}
                                >
                                  {m.message}
                                  <p className={`mt-1 text-[10px] ${m.sender === "USER" ? "text-white/70" : "text-slate-mist"}`}>
                                    {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                  </p>
                                </div>
                              </div>
                            ))}
                            <div ref={messagesEndRef} />
                          </div>

                          {activeConsultation.status !== "CLOSED" ? (
                            <form onSubmit={handleSendMessage} className="mt-4 flex gap-3 border-t border-boy/10 pt-4">
                              <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a follow-up message…"
                                disabled={sending}
                                className="h-12 flex-1 rounded-full border border-boy/15 bg-white px-4 text-sm text-ink outline-none focus:border-girl focus:ring-2 focus:ring-girl/20 disabled:opacity-60"
                              />
                              <button
                                type="submit"
                                disabled={sending || !newMessage.trim()}
                                className="h-12 rounded-full bg-boy px-6 text-sm font-semibold text-white transition-colors hover:bg-boy-deep disabled:opacity-60"
                              >
                                {sending ? "…" : "Send"}
                              </button>
                            </form>
                          ) : (
                            <p className="mt-4 border-t border-boy/10 pt-4 text-center text-sm text-slate-mist">
                              This ticket is closed.{" "}
                              <Link href="/plan" className="font-semibold text-boy hover:underline">
                                Create a new ticket
                              </Link>
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {section === "payments" && (
            <div className="space-y-6">
              <h1 className="font-display text-3xl font-semibold tracking-tight text-boy">
                Payments
              </h1>
              <div className="rounded-2xl border border-boy/10 bg-white p-6 shadow-sm">
                {payments.length === 0 ? (
                  <p className="text-sm text-slate-mist">No payments yet.</p>
                ) : (
                  <>
                    <div className="space-y-3">
                      {paginatedPayments.map((p) => (
                        <div
                          key={p.id}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-boy/10 p-4"
                        >
                          <div>
                            <p className="text-sm font-medium text-ink">
                              {p.currency} {p.amount.toLocaleString()}
                            </p>
                            <p className="text-xs text-slate-mist">
                              {new Date(p.createdAt).toLocaleDateString()} · Ref: {p.transactionReference ?? "—"}
                            </p>
                          </div>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              p.status === "SUCCESS"
                                ? "bg-green-100 text-green-700"
                                : p.status === "FAILED"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {p.status}
                          </span>
                        </div>
                      ))}
                    </div>
                    <PageControls
                      page={currentPaymentPage}
                      totalPages={totalPaymentPages}
                      onChange={setPaymentPage}
                    />
                  </>
                )}
              </div>
            </div>
          )}

          {section === "account" && (
            <div className="space-y-6">
              <h1 className="font-display text-3xl font-semibold tracking-tight text-boy">
                Account
              </h1>
              <div className="rounded-2xl border border-boy/10 bg-white p-6 shadow-sm">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-mist">
                      Name
                    </label>
                    <p className="text-lg font-medium text-ink">{profile.name ?? "—"}</p>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-mist">
                      Email
                    </label>
                    <p className="text-lg font-medium text-ink">{profile.email}</p>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-mist">
                      Phone
                    </label>
                    <p className="text-lg font-medium text-ink">{profile.phone ?? "—"}</p>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-mist">
                      Member since
                    </label>
                    <p className="text-lg font-medium text-ink">
                      {new Date(profile.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </section>
  );
}
