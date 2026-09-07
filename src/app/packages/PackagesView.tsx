"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getStoredUser } from "@/lib/auth";

const PACKAGES = [
  {
    id: "gender",
    name: "Gender Plan",
    price: "KSh 1,499",
    tagline: "Plan your baby's gender",
    features: [
      "Personalised gender plan",
      "Calendar guidance to conceive",
      "Both partners' details",
      "Natural — no medication",
    ],
    featured: true,
  },
  {
    id: "coaching",
    name: "Plus Coaching",
    price: "KSh 3,999",
    tagline: "Gender plan + 1:1 guidance",
    features: [
      "Everything in Gender Plan",
      "One-on-one with Dagitari Waruinu",
      "Personalised coaching calls",
      "Ongoing support",
    ],
    featured: false,
  },
];

export function PackagesView() {
  const router = useRouter();
  const [user] = useState<ReturnType<typeof getStoredUser>>(() => getStoredUser());

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  function choose(id: string) {
    localStorage.setItem("waruinu_package", id);
    router.push("/plan");
  }

  return (
    <section className="bg-linen pb-24 pt-28 md:pt-36">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-girl">
            Choose your package
          </p>
          <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-boy md:text-5xl">
            Welcome back, {user.name.split(" ")[0]}
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-mist">
            Select the plan that fits your family&apos;s journey. A one-time
            membership opens your personalised gender plan.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative flex flex-col rounded-2xl border bg-white p-8 ${
                pkg.featured
                  ? "border-girl shadow-xl shadow-girl/10"
                  : "border-boy/10"
              }`}
            >
              {pkg.featured && (
                <span className="absolute -top-3 right-8 rounded-full bg-girl px-3 py-1 text-xs font-semibold text-white">
                  Most popular
                </span>
              )}
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-girl">
                {pkg.tagline}
              </p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-boy">
                {pkg.name}
              </h2>
              <p className="mt-4 font-display text-4xl font-semibold text-boy">
                {pkg.price}
              </p>
              <p className="mt-1 text-sm text-slate-mist">
                One-time · full membership
              </p>
              <ul className="mt-7 flex-1 space-y-3">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-ink">
                    <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-girl/15">
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#A768D5"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => choose(pkg.id)}
                className={`mt-8 h-12 w-full rounded-full text-sm font-semibold text-white transition-colors ${
                  pkg.featured ? "bg-girl hover:bg-[#9555c9]" : "bg-boy hover:bg-boy-deep"
                }`}
              >
                Choose {pkg.name}
              </button>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-slate-mist">
          Demo flow: choosing a package advances you to the planning calendar.
          No real payment is taken.
        </p>
      </div>
    </section>
  );
}
