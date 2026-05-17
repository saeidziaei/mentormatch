import { Button } from "./Button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
        <div className="flex flex-col gap-6">
          <span className="inline-flex w-fit items-center rounded-full bg-primary-light px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">
            Sydney K–12 tutoring
          </span>

          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-dark md:text-6xl">
            Find the right tutor for{" "}
            <em className="text-primary not-italic md:italic">better results</em>,
            more confidence, and less stress.
          </h1>

          <p className="max-w-lg text-base text-muted md:text-lg">
            Verified Sydney tutors for primary, high school, and HSC students —
            online or in-person, on your schedule.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">Find a tutor</Button>
            <Button variant="secondary">Become a tutor</Button>
          </div>

          <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted">
            <div>
              <dt className="sr-only">Verified tutors</dt>
              <dd>
                <span className="font-display text-xl font-semibold text-dark">
                  100%
                </span>{" "}
                verified tutors
              </dd>
            </div>
            <div>
              <dt className="sr-only">Average rating</dt>
              <dd>
                <span className="font-display text-xl font-semibold text-dark">
                  4.9★
                </span>{" "}
                average rating
              </dd>
            </div>
            <div>
              <dt className="sr-only">Format</dt>
              <dd>Online · In-person</dd>
            </div>
          </dl>
        </div>

        <div className="relative">
          <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl bg-primary-light ring-1 ring-black/5">
            {/* Replace with editorial tutor portrait. Soft tinted bg acts as a placeholder. */}
          </div>
          <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-white p-4 shadow-lg ring-1 ring-black/5 md:block">
            <p className="text-xs uppercase tracking-[0.18em] text-muted">
              Next available
            </p>
            <p className="mt-1 font-display text-lg font-semibold text-dark">
              Tomorrow, 4:00pm
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
