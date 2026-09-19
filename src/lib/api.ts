"use client";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

const TOKEN_KEY = "waruinu_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  auth = false
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const body = (await res.json().catch(() => null)) as ApiResponse<T> | null;

  if (!res.ok) {
    throw new ApiError(body?.message ?? "Something went wrong", res.status);
  }
  return (body?.data ?? body) as T;
}

/* ---------- Types matching backend ---------- */

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: "USER" | "ADMIN";
  token: string;
}

export interface MeProfile {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: "USER" | "ADMIN";
  createdAt: string;
  membership: {
    status: "ACTIVE" | "INACTIVE";
    expiresAt: string | null;
    updatedAt: string;
    package: {
      id: string;
      name: string;
      price: number;
      currency: string;
      ticketLimit: number | null;
      durationMonths: number | null;
    } | null;
  } | null;
}

export interface MembershipPackage {
  id: string;
  name: string;
  price: number;
  currency: string;
  ticketLimit: number | null;
  durationMonths: number | null;
  isActive: boolean;
}

export interface PaymentInit {
  paymentId: string;
  amount: number;
  redirectUrl: string;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: "PENDING" | "SUCCESS" | "FAILED";
  transactionReference: string | null;
  createdAt: string;
  package?: { name: string } | null;
}

export interface ConsultationPayload {
  motherName: string;
  dateOfBirthMonth: string;
  dateOfBirthYear: number;
  regularMenstrualCycle: boolean;
  underlyingCondition: boolean;
  underlyingConditionDetails?: string;
  desiredGender: "BOY" | "GIRL";
  plannedConceptionYear: number;
}

export interface Message {
  id: string;
  sender: "USER" | "ADMIN";
  message: string;
  createdAt: string;
}

export interface Consultation extends ConsultationPayload {
  id: string;
  status: "PENDING" | "ANSWERED" | "CLOSED";
  adminResponse: string | null;
  createdAt: string;
  messages: Message[];
}

export interface ConsultationSummary {
  id: string;
  motherName: string;
  status: "PENDING" | "ANSWERED" | "CLOSED";
  desiredGender: "BOY" | "GIRL";
  createdAt: string;
}

/* ---------- Auth ---------- */

export function register(data: {
  email: string;
  password: string;
  name?: string;
  phone?: string;
}) {
  return request<{ message: string }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function verifyOtp(data: { email: string; code: string }) {
  return request<AuthUser>("/api/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function resendOtp(data: { email: string }) {
  return request<{ message: string }>("/api/auth/resend-otp", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function forgotPassword(data: { email: string }) {
  return request<{ message: string }>("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function resetPassword(data: { email: string; code: string; newPassword: string }) {
  return request<{ message: string }>("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function login(data: { email: string; password: string }) {
  return request<AuthUser>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function sendEmailVerification(data: { email: string }) {
  return request<{ message: string }>("/api/auth/send-email-verification", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function verifyEmail(data: { email: string; code: string }) {
  return request<{ message: string }>("/api/auth/verify-email", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getMe() {
  return request<MeProfile>("/api/auth/me", {}, true);
}

/* ---------- Admin ---------- */

export interface DashboardSummary {
  totalUsers: number;
  pendingConsultations: number;
  answeredConsultations: number;
  closedConsultations: number;
  currentMembershipPrice: number;
}

export interface AdminConsultation extends Consultation {
  user: { email: string };
}

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  createdAt: string;
  membership: { status: "ACTIVE" | "INACTIVE" } | null;
}

export interface AdminPayment {
  id: string;
  amount: number;
  currency: string;
  status: "PENDING" | "SUCCESS" | "FAILED";
  transactionReference: string | null;
  createdAt: string;
  user: { email: string };
}

export function getAdminDashboard() {
  return request<DashboardSummary>("/api/admin/dashboard", {}, true);
}

export function getAdminConsultations() {
  return request<ConsultationSummary[]>("/api/admin/consultations", {}, true);
}

export function getAdminUsers() {
  return request<AdminUser[]>("/api/admin/users", {}, true);
}

export function getAdminPayments() {
  return request<AdminPayment[]>("/api/admin/payments", {}, true);
}

export function verifyAdminPayment(id: string) {
  return request<{
    paymentId: string;
    status: "PENDING" | "SUCCESS" | "FAILED";
    state?: string;
    failedReason?: string | null;
  }>(`/api/admin/payments/${id}/verify`, { method: "POST" }, true);
}

export function getAdminPackages() {
  return request<MembershipPackage[]>("/api/admin/packages", {}, true);
}

export function updateAdminPackage(
  id: string,
  data: Partial<Omit<MembershipPackage, "id" | "createdAt" | "updatedAt">>
) {
  return request<MembershipPackage>(
    `/api/admin/packages/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    },
    true
  );
}

export function getAdminConsultation(id: string) {
  return request<AdminConsultation>(`/api/admin/consultations/${id}`, {}, true);
}

export function replyConsultation(id: string, adminResponse: string) {
  return request<{ message: Message; consultation: AdminConsultation }>(
    `/api/admin/consultations/${id}/reply`,
    {
      method: "POST",
      body: JSON.stringify({ adminResponse }),
    },
    true
  );
}

export function closeConsultation(id: string) {
  return request<AdminConsultation>(
    `/api/admin/consultations/${id}/close`,
    {
      method: "PATCH",
    },
    true
  );
}

/* ---------- Membership ---------- */

export function getMembershipPackages() {
  return request<MembershipPackage[]>("/api/membership/packages", {}, true);
}

export function initiatePayment(phoneNumber: string, packageId: string) {
  return request<PaymentInit>(
    "/api/membership/pay",
    {
      method: "POST",
      body: JSON.stringify({ phoneNumber, packageId }),
    },
    true
  );
}

export function simulatePayment(packageId?: string) {
  return request<{ paymentId: string }>(
    "/api/membership/simulate",
    {
      method: "POST",
      body: packageId ? JSON.stringify({ packageId }) : undefined,
    },
    true
  );
}

export function getUserPayments() {
  return request<Payment[]>("/api/membership/payments", {}, true);
}

export function verifyPayment(paymentId: string) {
  return request<{ paymentId: string; status: "PENDING" | "SUCCESS" | "FAILED"; state?: string; failedReason?: string | null }>(
    "/api/membership/verify-payment",
    {
      method: "POST",
      body: JSON.stringify({ paymentId }),
    },
    true
  );
}

/* ---------- Consultations ---------- */

export function createConsultation(payload: ConsultationPayload) {
  return request<Consultation>(
    "/api/consultations",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    true
  );
}

export function getConsultations() {
  return request<ConsultationSummary[]>("/api/consultations", {}, true);
}

export function getConsultation(id: string) {
  return request<Consultation>(`/api/consultations/${id}`, {}, true);
}

export function createConsultationMessage(id: string, message: string) {
  return request<Message>(
    `/api/consultations/${id}/messages`,
    {
      method: "POST",
      body: JSON.stringify({ message }),
    },
    true
  );
}
