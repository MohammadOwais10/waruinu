"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AdminConsultation,
  AdminPayment,
  AdminUser,
  ConsultationSummary,
  MembershipPackage,
  getAdminConsultations,
  getAdminConsultation,
  getAdminDashboard,
  getAdminPackages,
  getAdminPayments,
  getAdminUsers,
  updateAdminPackage,
  replyConsultation,
  closeConsultation,
  login,
  getMe,
  getToken,
  setToken,
  clearToken,
  ApiError,
} from "@/lib/api";

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

function MessageIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles =
    status === "PENDING"
      ? "bg-yellow-100 text-yellow-700"
      : status === "ANSWERED"
        ? "bg-green-100 text-green-700"
        : "bg-slate-100 text-slate-600";
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${styles}`}>
      {status}
    </span>
  );
}

function useList<T>(items: T[], searchFn: (item: T, query: string) => boolean, pageSize = 10) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const filtered = useMemo(
    () => items.filter((item) => searchFn(item, query.toLowerCase())),
    [items, query, searchFn]
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  return { query, setQuery, page: currentPage, setPage, totalPages, paginated, total: filtered.length };
}

function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-11 w-full max-w-xs rounded-xl border border-boy/15 bg-white px-4 text-sm text-ink outline-none focus:border-girl focus:ring-2 focus:ring-girl/20 md:w-64"
    />
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

function userMatches(user: AdminUser, q: string) {
  return (
    user.email.toLowerCase().includes(q) ||
    (user.name?.toLowerCase().includes(q) ?? false) ||
    (user.phone?.includes(q) ?? false)
  );
}

function paymentMatches(payment: AdminPayment, q: string) {
  return (
    payment.user.email.toLowerCase().includes(q) ||
    (payment.transactionReference?.toLowerCase().includes(q) ?? false) ||
    payment.status.toLowerCase().includes(q)
  );
}

function ticketMatches(ticket: ConsultationSummary, q: string) {
  return (
    ticket.motherName.toLowerCase().includes(q) ||
    ticket.status.toLowerCase().includes(q) ||
    ticket.desiredGender.toLowerCase().includes(q)
  );
}

interface Dashboard {
  totalUsers: number;
  pendingConsultations: number;
  answeredConsultations: number;
  closedConsultations: number;
}

type Section = "dashboard" | "users" | "payments" | "tickets" | "packages";

export function AdminView() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [section, setSection] = useState<Section>("dashboard");
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [consultations, setConsultations] = useState<ConsultationSummary[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [usersError, setUsersError] = useState("");
  const [paymentsError, setPaymentsError] = useState("");
  const [selected, setSelected] = useState<AdminConsultation | null>(null);
  const [packages, setPackages] = useState<MembershipPackage[]>([]);
  const [packageEdits, setPackageEdits] = useState<Record<string, Partial<MembershipPackage>>>({});
  const [packageSuccess, setPackageSuccess] = useState("");
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const userList = useList(users, userMatches, 10);
  const paymentList = useList(payments, paymentMatches, 10);
  const ticketList = useList(consultations, ticketMatches, 5);

  // Auto-restore admin session on page refresh
  useEffect(() => {
    const token = getToken();
    if (!token || isAdmin) return;
    getMe()
      .then((me) => {
        if (me.role === "ADMIN") {
          setIsAdmin(true);
        } else {
          clearToken();
        }
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          clearToken();
        }
      });
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await login({ email, password });
      setToken(data.token);
      const me = await getMe();
      if (me.role !== "ADMIN") {
        clearToken();
        setError("This account is not an admin.");
        return;
      }
      setIsAdmin(true);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not log in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!isAdmin) return;
    const handleErr = (err: unknown) => {
      if (err instanceof ApiError && err.status === 401) {
        clearToken();
        router.replace("/login");
        return true;
      }
      return false;
    };
    getAdminDashboard().then(setDashboard).catch(handleErr);
    getAdminConsultations().then(setConsultations).catch(handleErr);
    getAdminPackages().then(setPackages).catch(handleErr);
    getAdminUsers().then(setUsers).catch((err) => {
      if (handleErr(err)) return;
      setUsersError(err instanceof ApiError ? err.message : "Could not load users");
    });
    getAdminPayments().then(setPayments).catch((err) => {
      if (handleErr(err)) return;
      setPaymentsError(err instanceof ApiError ? err.message : "Could not load payments");
    });
  }, [isAdmin, refresh]);

  useEffect(() => {
    if (!isAdmin) return;
    if (section === "users" && users.length === 0) {
      setUsersError("");
      getAdminUsers().then(setUsers).catch((err) => {
        setUsersError(err instanceof ApiError ? err.message : "Could not load users");
        console.error("getAdminUsers error:", err);
      });
    }
    if (section === "payments" && payments.length === 0) {
      setPaymentsError("");
      getAdminPayments().then(setPayments).catch((err) => {
        setPaymentsError(err instanceof ApiError ? err.message : "Could not load payments");
        console.error("getAdminPayments error:", err);
      });
    }
  }, [isAdmin, section]);

  useEffect(() => {
    if (!selected) return;
    const interval = setInterval(() => {
      getAdminConsultation(selected.id)
        .then(setSelected)
        .catch(() => {});
    }, 5000);
    return () => clearInterval(interval);
  }, [selected?.id]);

  async function openChat(id: string) {
    try {
      const c = await getAdminConsultation(id);
      setSelected(c);
      setReply("");
    } catch {
      setError("Could not load chat.");
    }
  }

  async function handleUpdatePackage(id: string) {
    const changes = packageEdits[id];
    if (!changes) return;
    setError("");
    setPackageSuccess("");
    try {
      const updated = await updateAdminPackage(id, changes);
      setPackages((prev) => prev.map((p) => (p.id === id ? updated : p)));
      setPackageEdits((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      const pkg = packages.find((p) => p.id === id);
      setPackageSuccess(`${pkg?.name ?? "Package"} updated successfully.`);
      setTimeout(() => setPackageSuccess(""), 4000);
    } catch {
      setError("Could not update package.");
    }
  }

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || !reply.trim()) return;
    setSending(true);
    try {
      await replyConsultation(selected.id, reply.trim());
      const updated = await getAdminConsultation(selected.id);
      setSelected(updated);
      setReply("");
      setRefresh((r) => r + 1);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    } catch {
      setError("Could not send reply.");
    } finally {
      setSending(false);
    }
  }

  async function handleClose() {
    if (!selected) return;
    try {
      await closeConsultation(selected.id);
      const updated = await getAdminConsultation(selected.id);
      setSelected(updated);
      setRefresh((r) => r + 1);
    } catch {
      setError("Could not close ticket.");
    }
  }

  if (!isAdmin) {
    return (
      <section className="bg-linen pb-24 pt-28 md:pt-36">
        <div className="mx-auto max-w-md px-5 md:px-8">
          <div className="text-center">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-boy">
              Admin Login
            </h1>
            <p className="mt-2 text-sm text-slate-mist">
              Sign in to manage the portal.
            </p>
          </div>
          <form onSubmit={handleLogin} className="mt-8 space-y-4 rounded-2xl border border-boy/10 bg-white p-8 shadow-sm">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 w-full rounded-xl border border-boy/15 bg-white px-4 text-sm text-ink outline-none focus:border-girl focus:ring-2 focus:ring-girl/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 w-full rounded-xl border border-boy/15 bg-white px-4 text-sm text-ink outline-none focus:border-girl focus:ring-2 focus:ring-girl/20"
              />
            </div>
            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-full bg-boy text-sm font-semibold text-white transition-colors hover:bg-boy-deep disabled:opacity-60"
            >
              {loading ? "Please wait…" : "Sign in"}
            </button>
          </form>
        </div>
      </section>
    );
  }

  const navItem = (key: Section, label: string) => (
    <button
      key={key}
      onClick={() => {
        setSection(key);
        setSelected(null);
      }}
      className={`flex w-full items-center rounded-xl px-4 py-3 text-left text-sm font-semibold transition-colors ${
        section === key
          ? "bg-boy text-white"
          : "text-slate-mist hover:bg-linen hover:text-ink"
      }`}
    >
      {label}
    </button>
  );

  return (
    <section className="min-h-screen bg-linen pb-8 pt-28 md:pt-36">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 md:flex-row md:px-8">
        {/* Sidebar */}
        <aside className="w-full shrink-0 md:w-64">
          <div className="rounded-2xl border border-boy/10 bg-white p-4 shadow-sm">
            <p className="mb-4 px-4 text-xs font-semibold uppercase tracking-[0.2em] text-girl">
              Menu
            </p>
            <div className="space-y-2">
              {navItem("dashboard", "Dashboard")}
              {navItem("users", "Users")}
              {navItem("payments", "Payments")}
              {navItem("tickets", "Tickets")}
              {navItem("packages", "Packages")}
            </div>
            <button
              onClick={() => {
                clearToken();
                window.location.href = "/login";
              }}
              className="mt-6 w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
            >
              Log out
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="w-full flex-1">
          {section === "dashboard" && (
            <div className="space-y-8">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-girl">
                    Admin Portal
                  </p>
                  <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-boy">
                    Welcome back, Admin
                  </h1>
                </div>
                <p className="text-sm text-slate-mist">
                  {new Date().toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>

              {dashboard && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { label: "Total Users", value: dashboard.totalUsers, icon: UsersIcon, color: "bg-blue-50 text-boy" },
                    { label: "Pending Tickets", value: dashboard.pendingConsultations, icon: MessageIcon, color: "bg-yellow-50 text-yellow-700" },
                    { label: "Answered", value: dashboard.answeredConsultations, icon: CheckIcon, color: "bg-green-50 text-green-700" },
                    { label: "Closed", value: dashboard.closedConsultations, icon: CloseIcon, color: "bg-slate-100 text-slate-600" },
                  ].map((c) => (
                    <div
                      key={c.label}
                      className="rounded-2xl border border-boy/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-slate-mist">{c.label}</p>
                          <p className="mt-2 font-display text-3xl font-semibold text-boy">
                            {c.value}
                          </p>
                        </div>
                        <span className={`rounded-xl p-3 ${c.color}`}>
                          <c.icon className="h-6 w-6" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid gap-6 lg:grid-cols-3">
                {/* Membership packages + quick actions */}
                <div className="space-y-6 lg:col-span-1">
                  <div className="rounded-2xl border border-boy/10 bg-white p-6 shadow-sm">
                    <h2 className="font-display text-xl font-semibold text-boy">
                      Membership packages
                    </h2>
                    <p className="mt-1 text-sm text-slate-mist">
                      Pricing and limits overview
                    </p>
                    <div className="mt-4 space-y-3">
                      {packages.map((pkg) => (
                        <button
                          key={pkg.id}
                          onClick={() => setSection("packages")}
                          className="w-full rounded-xl border border-boy/10 p-4 text-left transition-colors hover:bg-linen"
                        >
                          <p className="text-sm font-semibold text-boy">{pkg.name}</p>
                          <p className="mt-1 text-xs text-slate-mist">
                            KSh {pkg.price.toLocaleString()} · {pkg.ticketLimit !== null ? `${pkg.ticketLimit} tickets` : "Unlimited tickets"} · {pkg.durationMonths !== null ? `${pkg.durationMonths} months` : "No expiry"}
                          </p>
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setSection("packages")}
                      className="mt-4 h-10 w-full rounded-full bg-girl px-5 text-sm font-semibold text-white transition-colors hover:bg-[#9555c9]"
                    >
                      Manage packages
                    </button>
                  </div>

                  <div className="rounded-2xl border border-boy/10 bg-boy p-6 text-white shadow-sm">
                    <h2 className="font-display text-lg font-semibold">Quick actions</h2>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setSection("tickets")}
                        className="rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold transition-colors hover:bg-white/20"
                      >
                        View tickets
                      </button>
                      <button
                        onClick={() => setSection("payments")}
                        className="rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold transition-colors hover:bg-white/20"
                      >
                        Payments
                      </button>
                      <button
                        onClick={() => setSection("users")}
                        className="rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold transition-colors hover:bg-white/20"
                      >
                        All users
                      </button>
                      {/* <button
                        onClick={() => setSection("payments")}
                        className="rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold transition-colors hover:bg-white/20"
                      >
                        All payments
                      </button> */}
                    </div>
                  </div>
                </div>

                {/* Recent tickets */}
                <div className="rounded-2xl border border-boy/10 bg-white p-6 shadow-sm lg:col-span-1">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-display text-xl font-semibold text-boy">
                      Recent tickets
                    </h2>
                    <button
                      onClick={() => setSection("tickets")}
                      className="text-xs font-semibold text-girl hover:underline"
                    >
                      View all
                    </button>
                  </div>
                  {consultations.length === 0 ? (
                    <p className="text-sm text-slate-mist">No tickets yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {consultations.slice(0, 5).map((c) => (
                        <button
                          key={c.id}
                          onClick={() => { setSection("tickets"); openChat(c.id); }}
                          className="w-full rounded-xl border border-boy/10 p-3 text-left transition-colors hover:bg-linen"
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-ink">{c.motherName}</p>
                            <StatusBadge status={c.status} />
                          </div>
                          <p className="mt-1 text-xs text-slate-mist">
                            {c.desiredGender} · {new Date(c.createdAt).toLocaleDateString()}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent payments */}
                <div className="rounded-2xl border border-boy/10 bg-white p-6 shadow-sm lg:col-span-1">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-display text-xl font-semibold text-boy">
                      Recent payments
                    </h2>
                    <button
                      onClick={() => setSection("payments")}
                      className="text-xs font-semibold text-girl hover:underline"
                    >
                      View all
                    </button>
                  </div>
                  {payments.length === 0 ? (
                    <p className="text-sm text-slate-mist">No payments yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {payments.slice(0, 5).map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between gap-3 rounded-xl border border-boy/10 p-3"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-ink">{p.user.email}</p>
                            <p
                              className="truncate text-xs text-slate-mist"
                              title={p.transactionReference || undefined}
                            >
                              {new Date(p.createdAt).toLocaleDateString()} · Ref: {" "}
                              {p.transactionReference
                                ? `${p.transactionReference.slice(0, 8)}...${p.transactionReference.slice(-6)}`
                                : "—"}
                            </p>
                          </div>
                          <div className="shrink-0 text-right">
                            <p className="text-sm font-semibold text-boy">
                              {p.currency} {p.amount.toLocaleString()}
                            </p>
                            <p className={`text-xs font-semibold ${p.status === "SUCCESS" ? "text-green-600" : p.status === "FAILED" ? "text-red-600" : "text-yellow-600"}`}>
                              {p.status}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {section === "users" && (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="font-display text-3xl font-semibold tracking-tight text-boy">
                  Users
                </h1>
                <SearchInput
                  value={userList.query}
                  onChange={userList.setQuery}
                  placeholder="Search by name, email, phone"
                />
              </div>
              {usersError && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {usersError}
                </p>
              )}
              <div className="rounded-2xl border border-boy/10 bg-white p-6 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-boy/10 text-slate-mist">
                        <th className="pb-3 font-medium">Name</th>
                        <th className="pb-3 font-medium">Email</th>
                        <th className="pb-3 font-medium">Phone</th>
                        <th className="pb-3 font-medium">Membership</th>
                        <th className="pb-3 font-medium">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userList.paginated.map((u) => (
                        <tr key={u.id} className="border-b border-boy/10 last:border-0">
                          <td className="py-3 text-ink">{u.name ?? "—"}</td>
                          <td className="py-3 text-ink">{u.email}</td>
                          <td className="py-3 text-ink">{u.phone ?? "—"}</td>
                          <td className="py-3">
                            <span
                              className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                u.membership?.status === "ACTIVE"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {u.membership?.status === "ACTIVE" ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="py-3 text-slate-mist">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <PageControls
                  page={userList.page}
                  totalPages={userList.totalPages}
                  onChange={userList.setPage}
                />
              </div>
            </div>
          )}

          {section === "payments" && (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="font-display text-3xl font-semibold tracking-tight text-boy">
                  Payments
                </h1>
                <SearchInput
                  value={paymentList.query}
                  onChange={paymentList.setQuery}
                  placeholder="Search by user, reference, status"
                />
              </div>
              {paymentsError && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {paymentsError}
                </p>
              )}
              <div className="rounded-2xl border border-boy/10 bg-white p-6 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-boy/10 text-slate-mist">
                        <th className="pb-3 font-medium">User</th>
                        <th className="pb-3 font-medium">Amount</th>
                        <th className="pb-3 font-medium">Status</th>
                        <th className="pb-3 font-medium">Reference</th>
                        <th className="pb-3 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentList.paginated.map((p) => (
                        <tr key={p.id} className="border-b border-boy/10 last:border-0">
                          <td className="py-3 text-ink">{p.user.email}</td>
                          <td className="py-3 text-ink">
                            {p.currency} {p.amount.toLocaleString()}
                          </td>
                          <td className="py-3">
                            <span
                              className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                p.status === "SUCCESS"
                                  ? "bg-green-100 text-green-700"
                                  : p.status === "FAILED"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td className="py-3 text-slate-mist">
                            {p.transactionReference ?? "—"}
                          </td>
                          <td className="py-3 text-slate-mist">
                            {new Date(p.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <PageControls
                  page={paymentList.page}
                  totalPages={paymentList.totalPages}
                  onChange={paymentList.setPage}
                />
              </div>
            </div>
          )}

          {section === "tickets" && (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="font-display text-3xl font-semibold tracking-tight text-boy">
                  Tickets
                </h1>
                <SearchInput
                  value={ticketList.query}
                  onChange={ticketList.setQuery}
                  placeholder="Search by name, gender, status"
                />
              </div>
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="rounded-2xl border border-boy/10 bg-white p-6 shadow-sm lg:col-span-1">
                  {ticketList.paginated.length === 0 ? (
                    <p className="text-sm text-slate-mist">No tickets found.</p>
                  ) : (
                    <div className="space-y-3">
                      {ticketList.paginated.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => openChat(c.id)}
                          className={`w-full rounded-xl border p-4 text-left transition-colors ${
                            selected?.id === c.id
                              ? "border-boy bg-boy/5"
                              : "border-boy/10 hover:bg-linen"
                          }`}
                        >
                          <p className="font-medium text-ink">{c.motherName}</p>
                          <p className="text-xs text-slate-mist">
                            {c.desiredGender} · {c.status} ·{" "}
                            {new Date(c.createdAt).toLocaleDateString()}
                          </p>
                        </button>
                      ))}
                      <PageControls
                        page={ticketList.page}
                        totalPages={ticketList.totalPages}
                        onChange={ticketList.setPage}
                      />
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-boy/10 bg-white p-6 shadow-sm lg:col-span-2">
                  {!selected ? (
                    <p className="text-center text-sm text-slate-mist">
                      Select a ticket to view the chat.
                    </p>
                  ) : (
                    <div className="flex h-80 flex-col md:h-[28rem]">
                      <div className="mb-4 flex items-center justify-between border-b border-boy/10 pb-4">
                        <div>
                          <p className="font-medium text-ink">
                            {selected.motherName} — {selected.user.email}
                          </p>
                          <p className="text-xs text-slate-mist">
                            DOB {selected.dateOfBirthMonth}/{selected.dateOfBirthYear} · Year {selected.plannedConceptionYear} · Status: {selected.status}
                          </p>
                        </div>
                        {selected.status !== "CLOSED" && (
                          <button
                            onClick={handleClose}
                            className="h-9 rounded-full border border-red-200 px-4 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                          >
                            Close ticket
                          </button>
                        )}
                      </div>

                      <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                        <div className="rounded-lg bg-linen p-4 text-sm text-ink">
                          <p className="font-semibold text-boy">Initial request</p>
                          <div className="mt-2 grid grid-cols-1 gap-1.5 text-xs sm:grid-cols-2">
                            <p><span className="text-slate-mist">Mother:</span> <span className="font-medium">{selected.motherName}</span></p>
                            <p><span className="text-slate-mist">Desired gender:</span> <span className="font-medium">{selected.desiredGender}</span></p>
                            <p><span className="text-slate-mist">DOB:</span> <span className="font-medium">{selected.dateOfBirthMonth}/{selected.dateOfBirthYear}</span></p>
                            <p><span className="text-slate-mist">Plan year:</span> <span className="font-medium">{selected.plannedConceptionYear}</span></p>
                            <p><span className="text-slate-mist">Regular cycle:</span> <span className="font-medium">{selected.regularMenstrualCycle ? "Yes" : "No"}</span></p>
                            <p><span className="text-slate-mist">Condition:</span> <span className="font-medium">{selected.underlyingCondition ? "Yes" : "No"}</span></p>
                            {selected.underlyingCondition && selected.underlyingConditionDetails && (
                              <p className="sm:col-span-2"><span className="text-slate-mist">Condition details:</span> <span className="font-medium">{selected.underlyingConditionDetails}</span></p>
                            )}
                          </div>
                        </div>

                        {selected.messages.map((m) => (
                          <div
                            key={m.id}
                            className={`flex ${m.sender === "ADMIN" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                                m.sender === "ADMIN"
                                  ? "rounded-br-none bg-boy text-white"
                                  : "rounded-bl-none border border-boy/10 bg-linen text-ink"
                              }`}
                            >
                              {m.message}
                              <p className={`mt-1 text-[10px] ${m.sender === "ADMIN" ? "text-white/70" : "text-slate-mist"}`}>
                                {new Date(m.createdAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>

                      {selected.status !== "CLOSED" ? (
                        <form onSubmit={handleReply} className="mt-4 flex gap-3 border-t border-boy/10 pt-4">
                          <input
                            type="text"
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            placeholder="Type your guidance…"
                            disabled={sending}
                            className="h-12 flex-1 rounded-full border border-boy/15 bg-white px-4 text-sm text-ink outline-none focus:border-girl focus:ring-2 focus:ring-girl/20 disabled:opacity-60"
                          />
                          <button
                            type="submit"
                            disabled={sending || !reply.trim()}
                            className="h-12 rounded-full bg-boy px-6 text-sm font-semibold text-white transition-colors hover:bg-boy-deep disabled:opacity-60"
                          >
                            {sending ? "…" : "Reply"}
                          </button>
                        </form>
                      ) : (
                        <p className="mt-4 border-t border-boy/10 pt-4 text-center text-sm text-slate-mist">
                          This ticket is closed.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {section === "packages" && (
            <div className="space-y-6">
              <h1 className="font-display text-3xl font-semibold tracking-tight text-boy">
                Membership packages
              </h1>
              {packageSuccess && (
                <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
                  <svg className="h-5 w-5 flex-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  {packageSuccess}
                </div>
              )}
              <div className="grid gap-6 md:grid-cols-2">
                {packages.map((pkg) => {
                  const edits = packageEdits[pkg.id] ?? {};
                  const priceVal = edits.price !== undefined ? edits.price : pkg.price;
                  const limitVal = edits.ticketLimit !== undefined ? edits.ticketLimit : pkg.ticketLimit;
                  const monthsVal = edits.durationMonths !== undefined ? edits.durationMonths : pkg.durationMonths;
                  return (
                    <div key={pkg.id} className="rounded-2xl border border-boy/10 bg-white p-6 shadow-sm">
                      <h2 className="font-display text-xl font-semibold text-boy">{pkg.name}</h2>
                      <div className="mt-4 grid gap-3">
                        <div>
                          <label className="text-xs text-slate-mist">Price (KSh)</label>
                          <input
                            type="number"
                            min={0}
                            value={priceVal ?? ""}
                            onChange={(e) =>
                              setPackageEdits((p) => ({
                                ...p,
                                [pkg.id]: { ...p[pkg.id], price: Number(e.target.value) },
                              }))
                            }
                            className="h-11 w-full rounded-xl border border-boy/15 bg-white px-3 text-sm text-ink outline-none focus:border-girl focus:ring-2 focus:ring-girl/20"
                          />
                        </div>
                        {limitVal !== null && (
                        <div>
                          <label className="text-xs text-slate-mist">Ticket limit</label>
                          <input
                            type="number"
                            min={0}
                            value={limitVal ?? ""}
                            onChange={(e) =>
                              setPackageEdits((p) => ({
                                ...p,
                                [pkg.id]: { ...p[pkg.id], ticketLimit: e.target.value === "" ? null : Number(e.target.value) },
                              }))
                            }
                            className="h-11 w-full rounded-xl border border-boy/15 bg-white px-3 text-sm text-ink outline-none focus:border-girl focus:ring-2 focus:ring-girl/20"
                          />
                        </div>
                        )}
                        {monthsVal !== null && (
                        <div>
                          <label className="text-xs text-slate-mist">Duration months</label>
                          <input
                            type="number"
                            min={0}
                            value={monthsVal ?? ""}
                            onChange={(e) =>
                              setPackageEdits((p) => ({
                                ...p,
                                [pkg.id]: { ...p[pkg.id], durationMonths: e.target.value === "" ? null : Number(e.target.value) },
                              }))
                            }
                            className="h-11 w-full rounded-xl border border-boy/15 bg-white px-3 text-sm text-ink outline-none focus:border-girl focus:ring-2 focus:ring-girl/20"
                          />
                        </div>
                        )}
                        <button
                          onClick={() => handleUpdatePackage(pkg.id)}
                          className="h-11 rounded-full bg-girl px-5 text-sm font-semibold text-white transition-colors hover:bg-[#9555c9]"
                        >
                          Save changes
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>
    </section>
  );
}
