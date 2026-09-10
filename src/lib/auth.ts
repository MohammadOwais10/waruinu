"use client";

import { clearToken } from "@/lib/api";

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: "USER" | "ADMIN";
  createdAt: string;
}

const USER_KEY = "waruinu_user";
const PACKAGE_KEY = "waruinu_package";

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: User): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearStoredUser(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(USER_KEY);
  clearToken();
}

export function getStoredPackage(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(PACKAGE_KEY);
}

export function setStoredPackage(id: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PACKAGE_KEY, id);
}
