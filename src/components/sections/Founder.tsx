import Image from "next/image";
import Link from "next/link";
import { IMAGES } from "@/lib/images";

const ROLES = [
  "Family life coach",
  "Sexologist",
  "Radio co-host",
  "Public speaker",
  "Author & columnist",
];

export default function Founder() {
  return (
    <section className="relative overflow-hidden bg-boy-deep text-white">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 md:px-8 lg:grid-cols-12 lg:gap-16 lg:py-32">
        {/* Portrait */}
        <div className="relative order-2 lg:col-span-5 lg:order-1">
          <div className="relative overflow-hidden rounded-[2rem]">
            <Image
              src={IMAGES.owner}
              alt="Dagitari Waruinu — Pius Warui Njenga, founder of Waruinu"
              width={1067}
              height={1600}
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="h-[560px] w-full object-cover object-top md:h-[680px]"
            />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-5 left-5">
              <p className="font-display text-2xl leading-tight text-white">
                Dagitari Waruinu
              </p>
              <p className="text-sm text-white/70">
                Pius Warui Njenga · Founder
              </p>
            </div>
          </div>
        </div>

        {/* Copy */}
        <div className="order-1 lg:col-span-7 lg:order-2">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-girl-soft">
            Meet your guide
          </p>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl">
            A life devoted to helping families plan ahead.
          </h2>

          <div className="mt-8 space-y-6 text-lg leading-8 text-white/75">
            <p>
              For years, Dagitari Waruinu has helped couples take control of
              one of life&apos;s most profound decisions: building their family.
              His scientific method empowers couples to plan their baby&apos;s
              gender before conception — with a success rate trusted by those
              who have followed it, entirely without medication or surgery.
            </p>
            <p>
              Beyond prediction, he guides families as a life coach and
              sexologist, and shares the same message as a radio co-host,
              public speaker, and columnist: plan ahead, live with intention,
              and build the family you imagine.
            </p>
          </div>

          <ul className="mt-9 flex flex-wrap gap-x-2 gap-y-3">
            {ROLES.map((role) => (
              <li
                key={role}
                className="rounded-full border border-white/20 px-4 py-1.5 text-sm font-medium text-white/85"
              >
                {role}
              </li>
            ))}
          </ul>

          <div className="mt-10 border-t border-white/15 pt-8">
            <Link
              href="/about"
              className="group inline-flex items-center gap-3 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black transition-colors hover:bg-white/90"
            >
              Read Waruinu&apos;s story
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
    </section>
  );
}
