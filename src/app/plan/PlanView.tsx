"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getStoredUser } from "@/lib/auth";
import { IMAGES } from "@/lib/images";
import FloatingBalloons from "@/components/FloatingBalloons";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function PlanView() {
  const router = useRouter();
  const [user] = useState<ReturnType<typeof getStoredUser>>(() => getStoredUser());

  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [day, setDay] = useState<number | null>(null);

  const [partner1, setPartner1] = useState("2000-01-01");
  const [partner2, setPartner2] = useState("2000-01-01");
  const [result, setResult] = useState<"boy" | "girl" | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [celebrating, setCelebrating] = useState(false);

  useEffect(() => {
    const pkg = localStorage.getItem("waruinu_package");
    if (!user || !pkg) {
      router.replace(pkg ? "/login" : "/packages");
    }
  }, [user, router]);

  const daysInMonth = useMemo(
    () => new Date(year, month + 1, 0).getDate(),
    [year, month]
  );
  const firstWeekday = useMemo(
    () => (new Date(year, month, 1).getDay() + 6) % 7, // Monday-first
    [year, month]
  );

  if (!user) return null;

  function computeGender(): "boy" | "girl" {
    const target = new Date(year, month, day ?? 1);
    const doy =
      (Date.UTC(target.getFullYear(), target.getMonth(), target.getDate()) -
        Date.UTC(target.getFullYear(), 0, 0)) /
      86400000;
    const digits = (s: string) =>
      s.replace(/\D/g, "").split("").reduce((a, n) => a + Number(n), 0);
    const seed = doy + digits(partner1) * 3 + digits(partner2) * 7;
    return Math.abs(seed % 2) === 0 ? "girl" : "boy";
  }

  function handleReveal() {
    setResult(computeGender());
    setRevealed(true);
    setCelebrating(true);
    window.setTimeout(() => setCelebrating(false), 8000);
  }

  return (
    <section className="bg-linen pb-24 pt-28 md:pt-36">
      {/* Celebration overlay */}
      {celebrating && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-boy-deep/90 p-6 text-center text-white">
          <div
            className="pointer-events-none absolute inset-0 overflow-hidden"
            aria-hidden="true"
          >
            {Array.from({ length: 40 }).map((_, i) => (
              <span
                key={i}
                className="absolute block h-3 w-3 animate-[confetti_3s_ease-in-out_infinite] rounded-sm"
                style={{
                  left: `${(i * 37) % 100}%`,
                  top: "-8%",
                  backgroundColor: i % 3 === 0 ? "#A768D5" : i % 3 === 1 ? "#15174c" : "#ffffff",
                  animationDelay: `${(i % 10) * 0.3}s`,
                  transform: `rotate(${(i * 47) % 360}deg)`,
                }}
              />
            ))}
          </div>
          <FloatingBalloons count={28} />
          <p className="relative z-10 text-sm font-semibold uppercase tracking-[0.3em] text-girl-soft">
            Congratulations
          </p>
          <div className="relative mt-6 h-40 w-40 overflow-hidden rounded-full border-4 border-white shadow-2xl">
            <Image
              src={result === "boy" ? IMAGES.heroBoy : IMAGES.heroGirl}
              alt={result === "boy" ? "A baby boy" : "A baby girl"}
              fill
              sizes="160px"
              className="object-cover"
            />
          </div>
          <p className="mt-8 font-display text-5xl font-semibold tracking-tight sm:text-6xl">
            It&apos;s a {result === "boy" ? "Boy" : "Girl"}!
          </p>
          <p className="mt-4 max-w-sm text-white/80">
            Your plan has been prepared. Full guidance arrives within 24 hours.
          </p>
        </div>
      )}

      <div className="mx-auto max-w-2xl px-5 md:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-girl">
            Your gender plan
          </p>
          <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-boy md:text-5xl">
            Plan your baby&apos;s gender
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-mist">
            Select a target date on the calendar, enter both partners&apos;
            dates of birth, then reveal your result.
          </p>
        </div>

        <div className="mt-12 space-y-10">
          {/* Step 1: Calendar */}
          <div className="rounded-2xl border border-boy/10 bg-white p-7 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-boy">
                1 · Pick your target date
              </h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  aria-label="Previous month"
                  onClick={() => {
                    const d = new Date(year, month - 1, 1);
                    setYear(d.getFullYear());
                    setMonth(d.getMonth());
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-boy/15 text-boy hover:bg-linen"
                >
                  ‹
                </button>
                <button
                  type="button"
                  aria-label="Next month"
                  onClick={() => {
                    const d = new Date(year, month + 1, 1);
                    setYear(d.getFullYear());
                    setMonth(d.getMonth());
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-boy/15 text-boy hover:bg-linen"
                >
                  ›
                </button>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between text-sm font-medium text-boy">
              <span>
                {MONTHS[month]} {year}
              </span>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="rounded-lg border border-boy/15 bg-white px-3 py-1.5 text-sm outline-none"
              >
                {Array.from({ length: 11 }, (_, i) => year - 5 + i).map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-medium uppercase tracking-wide text-slate-mist">
              {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                <div key={d} className="py-1">
                  {d}
                </div>
              ))}
            </div>

            <div className="mt-1 grid grid-cols-7 gap-1">
              {Array.from({ length: firstWeekday }).map((_, i) => (
                <div key={`pad-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const d = i + 1;
                const selected = day === d;
                const today =
                  new Date().getFullYear() === year &&
                  new Date().getMonth() === month &&
                  new Date().getDate() === d;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDay(d)}
                    className={`flex h-10 items-center justify-center rounded-lg text-sm transition-colors ${
                      selected
                        ? "bg-boy text-white"
                        : today
                          ? "bg-girl/20 text-boy"
                          : "text-boy hover:bg-linen"
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>

            {day && (
              <p className="mt-4 rounded-lg bg-linen px-4 py-3 text-sm text-slate-mist">
                Target date selected:{" "}
                <span className="font-semibold text-boy">
                  {day} {MONTHS[month]} {year}
                </span>
              </p>
            )}
          </div>

          {/* Step 2: Partner DOBs */}
          <div className="rounded-2xl border border-boy/10 bg-white p-7 shadow-sm">
            <h2 className="font-display text-xl font-semibold text-boy">
              2 · Enter both partners&apos; dates of birth
            </h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="p1"
                  className="mb-1.5 block text-sm font-medium text-ink"
                >
                  Partner 1 DOB
                </label>
                <input
                  id="p1"
                  type="date"
                  value={partner1}
                  onChange={(e) => setPartner1(e.target.value)}
                  className="h-12 w-full rounded-lg border border-boy/15 bg-white px-3 text-sm text-ink outline-none focus:border-girl focus:ring-2 focus:ring-girl/20"
                />
              </div>
              <div>
                <label
                  htmlFor="p2"
                  className="mb-1.5 block text-sm font-medium text-ink"
                >
                  Partner 2 DOB
                </label>
                <input
                  id="p2"
                  type="date"
                  value={partner2}
                  onChange={(e) => setPartner2(e.target.value)}
                  className="h-12 w-full rounded-lg border border-boy/15 bg-white px-3 text-sm text-ink outline-none focus:border-girl focus:ring-2 focus:ring-girl/20"
                />
              </div>
            </div>
          </div>

          {/* Reveal */}
          <button
            type="button"
            onClick={handleReveal}
            disabled={!day}
            className="h-14 w-full rounded-full bg-girl text-base font-semibold text-white transition-colors hover:bg-[#9555c9] disabled:cursor-not-allowed disabled:bg-boy/30"
          >
            Reveal my result
          </button>

          {/* Result */}
          {revealed && result && (
            <div
              className={`rounded-2xl border-2 p-8 text-center ${
                result === "boy"
                  ? "border-boy bg-boy text-white"
                  : "border-girl bg-girl text-white"
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.25em] opacity-80">
                Your result
              </p>
              <div className="relative mx-auto mt-5 h-32 w-32 overflow-hidden rounded-full border-4 border-white/30 shadow-xl">
                <Image
                  src={result === "boy" ? IMAGES.heroBoy : IMAGES.heroGirl}
                  alt={result === "boy" ? "A baby boy" : "A baby girl"}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </div>
              <p className="mt-5 font-display text-6xl font-semibold tracking-tight">
                {result === "boy" ? "Boy" : "Girl"}
              </p>
              <p className="mx-auto mt-4 max-w-sm text-sm leading-6 opacity-90">
                Based on your selected date and both partners&apos; details,
                your present plan points toward a {result}. Guidance is prepared
                within 24 hours.
              </p>
              <button
                type="button"
                onClick={() => {
                  setRevealed(false);
                  setResult(null);
                }}
                className="mt-6 inline-flex h-11 items-center rounded-full bg-white/20 px-6 text-sm font-semibold text-white hover:bg-white/30"
              >
                Plan again
              </button>
            </div>
          )}

          <p className="text-center text-xs leading-5 text-slate-mist">
            Demo prototype — this reveal is a deterministic illustration for
            preview purposes and does not constitute medical or professional
            advice.
          </p>
        </div>
      </div>
    </section>
  );
}
