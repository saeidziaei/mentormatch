import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  children: ReactNode;
}

export function Card({
  interactive = false,
  className = "",
  children,
  ...rest
}: CardProps) {
  const hover = interactive
    ? "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
    : "";
  return (
    <div
      className={`rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 ${hover} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
