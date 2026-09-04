import Image from "next/image";
import { IMAGES } from "@/lib/images";

const STATS = [
  { value: "99%", label: "reported success rate" },
  { value: "24hrs", label: "to a personalised plan" },
  { value: "0", label: "medication or surgery" },
];

export default function Stats() {
  return (
    <section className="relative isolate overflow-hidden bg-boy-deep text-white">
      <div className="absolute inset-0 -z-10">
        <Image
          src={IMAGES.family}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-boy-deep/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-girl-soft">
              The method delivers
            </p>
            <h2 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl">
              Waruinu equals results.
            </h2>
            <p className="mt-6 max-w-md text-lg leading-8 text-white/75">
              Join families across the world who chose to plan ahead — with a
              science-led, considered, and entirely natural approach.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="grid grid-cols-3 divide-x divide-white/15 border-b border-white/15">
              {STATS.map((stat) => (
                <div key={stat.label} className="px-6 first:pl-0 md:px-8">
                  <p className="font-display text-5xl font-semibold text-girl-soft md:text-6xl">
                    {stat.value}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-white/70">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-6 max-w-sm text-sm leading-6 text-white/60">
              Based on the experiences of families who completed the full
              Waruinu method.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
