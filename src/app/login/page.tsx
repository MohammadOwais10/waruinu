import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <section className="relative isolate min-h-screen bg-linen flex items-center justify-center px-5 py-16">
      <div className="pointer-events-none absolute -right-32 -top-24 -z-10 h-[28rem] w-[28rem] rounded-full bg-girl/15 blur-[140px]" />
      <div className="pointer-events-none absolute -left-40 bottom-0 -z-10 h-[24rem] w-[24rem] rounded-full bg-boy/10 blur-[140px]" />

      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </section>
  );
}