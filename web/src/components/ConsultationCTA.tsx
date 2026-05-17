import { GiftIcon } from "./icons";

export default function ConsultationCTA() {
  return (
    <section className="bg-slate-50 px-6 pb-20 md:px-10 md:pb-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-start gap-6 rounded-2xl bg-violet-50 p-6 ring-1 ring-violet-100 md:flex-row md:items-center md:justify-between md:gap-8 md:p-8">
          <div className="flex items-start gap-4 md:items-center">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-violet-600 text-white shadow-md shadow-violet-300/50">
              <GiftIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-slate-900 md:text-2xl">
                Try a session with confidence
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-600 md:text-base">
                Book your first{" "}
                <span className="font-semibold text-violet-700">
                  15-minute consultation FREE
                </span>{" "}
                with any tutor.
                <br className="hidden sm:block" /> No obligation. Find the right
                fit for your learning journey.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-full bg-violet-600 px-7 py-3 text-sm font-semibold text-white shadow-md shadow-violet-300/50 transition hover:bg-violet-700 active:scale-[0.98]"
          >
            Find a Tutor
          </button>
        </div>
      </div>
    </section>
  );
}
