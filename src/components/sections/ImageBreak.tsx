import Image from "next/image";
import Link from "next/link";

interface ImageBreakProps {
  image: string;
  alt?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  linkText?: string;
  linkHref?: string;
}

export default function ImageBreak({
  image,
  alt = "",
  eyebrow,
  title,
  subtitle,
  linkText,
  linkHref,
}: ImageBreakProps) {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src={image}
          alt={alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
      </div>

      <div className="mx-auto flex min-h-[80vh] max-w-5xl items-center px-5 py-28 text-center md:px-8">
        <div className="mx-auto max-w-3xl">
          {eyebrow && (
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-girl-soft">
              {eyebrow}
            </p>
          )}
          <h2 className="mt-6 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/80">
              {subtitle}
            </p>
          )}
          {linkText && linkHref && (
            <div className="mt-9">
              <Link
                href={linkHref}
                className="group inline-flex items-center gap-3 rounded-full bg-white px-9 py-4 text-base font-semibold text-black transition-colors hover:bg-white/90"
              >
                {linkText}
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
          )}
        </div>
      </div>
    </section>
  );
}
