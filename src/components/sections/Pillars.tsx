import Image from "next/image";
import Link from "next/link";
import { IMAGES } from "@/lib/images";

const PILLARS = [
  {
    num: "01",
    title: "Plan a Baby Boy",
    body: "A considered, science-led path to conceiving a boy — built on timing and preparation before conception.",
    image: IMAGES.heroBoy,
    href: "/#method",
  },
  {
    num: "02",
    title: "Plan a Baby Girl",
    body: "Guidance designed for couples hoping to welcome a girl into their family, with clarity and care.",
    image: IMAGES.heroGirl,
    href: "/#method",
  },
  {
    num: "03",
    title: "Family Coaching",
    body: "One-on-one support as a family life coach and sexologist, guiding you at every step.",
    image: IMAGES.couple,
    href: "/#services",
  },
  {
    num: "04",
    title: "Wellbeing & Care",
    body: "A nurturing foundation that carries your family forward through every phase of the journey.",
    image: IMAGES.motherBaby,
    href: "/#services",
  },
  {
    num: "05",
    title: "Newborn Care",
    body: "Gentle guidance and reassurance for the first precious weeks of your little one's life.",
    image: IMAGES.newborn2,
    href: "/#services",
  },
  {
    num: "06",
    title: "The Family Home",
    body: "Support that grows with you — from planning, to pregnancy, to raising the family you imagined.",
    image: IMAGES.baby2,
    href: "/about",
  },
];

export default function Pillars() {
  return (
    <section className="bg-linen py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-girl">
              Pillars of a planned family
            </p>
            <h2 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-boy md:text-5xl">
              Every area of your family journey.
            </h2>
          </div>
          <p className="max-w-sm text-base leading-7 text-slate-mist">
            From the gender you hope for, to the coaching that guides you — plan
            every side of the family you imagine.
          </p>
        </div>

        {/* Pillar cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((pillar) => (
            <Link
              key={pillar.title}
              href={pillar.href}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-boy/10 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:border-boy/20 hover:shadow-xl hover:shadow-boy/5"
            >
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={pillar.image}
                  alt={pillar.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                <span className="absolute left-5 top-4 font-display text-sm font-semibold text-white drop-shadow">
                  {pillar.num}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-semibold text-boy">
                  {pillar.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-slate-mist">
                  {pillar.body}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-girl">
                  Explore
                  <svg
                    className="transition-transform group-hover:translate-x-1"
                    width="14"
                    height="14"
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
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
