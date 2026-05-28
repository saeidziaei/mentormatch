export default function AdminDashboard() {
  const cards = [
    { label: "Pending Tutors", value: "—", note: "Awaiting review", href: "/admin/tutors" },
    { label: "Total Users", value: "—", note: "All time", href: "/admin/users" },
    { label: "Bookings This Month", value: "—", note: "Coming soon", href: "/admin/bookings" },
    { label: "Revenue This Month", value: "—", note: "Coming soon", href: null },
  ];

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl font-bold text-white">Dashboard</h1>
      <p className="mt-1 text-sm text-white/50">Overview of MentorMatch activity.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 shadow-lg"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
              {card.label}
            </p>
            <p className="mt-2 font-display text-3xl font-bold text-white">{card.value}</p>
            <p className="mt-1 text-xs text-white/40">{card.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
        <p className="text-sm text-white/40">
          Analytics and activity feeds coming soon.
        </p>
      </div>
    </div>
  );
}
