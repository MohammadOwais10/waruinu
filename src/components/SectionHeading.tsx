interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "dark",
}: SectionHeadingProps) {
  const isLight = tone === "light";
  return (
    <div
      className={`max-w-2xl ${
        align === "center" ? "mx-auto text-center" : ""
      }`}
    >
      <p
        className={`text-sm font-semibold uppercase tracking-[0.2em] ${
          isLight ? "text-girl-soft" : "text-girl"
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`mt-4 text-3xl font-semibold leading-tight tracking-tight md:text-[2.6rem] md:leading-[1.1] ${
          isLight ? "text-white" : "text-boy"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-5 text-base leading-7 ${
            isLight ? "text-white/75" : "text-slate-mist"
          } md:text-lg md:leading-8`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
