import type { ComponentType } from "react";
import { CalendarIcon, ChatBubblesIcon, SearchIcon } from "./icons";

type Step = {
  number: number;
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
};

const steps: Step[] = [
  {
    number: 1,
    icon: SearchIcon,
    title: "Search Tutors",
    description:
      "Find tutors based on subject, year level, availability and learning style.",
  },
  {
    number: 2,
    icon: ChatBubblesIcon,
    title: "Chat & Compare",
    description:
      "Message tutors (limited before booking) and compare profiles to find the right fit.",
  },
  {
    number: 3,
    icon: CalendarIcon,
    title: "Book Your Session",
    description:
      "Book and pay securely on the platform. Manage sessions with ease.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-slate-50 px-6 pb-16 pt-24 md:px-10 md:pb-20 md:pt-28">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center font-display text-3xl font-bold text-slate-900 md:text-4xl">
          How It Works
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-6">
          {steps.map((step, i) => (
            <div key={step.number} className="relative flex items-start gap-4">
              <div className="relative shrink-0">
                <div className="grid h-20 w-20 place-items-center rounded-full bg-white shadow-md ring-1 ring-slate-100">
                  <step.icon className="h-8 w-8 text-violet-600" />
                </div>
                <span className="absolute -right-1 -top-1 grid h-7 w-7 place-items-center rounded-full bg-violet-600 text-xs font-bold text-white shadow ring-2 ring-slate-50">
                  {step.number}
                </span>
              </div>
              <div className="pt-2">
                <h3 className="text-base font-semibold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                  {step.description}
                </p>
              </div>
              {i < steps.length - 1 && (
                <div
                  className="absolute left-20 top-10 hidden h-px w-16 bg-slate-200 md:block"
                  aria-hidden
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
