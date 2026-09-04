import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { IMAGES } from "@/lib/images";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Begin your journey with Waruinu. Create your account, register, and receive your personalised gender plan within 24 hours.",
};

const CONTACT_METHODS = [
  {
    label: "Phone / WhatsApp",
    value: "0713-759269",
    href: "tel:0713759269",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    value: "Follow Waruinu",
    href: "#",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    value: "Follow Waruinu",
    href: "#",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    value: "Follow Waruinu",
    href: "#",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
];

const FAQ = [
  {
    q: "How soon will I receive my plan?",
    a: "Your personalised gender plan is delivered within 24 hours of completing your registration and membership.",
  },
  {
    q: "Is this method natural?",
    a: "Yes. The Waruinu method is entirely non-invasive — no medication and no surgery. It works through careful, structured guidance.",
  },
  {
    q: "Is my information kept private?",
    a: "Completely. Every conversation and registration is handled with discretion and confidentiality.",
  },
  {
    q: "How do I pay for membership?",
    a: "Membership is a one-time fee of KSh 1,499 paid via M-Pesa or the payment method arranged during sign-up.",
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-boy-deep text-white">
        <div className="absolute inset-0">
          <Image
            src={IMAGES.motherBaby2}
            alt="A mother holding her newborn"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Color sheet overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-boy-deep via-boy-deep/80 to-boy/40" />
          <div className="absolute inset-0 bg-girl/10 mix-blend-multiply" />
        </div>
        <div className="relative mx-auto max-w-3xl px-5 py-32 text-center md:py-44">
         
          <h1 className="mt-7 font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
            Predict your baby&apos;s gender
          </h1>
          <p className="mt-6 mx-auto max-w-xl text-base leading-7 text-white/85 md:text-lg md:leading-8">
            Create your account, register, and receive your personalised plan
            within 24 hours. Private, considered, and entirely without
            medication or surgery.
          </p>
        </div>
      </section>

      {/* Membership + owner */}
      <section className="bg-linen py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Membership */}
            <div>
              <SectionHeading
                eyebrow="Membership"
                title="A clear, one-time step to begin"
              />
              <div className="mt-8 overflow-hidden rounded-lg bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-boy/10 p-7">
                  <div>
                    <p className="text-sm font-medium text-slate-mist">
                      Membership
                    </p>
                    <p className="mt-1 font-display text-3xl font-semibold text-boy">
                      KSh 1,499
                    </p>
                    <p className="mt-1 text-xs text-slate-mist">
                      One-time · includes full membership
                    </p>
                  </div>
                  <Link
                    href="tel:0713759269"
                    className="inline-flex h-11 items-center justify-center rounded-full bg-boy px-6 text-sm font-semibold text-white transition-colors hover:bg-boy-deep"
                  >
                    Sign up
                  </Link>
                </div>
                <ul className="space-y-3 p-7 text-sm text-ink">
                  {[
                    "Personalised gender plan tailored to your family",
                    "Step-by-step instructions within 24 hours",
                    "Guidance from Dagitari Waruinu",
                    "Natural approach — no medication, no surgery",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-girl/15">
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
                      <span className="leading-6">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 flex items-center gap-4 rounded-lg bg-boy-deep p-6 text-white">
                <div className="relative h-16 w-16 flex-none overflow-hidden rounded-full">
                  <Image
                    src={IMAGES.owner}
                    alt="Dagitari Waruinu, founder"
                    fill
                    sizes="64px"
                    className="object-cover object-top"
                  />
                </div>
                <div>
                  <p className="font-display text-lg font-semibold">
                    Dagitari Waruinu
                  </p>
                  <p className="text-sm text-white/70">
                    Pius Warui Njenga · Founder
                  </p>
                </div>
              </div>
            </div>

            {/* Contact methods */}
            <div>
              <SectionHeading
                eyebrow="Contact"
                title="Reach the Waruinu team"
              />

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {CONTACT_METHODS.map((method) => (
                  <a
                    key={method.label}
                    href={method.href}
                    className="group rounded-lg border border-boy/10 bg-white p-6 transition-colors hover:border-boy"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-girl/40 text-girl transition-colors group-hover:bg-girl group-hover:text-white">
                      {method.icon}
                    </span>
                    <p className="mt-4 text-sm font-medium text-slate-mist">
                      {method.label}
                    </p>
                    <p className="mt-1 font-medium text-ink">{method.value}</p>
                  </a>
                ))}
              </div>

              <div className="mt-8 rounded-lg border border-boy/10 bg-white p-7">
                <h3 className="font-display text-xl font-semibold text-boy">
                  Frequently asked questions
                </h3>
                <ul className="mt-6 space-y-5">
                  {FAQ.map((item) => (
                    <li key={item.q}>
                      <p className="text-sm font-semibold text-ink">
                        {item.q}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-slate-mist">
                        {item.a}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
