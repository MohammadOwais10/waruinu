import Image from "next/image";
import Link from "next/link";
import { IMAGES } from "@/lib/images";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-svh items-end overflow-hidden bg-boy text-white"
    >
      {/* Full-bleed main background + overlay */}
      <Image
        src={IMAGES.heroBg}
        alt=""
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-boy-deep/85 via-boy-deep/45 to-boy-deep/15" />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-boy-deep/75 via-transparent to-boy-deep/30"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid w-full max-w-7xl items-end gap-10 px-5 pt-20 md:px-8 md:pt-28 lg:grid-cols-12">
        {/* Copy */}
        <div className="max-w-3xl pb-14 md:pb-16 lg:col-span-6">
          <h1 className="font-display text-5xl font-bold leading-[0.98] tracking-tight text-white sm:text-6xl xl:text-7xl">
            Plan your baby&apos;s gender{" "}
            <span className="text-girl-soft">before conception.</span>
          </h1>

          <Link
            href="/contact"
            className="group mt-10 inline-flex items-center justify-center gap-2.5 rounded-full bg-girl px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-girl/30 transition-all hover:bg-[#9555c9]"
          >
            Plan Baby Gender
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

        {/* Owner image — full portrait, nothing cut off */}
        <div className="relative ml-auto w-full max-w-md lg:col-span-6 lg:-mr-6 lg:max-w-lg">
          <Image
            src={IMAGES.heroOwner}
            alt="Dagitari Waruinu — Pius Warui Njenga, founder of Dagitari Waruinu"
            width={408}
            height={612}
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="h-auto w-full"
          />
        
        </div>
      </div>
    </section>
  );
}