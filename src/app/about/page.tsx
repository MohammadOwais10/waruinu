import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import Button from "@/components/Button";
import { IMAGES } from "@/lib/images";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Dagitari Waruinu — Pius Warui Njenga, founder of Dagitari Waruinu and pioneer of a science-led method for planning your baby's gender before conception.",
};

const MILESTONES = [
  {
    title: "Radio co-host",
    body: "A warm, trusted voice on air, sharing insight on family and relationship wellbeing.",
  },
  {
    title: "Public speaker",
    body: "Sought-after speaker on family planning, relationships, and living with purpose.",
  },
  {
    title: "Author & columnist",
    body: "Written thought leadership on family life, published as author and newspaper columnist.",
  },
  {
    title: "Brand ambassador",
    body: "Partnering with brands that share a commitment to family, wellness, and intention.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-svh flex-col overflow-hidden border-b border-boy/10 bg-white">
        <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 pt-20 md:px-8 md:pt-24">
          <div className="grid flex-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
            {/* Copy */}
            <div className="lg:col-span-7">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-girl">
                Dagitari Waruinu · Founder
              </p>

              <h1 className="mt-7 font-display text-5xl font-semibold leading-[0.98] tracking-tight text-boy sm:text-6xl xl:text-7xl">
                Giving families
                <span className="block text-girl">a clear plan.</span>
              </h1>

              <div className="mt-10 flex flex-col gap-8 border-t border-boy/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
                <div className="max-w-sm">
                  <p className="text-lg leading-7 text-slate-mist">
                    A science-led method for planning your baby&apos;s gender
                    before conception — private, natural, and trusted by
                    families.
                  </p>
                  <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-slate-mist">
                    No medication · No surgery
                  </p>
                </div>
                <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                  <Button href="/contact" variant="primary">
                    Plan with Dagitari Waruinu
                  </Button>
                  <Button href="/#method" variant="outline">
                    The method
                  </Button>
                </div>
              </div>
            </div>

            {/* Portrait */}
            <div className="lg:col-span-5">
              <figure>
                <div className="relative max-h-[min(56svh,32rem)] overflow-hidden">
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-br from-boy-deep via-boy to-girl/50"
                    aria-hidden="true"
                  />
                  <Image
                    src={IMAGES.heroOwner}
                    alt="Dagitari Waruinu — Pius Warui Njenga, founder"
                    width={408}
                    height={612}
                    priority
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="relative aspect-[408/612] h-auto w-full object-cover object-top"
                  />
                </div>
                <figcaption className="mt-4 flex items-baseline justify-between border-t border-boy/10 pt-4">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-boy">
                    Dagitari Waruinu
                  </span>
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate-mist">
                    Founder
                  </span>
                </figcaption>
              </figure>
            </div>
          </div>

          {/* Metrics strip */}
          <div className="grid grid-cols-1 divide-y divide-boy/10 border-t border-boy/10 pt-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {[
              ["99%", "Reported success rate"],
              ["24hrs", "To a personalised plan"],
              ["0", "Medication or surgery"],
            ].map(([v, l]) => (
              <div key={l} className="py-4 sm:px-8 sm:first:pl-0 sm:py-5">
                <p className="font-display text-3xl font-semibold text-boy">
                  {v}
                </p>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-mist">
                  {l}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="bg-linen py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-28">
                <SectionHeading
                  eyebrow="The story"
                  title="A life devoted to helping families plan ahead"
                />
                <div className="mt-7 overflow-hidden rounded-lg">
                  <Image
                    src="/images/dwayne-joe-80Zh-xPi7KA-unsplash.jpg"
                    alt="A family walking together at golden hour"
                    width={1400}
                    height={1050}
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="h-72 w-full object-cover md:h-96"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-5 text-base leading-8 text-slate-mist">
              <p>
                Dagitari Waruinu&apos;s journey is rooted in a conviction that
                families deserve more than guesswork. Rather than leaving the
                most meaningful moment of a couple&apos;s life to chance, his
                scientific method empowers couples to plan the gender of their
                baby before conception — with a success rate trusted by those
                who have followed it.
              </p>
              <p>
                Entirely without medication or surgery, the approach begins
                where it matters most: before conception. It is a natural,
                dignified path that places clarity and control back with the
                parents who are building their family.
              </p>
              <p>
                Beyond prediction, Dagitari Waruinu serves as a family life coach and
                sexologist, offering one-on-one guidance to couples navigating
                this intimate decision. His presence as a radio co-host, public
                speaker, and newspaper columnist extends the same message to
                broad audiences: plan ahead, live with intention, and build the
                family you imagine.
              </p>
              <p>
                Through every platform, the message is consistent and clear —
                that the family you dream of is not left to fate. It can be
                planned, with care, purpose, and a science-led method.
              </p>
              <blockquote className="mt-9 border-l-2 border-girl pl-6">
                <p className="font-display text-xl leading-8 text-boy md:text-2xl">
                  “Families deserve the ability to plan ahead. My work is giving
                  them that clarity.”
                </p>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Services / Roles */}
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHeading
            eyebrow="Beyond prediction"
            title="A partner in family life, across every platform"
            description="Dagitari Waruinu brings together prediction, coaching, and public service — so families are supported at every step of their journey."
            align="center"
          />
          <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-boy/10 bg-boy/10 sm:grid-cols-2 lg:grid-cols-4">
            {MILESTONES.map((item) => (
              <div
                key={item.title}
                className="group flex flex-col bg-linen p-7 transition-colors hover:bg-boy md:p-8"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-girl/40 text-girl transition-colors group-hover:border-girl-soft group-hover:text-girl-soft">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 3l1.6 4.8L18 9l-4.4 1.2L12 15l-1.6-4.8L6 9l4.4-1.2z" />
                  </svg>
                </span>
                <h3 className="mt-5 text-lg font-semibold text-boy transition-colors group-hover:text-white">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm leading-6 text-slate-mist transition-colors group-hover:text-white/75">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Family gallery */}
      <section className="bg-linen py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHeading
            eyebrow="The families we serve"
            title="Every family's story begins with intention"
            description="From planning to the first newborn weeks, the Dagitari Waruinu method walks beside you at each step."
            align="center"
          />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { src: IMAGES.baby, alt: "A newborn in soft, warm light" },
              { src: IMAGES.baby3, alt: "A newborn cradled gently" },
              { src: IMAGES.motherBaby3, alt: "A tender mother and baby moment" },
              { src: IMAGES.girl2, alt: "A newborn close-up" },
              { src: IMAGES.newborn, alt: "A peaceful newborn portrait" },
              { src: IMAGES.newbornFeet, alt: "A newborn's tiny feet" },
              { src: IMAGES.portraiture, alt: "A warm familial portrait" },
              { src: IMAGES.pregnancy, alt: "An expectant mother" },
              { src: IMAGES.babyHands, alt: "A gentle moment with a newborn" },
              { src: IMAGES.family, alt: "A family together" },
              { src: IMAGES.couple, alt: "Expectant parents in soft light" },
              { src: IMAGES.motherBaby, alt: "A mother with her newborn" },
            ].map((img) => (
              <div
                key={img.src}
                className="group relative aspect-[4/5] overflow-hidden"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-boy/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-boy-deep py-20 text-white md:py-24">
        <div className="absolute inset-0 opacity-20">
          <Image
            src={IMAGES.motherBaby}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-boy-deep" />
        </div>
        <div className="relative mx-auto max-w-2xl px-5 text-center">
          <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight md:text-[2.6rem] md:leading-[1.1]">
            Plan the family you imagine
          </h2>
          <p className="mt-5 text-base leading-7 text-white/75 md:text-lg">
            Begin your journey with a personalised, private plan — delivered
            within 24 hours.
          </p>
          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex h-12 items-center justify-center rounded-full bg-girl px-8 text-sm font-semibold text-white transition-colors hover:bg-[#9555c9]"
            >
              Plan Baby Gender
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
