import Image from "next/image";
import Link from "next/link";
import { IMAGES } from "@/lib/images";

const FEATURED = {
  title: "Plan a baby boy",
  body: "A considered, science-led path to conceiving a boy — built on timing and preparation before conception.",
  image: IMAGES.heroBoy,
  href: "/#method",
};

const ITEMS = [
  {
    title: "Plan a baby girl",
    image: IMAGES.girl3,
    href: "/#method",
  },
  {
    title: "Family coaching",
    image: IMAGES.couple,
    href: "/#services",
  },
  {
    title: "Early planning",
    image: IMAGES.pregnancy,
    href: "/#how-it-works",
  },
];

export default function WaysToPlan() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        {/* Editorial header */}
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-girl">
              Ways to plan with Waruinu
            </p>
            <h2 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-boy md:text-5xl">
              Paths that liberate your family&apos;s future.
            </h2>
          </div>
          <p className="text-base leading-7 text-slate-mist lg:col-span-5">
            From the gender you hope for, to the coaching and guidance that
            carry you through — every path begins with intention, clarity, and
            care.
          </p>
        </div>

        {/* Editorial asymmetric grid */}
        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {/* Featured large */}
          <Link
            href={FEATURED.href}
            className="group relative min-h-[30rem] overflow-hidden rounded-2xl bg-boy-deep lg:min-h-[40rem]"
          >
            <Image
              src={FEATURED.image}
              alt={FEATURED.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8 md:p-10">
              <p className="text-6xl font-semibold text-white/20">01</p>
              <h3 className="mt-3 font-display text-3xl font-semibold text-white">
                {FEATURED.title}
              </h3>
              <p className="mt-3 max-w-md text-base leading-7 text-white/80">
                {FEATURED.body}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-girl-soft">
                Discover the method
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </Link>

          {/* Supporting column */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            {ITEMS.map((item, i) => (
              <Link
                key={item.title}
                href={item.href}
                className={`group relative overflow-hidden rounded-2xl bg-boy-deep ${
                  i === 2 ? "sm:col-span-2 lg:col-span-1" : ""
                }`}
                style={{ minHeight: i === 2 ? "12rem" : "12rem" }}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-6">
                  <h3 className="text-xl font-semibold text-white">
                    {item.title}
                  </h3>
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-white/30 text-white transition-colors group-hover:bg-white group-hover:text-black">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
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
      </div>
    </section>
  );
}
