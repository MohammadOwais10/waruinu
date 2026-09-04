import Image from "next/image";
import Link from "next/link";
import { IMAGES } from "@/lib/images";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-linen pt-32 text-boy md:pt-40"
    >
      {/* Soft ambient background */}
      <div
        className="pointer-events-none absolute -right-32 -top-24 -z-10 h-[32rem] w-[32rem] rounded-full bg-girl/15 blur-[140px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-40 bottom-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-boy/10 blur-[140px]"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-girl/40 to-transparent" />

      <div className="mx-auto grid max-w-6xl items-center gap-16 px-5 pb-20 md:px-8 lg:grid-cols-2 lg:pb-28">
        {/* Text */}
        <div>
         

          <h1 className="mt-7 font-display text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl">
            Plan your baby&apos;s gender{" "}
            <span className="text-girl">before conception.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-mist">
            A graceful, science-led method trusted by families — the clarity to
            plan the gender of your child, naturally and without medication.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/contact"
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-boy px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-boy/20 transition-all hover:bg-boy-deep"
            >
              Predict Baby Gender
              <svg
                className="transition-transform group-hover:translate-x-1"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-full border border-boy/20 bg-white/70 px-8 py-3.5 text-base font-semibold text-boy backdrop-blur transition-colors hover:border-boy/40"
            >
              Meet Waruinu
            </Link>
          </div>

          {/* Trust strip */}
          <div className="mt-12 flex flex-wrap gap-x-10 gap-y-4 border-t border-boy/10 pt-7">
            {[
              { value: "99%", label: "success rate" },
              { value: "24hrs", label: "guidance window" },
              { value: "0", label: "medication" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-2xl font-semibold text-boy">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-xs uppercase tracking-widest text-slate-mist">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Premium membership card */}
        <div className="relative mx-auto w-full max-w-md lg:mt-6">
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-girl/25 to-boy/10 blur-2xl" aria-hidden="true" />
          <div className="relative rounded-3xl border border-white bg-white/80 p-7 shadow-2xl shadow-boy/10 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-girl">
                  Waruinu Membership
                </p>
                <p className="mt-2 font-display text-4xl font-semibold text-boy">
                  KSh 1,499
                </p>
                <p className="mt-1 text-sm text-slate-mist">
                  One-time · full membership
                </p>
              </div>
              <span className="relative h-16 w-16 overflow-hidden rounded-full shadow-sm ring-2 ring-girl/30">
                <Image
                  src={IMAGES.owner}
                  alt="Dagitari Waruinu"
                  fill
                  sizes="64px"
                  className="object-cover object-top"
                />
              </span>
            </div>

            <div className="mt-7 space-y-3.5">
              {[
                "Personalised gender plan for your family",
                "Step-by-step instructions within 24 hours",
                "Guidance directly from Dagitari Waruinu",
                "Natural approach — no medication, no surgery",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-girl/15">
                    <svg
                      width="12"
                      height="12"
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
                  <span className="text-sm text-ink">{item}</span>
                </div>
              ))}
            </div>

            <Link
              href="/contact"
              className="mt-8 flex h-12 w-full items-center justify-center rounded-full bg-boy text-sm font-semibold text-white transition-colors hover:bg-boy-deep"
            >
              Begin your plan
            </Link>

            <p className="mt-4 text-center text-xs text-slate-mist">
              Private · considered · trusted by families
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
