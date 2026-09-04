import Image from "next/image";
import Link from "next/link";
import { IMAGES } from "@/lib/images";

const STEPS = [
  {
    title: "Create your account",
    body: "Begin on the Predict Baby Gender page and create your private account to get started.",
    image: IMAGES.couple,
  },
  {
    title: "Pay your membership",
    body: "A one-time membership of KSh 1,499 opens the door to your personalised gender plan.",
    image: IMAGES.valeriaPregnant,
  },
  {
    title: "Complete your details",
    body: "Fill in the required form details so your plan can be prepared around your circumstances.",
    image: IMAGES.boy2,
  },
  {
    title: "Receive your instructions",
    body: "Within 24 hours, receive the step-by-step guidance on how to conceive your desired gender.",
    image: IMAGES.girl2,
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-boy-deep py-20 text-white md:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-girl-soft">
            How it works
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight md:text-5xl md:leading-[1.1]">
            A clear, four-step journey
          </h2>
          <p className="mt-5 text-base leading-7 text-white/70 md:text-lg">
            From account creation to your personalised plan — the process is
            simple, private, and straightforward.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]"
            >
              <div className="relative h-40 overflow-hidden">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-boy-deep/80 to-transparent" />
                <span className="absolute right-4 top-4 font-display text-4xl font-semibold text-white/40">
                  0{i + 1}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/contact"
            className="group inline-flex items-center gap-3 rounded-full bg-girl px-9 py-4 text-base font-semibold text-white transition-colors hover:bg-[#9555c9]"
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
        </div>
      </div>
    </section>
  );
}
