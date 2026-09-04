import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "outline" | "light";

const styles: Record<Variant, string> = {
  primary:
    "bg-boy text-white hover:bg-boy-deep focus-visible:outline-boy",
  outline:
    "border border-boy/25 text-boy hover:border-boy hover:bg-boy/5 focus-visible:outline-boy",
  light:
    "bg-white text-boy-deep hover:bg-white/90 focus-visible:outline-white",
};

interface ButtonProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
}

export default function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: ButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex h-12 items-center justify-center rounded-full px-7 text-sm font-semibold transition-colors ${styles[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
