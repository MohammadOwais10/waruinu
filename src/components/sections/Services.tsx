const SERVICES = [
  {
    num: "01",
    title: "Early gender planning",
    body: "Plan your baby's gender before conception with a structured, science-led approach.",
  },
  {
    num: "02",
    title: "Family life coaching",
    body: "One-on-one guidance as a family life coach and sexologist, supporting couples on their journey.",
  },
  {
    num: "03",
    title: "Public speaking",
    body: "Sought-after speaker on family planning, relationships, and living with purpose.",
  },
  {
    num: "04",
    title: "Radio co-host",
    body: "A warm, trusted voice on air, sharing insight on family and relationship wellbeing.",
  },
  {
    num: "05",
    title: "Author & columnist",
    body: "Written thought leadership on family life, published as author and newspaper columnist.",
  },
  {
    num: "06",
    title: "Brand ambassador",
    body: "Partnering with brands that share a commitment to family, wellness, and intention.",
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-linen py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-girl">
                Everything Dagitari Waruinu offers
              </p>
              <h2 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-boy md:text-5xl">
                Beyond prediction.
              </h2>
              <p className="mt-6 text-base leading-7 text-slate-mist">
                Dagitari Waruinu brings together prediction, coaching, and public service
                — so families are supported at every step.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <ul className="divide-y divide-boy/10 border-t border-boy/10">
              {SERVICES.map((service) => (
                <li
                  key={service.title}
                  className="grid grid-cols-[auto_1fr] items-baseline gap-6 py-8 md:gap-10"
                >
                  <span className="font-display text-sm font-semibold text-girl">
                    {service.num}
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold text-boy transition-colors hover:text-girl md:text-2xl">
                      {service.title}
                    </h3>
                    <p className="mt-2 max-w-lg text-base leading-7 text-slate-mist">
                      {service.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
