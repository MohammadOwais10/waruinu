"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { IMAGES } from "@/lib/images";
import { getStoredUser, clearStoredUser, type User } from "@/lib/auth";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const atHomeTop = pathname === "/" && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setUser(getStoredUser());
  }, [pathname]);

  function logout() {
    clearStoredUser();
    window.location.href = "/login";
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-white/20 bg-white/30 shadow-lg shadow-boy/5 backdrop-blur-2xl backdrop-saturate-150"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:h-[4.5rem] md:px-8">
        <Link
          href="/"
          className="flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-boy/10">
            <Image
              src={IMAGES.logo}
              alt="Dagitari Waruinu logo"
              fill
              sizes="36px"
              className="object-cover"
              priority
            />
          </span>
          <span
            className={`font-display text-2xl font-semibold tracking-tight transition-colors duration-300 ${
              atHomeTop ? "text-white" : "text-boy"
            }`}
          >
            Dagitari Waruinu
          </span>
        </Link>

        <nav
          className="hidden items-center gap-9 lg:flex"
          aria-label="Primary"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors duration-300 ${
                atHomeTop
                  ? "text-white/80 hover:text-white"
                  : "text-slate-mist hover:text-boy"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href={user.role === "ADMIN" ? "/admin" : "/dashboard"}
                className="hidden items-center gap-2 rounded-full bg-boy px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-boy-deep md:inline-flex"
              >
                {user.role === "ADMIN" ? "Admin" : "Dashboard"}
              </Link>
              <button
                type="button"
                onClick={logout}
                className={`hidden text-sm font-semibold transition-colors md:inline-block ${
                  atHomeTop
                    ? "text-white/80 hover:text-white"
                    : "text-boy hover:text-boy-deep"
                }`}
              >
                Log out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="hidden items-center gap-2 rounded-full bg-boy px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-boy-deep md:inline-flex"
            >
              Plan Baby Gender
            </Link>
          )}

          <button
            type="button"
            className={`inline-flex h-11 w-11 items-center justify-center rounded-lg transition-colors duration-300 lg:hidden ${
              atHomeTop ? "text-white hover:bg-white/10" : "text-boy hover:bg-boy/5"
            }`}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              {open ? (
                <>
                  <path d="M6 6l12 12" />
                  <path d="M18 6L6 18" />
                </>
              ) : (
                <>
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h10" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          className="border-t border-boy/10 bg-linen/95 px-5 pb-6 pt-4 backdrop-blur-xl lg:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <li
                key={link.href}
                className="border-b border-boy/5 last:border-0"
              >
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between py-4 text-base font-medium text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          {user ? (
            <div className="mt-5 flex flex-col gap-3">
              <Link
                href={user.role === "ADMIN" ? "/admin" : "/dashboard"}
                onClick={() => setOpen(false)}
                className="flex h-12 items-center justify-center rounded-full bg-boy text-sm font-semibold text-white"
              >
                {user.role === "ADMIN" ? "Admin" : "Dashboard"}
              </Link>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
                className="flex h-12 items-center justify-center rounded-full border border-boy/15 text-sm font-semibold text-ink"
              >
                Log out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="mt-5 flex h-12 items-center justify-center rounded-full bg-boy text-sm font-semibold text-white"
            >
              Plan Baby Gender
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
