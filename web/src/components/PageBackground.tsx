import type { ReactNode } from "react";

export default function PageBackground({ children }: { children: ReactNode }) {
  return (
    <section className="relative flex-1 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/wavysea.jpg')" }}
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-br from-indigo-900/95 via-indigo-800/90 to-indigo-950/95"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(139,92,246,0.25),transparent_55%)]"
        aria-hidden
      />
      <div className="relative z-10">{children}</div>
    </section>
  );
}
