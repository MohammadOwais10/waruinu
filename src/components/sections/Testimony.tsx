
const TESTIMONIALS = [
  {
    quote:
      "Planning ahead gave us so much peace of mind. Dagitari Waruinu guided us with clarity and care at every step — we felt entirely supported.",
    name: "A Dagitari Waruinu family",
    initial: "W",
  },
  {
    quote:
      "We finally felt in control of a decision that once felt left to chance. The guidance was personal, clear, and wholly natural.",
    name: "New parents",
    initial: "N",
  },
  {
    quote:
      "From the very first call, everything was private, considered, and professional. It truly changed how we approached building our family.",
    name: "A devoted couple",
    initial: "D",
  },
];

export default function Testimony() {
  return (
    <section className="bg-linen py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-girl">
              What families share
            </p>
            <h2 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-boy md:text-5xl">
              Families who planned it forward.
            </h2>
          </div>
          <p className="max-w-md text-base leading-7 text-slate-mist lg:col-span-6">
            Join the couples who chose intention over chance — and the families
            who are living the difference.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="group relative flex flex-col justify-between rounded-2xl bg-white p-8 shadow-sm transition-shadow hover:shadow-xl"
            >
              <svg
                className="text-girl/30"
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M9.6 5C6.5 6.7 4.5 9.8 4.5 13.3V19h6.4v-6.4H7.4c0-2.4 1.3-4.5 3.4-5.6L9.6 5zm9.9 0c-3.1 1.7-5.1 4.8-5.1 8.3V19h6.4v-6.4h-3.5c0-2.4 1.3-4.5 3.4-5.6L19.5 5z" />
              </svg>
              <blockquote className="mt-5 font-display text-xl leading-8 text-boy">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4 border-t border-boy/10 pt-6">
                <span className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-girl/15 font-display text-xl font-semibold text-girl ring-2 ring-girl/30">
                  {t.initial}
                </span>
                <div>
                  <p className="font-semibold text-ink">{t.name}</p>
                  <p className="mt-0.5 text-sm text-slate-mist">
                    Planned with Dagitari Waruinu
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
