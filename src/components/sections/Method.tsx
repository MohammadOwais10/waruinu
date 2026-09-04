import Image from "next/image";
import Link from "next/link";
import { IMAGES } from "@/lib/images";

const STEPS = [
  {
    num: "01",
    title: "Personal, not general",
    body: "A personalised plan tailored to each couple's circumstances.",
  },
  {
    num: "02",
    title: "Clear and at home",
    body: "Step-by-step instructions you can follow comfortably from home.",
  },
  {
    num: "03",
    title: "Fast, within a day",
    body: "Guidance delivered within 24 hours of your registration.",
  },
  {
    num: "04",
    title: "Entirely natural",
    body: "A dignified approach — no medication, no surgery.",
  },
];

export default function Method() {
  return (
    <section id="method" className="overflow-hidden bg-white py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Clean image */}
          <div className="relative">
            <div className="overflow-hidden rounded-t-[10rem] rounded-b-[1.75rem] border border-boy/5 shadow-2xl shadow-boy/10">
              <Image
                src={IMAGES.coupleEmbracing}
                alt="An expectant couple embracing, planning their family together"
                width={1400}
                height={1600}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="h-[500px] w-full object-cover md:h-[580px]"
              />
            </div>

            {/* Floating tag */}
            <div className="absolute bottom-6 left-6 inline-flex items-center gap-2.5 rounded-full bg-white/90 px-5 py-3 shadow-lg backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-girl" />
              <span className="text-sm font-semibold text-boy">
                A natural beginning
              </span>
            </div>
          </div>

          {/* Copy */}
          <div className="pt-10 lg:pt-0">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-girl">
              The method
            </p>
            <h2 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-boy md:text-5xl">
              Intentional planning, grounded in science.
            </h2>
            <p className="mt-6 max-w-lg text-base leading-8 text-slate-mist">
              Dagitari Waruinu&apos;s method helps couples plan the gender of
              their baby before conception — clear, structured, and prepared
              around each couple&apos;s own circumstances.
            </p>

            {/* Numbered steps */}
            <div className="mt-9 grid gap-x-8 gap-y-7 sm:grid-cols-2">
              {STEPS.map((step) => (
                <div key={step.num} className="border-t border-boy/10 pt-5">
                  <p className="font-display text-sm font-semibold text-girl">
                    {step.num}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-boy">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-6 text-slate-mist">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-9">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-boy px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-boy-deep"
              >
                Begin your plan
                <svg
                  className="transition-transform group-hover:translate-x-1"
                  width="16"
                  height="16"
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
