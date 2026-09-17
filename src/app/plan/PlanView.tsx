"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getStoredUser } from "@/lib/auth";
import {
  Consultation,
  createConsultation,
  createConsultationMessage,
  getConsultation,
  getConsultations,
  getMe,
  ApiError,
  MeProfile,
} from "@/lib/api";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function PlanView() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [membershipChecked, setMembershipChecked] = useState(false);
  const [user] = useState<ReturnType<typeof getStoredUser>>(() => getStoredUser());

  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [membership, setMembership] = useState<MeProfile["membership"]>(null);
  const [ticketCount, setTicketCount] = useState(0);

  // Form state
  const [motherName, setMotherName] = useState(user?.name ?? "");
  const [dateOfBirth, setDateOfBirth] = useState("1990-01");
  const [regularMenstrualCycle, setRegularMenstrualCycle] = useState<boolean | null>(null);
  const [underlyingCondition, setUnderlyingCondition] = useState<boolean | null>(null);
  const [underlyingConditionDetails, setUnderlyingConditionDetails] = useState("");
  const [desiredGender, setDesiredGender] = useState<"BOY" | "GIRL" | null>(null);
  const [plannedConceptionYear, setPlannedConceptionYear] = useState(new Date().getFullYear());

  const [newMessage, setNewMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [ticketCreated, setTicketCreated] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !user) return;
    getMe()
      .then(async (me) => {
        if (me.membership?.status !== "ACTIVE") {
          router.replace("/packages");
          return;
        }
        setMembership(me.membership);
        setMembershipChecked(true);
        try {
          const list = await getConsultations();
          setTicketCount(list.length);
          // Only auto-open a non-closed ticket; if all are closed, show the form
          const openTicket = list.find((c) => c.status !== "CLOSED");
          if (openTicket) {
            const full = await getConsultation(openTicket.id);
            setConsultation(full);
          }
        } catch {
          // no consultations yet
        }
      })
      .catch(() => router.replace("/login"));
  }, [mounted, user, router]);

  // Poll for new admin messages every 5 sec
  useEffect(() => {
    if (!consultation) return;
    const interval = setInterval(() => {
      getConsultation(consultation.id)
        .then(setConsultation)
        .catch(() => {});
    }, 5000);
    return () => clearInterval(interval);
  }, [consultation?.id]);

  if (!mounted || !user || !membershipChecked) return null;

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (
      !motherName.trim() ||
      regularMenstrualCycle === null ||
      underlyingCondition === null ||
      !desiredGender
    ) {
      setMessage("Please fill in all required fields.");
      return;
    }

    if (membership?.package?.ticketLimit !== null && membership?.package?.ticketLimit !== undefined && ticketCount >= membership.package.ticketLimit) {
      setMessage(`You have used all ${membership.package.ticketLimit} tickets in your ${membership.package.name} package.`);
      return;
    }

    setSubmitting(true);
    setMessage("");
    const [yearStr, monthStr] = dateOfBirth.split("-");
    const dateOfBirthYear = parseInt(yearStr, 10);
    const dateOfBirthMonth = MONTHS[parseInt(monthStr, 10) - 1] || monthStr;
    try {
      await createConsultation({
        motherName: motherName.trim(),
        dateOfBirthMonth,
        dateOfBirthYear,
        regularMenstrualCycle,
        underlyingCondition,
        underlyingConditionDetails: underlyingCondition ? underlyingConditionDetails : undefined,
        desiredGender,
        plannedConceptionYear,
      });
      const list = await getConsultations();
      setTicketCount(list.length);
      if (list.length > 0) {
        const full = await getConsultation(list[0].id);
        setConsultation(full);
      }
      setTicketCreated(true);
    } catch (err) {
      setMessage(
        err instanceof ApiError
          ? err.message
          : "Could not create ticket. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!consultation || !newMessage.trim()) return;
    setSending(true);
    try {
      await createConsultationMessage(consultation.id, newMessage.trim());
      const full = await getConsultation(consultation.id);
      setConsultation(full);
      setNewMessage("");
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    } catch (err) {
      setMessage(
        err instanceof ApiError
          ? err.message
          : "Could not send message."
      );
    } finally {
      setSending(false);
    }
  }

  if (consultation) {
    return (
      <section className="bg-linen pb-24 pt-28 md:pt-36">
        <div className="mx-auto max-w-2xl px-5 md:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-girl">
              Your ticket
            </p>
            <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight text-boy">
              Consultation with Dagitari Waruinu
            </h1>
            <p className="mt-2 text-sm text-slate-mist">
              Status: <span className="font-semibold text-boy">{consultation.status}</span>
              {membership?.package && (
                <span className="ml-3">
                  Plan: <span className="font-semibold text-boy">{membership.package.name}</span>
                  {membership.package.ticketLimit !== null && membership.package.ticketLimit !== undefined && (
                    <span className="ml-2 text-xs">
                      ({Math.max(0, membership.package.ticketLimit - ticketCount)} tickets remaining)
                    </span>
                  )}
                </span>
              )}
            </p>

            {consultation.status === "CLOSED" && (
              membership?.package?.ticketLimit === null || membership?.package?.ticketLimit === undefined || ticketCount < membership.package.ticketLimit ? (
                <button
                  onClick={() => {
                    setConsultation(null);
                    setNewMessage("");
                  }}
                  className="mt-4 h-10 rounded-full border border-boy/20 px-5 text-sm font-semibold text-boy transition-colors hover:bg-linen"
                >
                  + Create new ticket
                </button>
              ) : (
                <p className="mt-4 text-xs text-slate-mist">
                  You have used all your tickets.
                </p>
              )
            )}
          </div>

          <div className="mt-8 flex h-80 flex-col rounded-2xl border border-boy/10 bg-white shadow-sm md:h-[28rem]">
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              <div className="rounded-lg bg-linen p-4 text-sm text-ink">
                <p className="font-semibold text-boy">Initial request</p>
                <div className="mt-2 grid grid-cols-1 gap-1.5 text-xs sm:grid-cols-2">
                  <p><span className="text-slate-mist">Mother:</span> <span className="font-medium">{consultation.motherName}</span></p>
                  <p><span className="text-slate-mist">Desired gender:</span> <span className="font-medium">{consultation.desiredGender}</span></p>
                  <p><span className="text-slate-mist">DOB:</span> <span className="font-medium">{consultation.dateOfBirthMonth}/{consultation.dateOfBirthYear}</span></p>
                  <p><span className="text-slate-mist">Plan year:</span> <span className="font-medium">{consultation.plannedConceptionYear}</span></p>
                  <p><span className="text-slate-mist">Regular cycle:</span> <span className="font-medium">{consultation.regularMenstrualCycle ? "Yes" : "No"}</span></p>
                  <p><span className="text-slate-mist">Condition:</span> <span className="font-medium">{consultation.underlyingCondition ? "Yes" : "No"}</span></p>
                  {consultation.underlyingCondition && consultation.underlyingConditionDetails && (
                    <p className="sm:col-span-2"><span className="text-slate-mist">Condition details:</span> <span className="font-medium">{consultation.underlyingConditionDetails}</span></p>
                  )}
                </div>
              </div>

              {consultation.messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.sender === "USER" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                      m.sender === "USER"
                        ? "rounded-br-none bg-boy text-white"
                        : "rounded-bl-none border border-boy/10 bg-linen text-ink"
                    }`}
                  >
                    {m.message}
                    <p className={`mt-1 text-[10px] ${m.sender === "USER" ? "text-white/70" : "text-slate-mist"}`}>
                      {new Date(m.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {consultation.status !== "CLOSED" ? (
              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-3 border-t border-boy/10 p-4"
              >
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a follow-up message…"
                  disabled={sending}
                  className="h-12 flex-1 rounded-full border border-boy/15 bg-white px-4 text-sm text-ink outline-none focus:border-girl focus:ring-2 focus:ring-girl/20 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="h-12 rounded-full bg-boy px-6 text-sm font-semibold text-white transition-colors hover:bg-boy-deep disabled:opacity-60"
                >
                  {sending ? "…" : "Send"}
                </button>
              </form>
            ) : (
              <p className="border-t border-boy/10 p-4 text-center text-sm text-slate-mist">
                This consultation is closed.
              </p>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-linen pb-24 pt-28 md:pt-36">
      <div className="mx-auto max-w-xl px-5 md:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-girl">
            Step 2 · Consultation
          </p>
          <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-boy md:text-5xl">
            Create your ticket
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-mist">
            Answer a few questions and Dagitari Waruinu will reply through chat with Dagiri Waruinu.
          </p>
        </div>

        <form
          onSubmit={handleCreate}
          className="mt-12 space-y-8 rounded-2xl border border-boy/10 bg-white p-8 shadow-sm"
        >
          {/* Mother name */}
          <div>
            <label
              htmlFor="mother-name"
              className="mb-1.5 block text-sm font-medium text-ink"
            >
              Mother&apos;s full name
            </label>
            <input
              id="mother-name"
              type="text"
              value={motherName}
              onChange={(e) => setMotherName(e.target.value)}
              className="h-12 w-full rounded-xl border border-boy/15 bg-white px-4 text-sm text-ink outline-none transition-colors focus:border-girl focus:ring-2 focus:ring-girl/20"
            />
          </div>

          {/* Date of birth */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">
              Date of birth
            </label>
            <input
              type="month"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              max={new Date().toISOString().slice(0, 7)}
              className="h-12 w-full rounded-xl border border-boy/15 bg-white px-4 text-sm text-ink outline-none transition-colors focus:border-girl focus:ring-2 focus:ring-girl/20"
            />
          </div>

          {/* Desired gender */}
          <div>
            <p className="mb-2 text-sm font-medium text-ink">
              Which gender are you hoping for?
            </p>
            <div className="flex gap-3">
              {(["BOY", "GIRL"] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setDesiredGender(g)}
                  className={`h-11 flex-1 rounded-full border text-sm font-semibold transition-colors ${
                    desiredGender === g
                      ? g === "BOY"
                        ? "border-boy bg-boy text-white"
                        : "border-girl bg-girl text-white"
                      : "border-boy/15 text-boy hover:bg-linen"
                  }`}
                >
                  {g === "BOY" ? "Boy" : "Girl"}
                </button>
              ))}
            </div>
          </div>

          {/* Menstrual cycle */}
          <div>
            <p className="mb-2 text-sm font-medium text-ink">
              Is your menstrual cycle regular?
            </p>
            <div className="flex gap-3">
              {[true, false].map((v) => (
                <button
                  key={String(v)}
                  type="button"
                  onClick={() => setRegularMenstrualCycle(v)}
                  className={`h-11 flex-1 rounded-full border text-sm font-semibold transition-colors ${
                    regularMenstrualCycle === v
                      ? "border-boy bg-boy text-white"
                      : "border-boy/15 text-boy hover:bg-linen"
                  }`}
                >
                  {v ? "Yes" : "No"}
                </button>
              ))}
            </div>
          </div>

          {/* Health condition */}
          <div>
            <p className="mb-1 text-sm font-medium text-ink">
              Do you have any existing medical/reproductive health condition?
            </p>
            <p className="mb-3 text-xs text-slate-mist">
              Examples: PCOS, Endometriosis, Thyroid, etc.
            </p>
            <div className="flex gap-3">
              {[true, false].map((v) => (
                <button
                  key={String(v)}
                  type="button"
                  onClick={() => setUnderlyingCondition(v)}
                  className={`h-11 flex-1 rounded-full border text-sm font-semibold transition-colors ${
                    underlyingCondition === v
                      ? "border-boy bg-boy text-white"
                      : "border-boy/15 text-boy hover:bg-linen"
                  }`}
                >
                  {v ? "Yes" : "No"}
                </button>
              ))}
            </div>
            {underlyingCondition && (
              <div className="mt-3">
                <label className="mb-1.5 block text-sm font-medium text-ink">
                  Please specify the condition:
                </label>
                <input
                  type="text"
                  value={underlyingConditionDetails}
                  onChange={(e) => setUnderlyingConditionDetails(e.target.value)}
                  placeholder="e.g. PCOS"
                  className="h-12 w-full rounded-xl border border-boy/15 bg-white px-4 text-sm text-ink outline-none focus:border-girl focus:ring-2 focus:ring-girl/20"
                />
              </div>
            )}
          </div>

          {/* Planned conception year */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">
              Planned year of conception
            </label>
            <input
              type="number"
              min={new Date().getFullYear()}
              max={new Date().getFullYear() + 5}
              value={plannedConceptionYear}
              onChange={(e) => setPlannedConceptionYear(Number(e.target.value))}
              className="h-12 w-full rounded-xl border border-boy/15 bg-white px-4 text-sm text-ink outline-none transition-colors focus:border-girl focus:ring-2 focus:ring-girl/20"
            />
          </div>

          {message && (
            <p
              className={`rounded-lg px-4 py-3 text-sm font-medium ${
                message.startsWith("Please")
                  ? "bg-red-50 text-red-600"
                  : "bg-girl/10 text-boy"
              }`}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="h-12 w-full rounded-full bg-boy text-sm font-semibold text-white transition-colors hover:bg-boy-deep disabled:opacity-60"
          >
            {submitting ? "Creating ticket…" : "Create consultation ticket"}
          </button>
        </form>

        {ticketCreated && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-boy/50 px-5 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-boy/10 bg-white p-8 shadow-xl text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="mt-4 font-display text-2xl font-semibold text-boy">
                Ticket created
              </h2>
              <p className="mt-2 text-sm text-slate-mist">
                Your consultation ticket has been submitted. You will be redirected to your dashboard.
              </p>
              <button
                onClick={() => router.push("/dashboard")}
                className="mt-6 h-12 w-full rounded-full bg-boy text-sm font-semibold text-white transition-colors hover:bg-boy-deep"
              >
                Go to dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
