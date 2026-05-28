import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/auth";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: "▦", end: true },
  { to: "/admin/tutors", label: "Tutors", icon: "🎓", end: false },
  { to: "/admin/users", label: "Users", icon: "👥", end: false },
  { to: "/admin/bookings", label: "Bookings", icon: "📅", end: false },
];

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/signin");
  };

  return (
    <div className="flex min-h-screen bg-[#0b0a2a] font-body">
      {/* Sidebar */}
      <aside className="flex w-60 shrink-0 flex-col border-r border-white/10 bg-white/[0.03]">
        {/* Brand */}
        <div className="flex h-16 items-center gap-2.5 border-b border-white/10 px-5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500 text-sm font-bold text-white shadow-lg shadow-violet-900/40">
            M
          </div>
          <span className="font-display text-base font-semibold tracking-tight text-white">
            MentorMatch
          </span>
          <span className="ml-auto rounded-full bg-violet-500/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-violet-300">
            Admin
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 p-3">
          {NAV_ITEMS.map(({ to, label, icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-violet-500/20 text-violet-200"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <span className="text-base leading-none">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="border-t border-white/10 p-3">
          <div className="flex items-center gap-3 rounded-xl px-3 py-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-500/30 text-xs font-bold text-violet-200">
              {user?.email?.[0]?.toUpperCase() ?? "A"}
            </div>
            <span className="min-w-0 flex-1 truncate text-xs text-white/60">
              {user?.email}
            </span>
          </div>
          <button
            onClick={handleSignOut}
            className="mt-1 w-full rounded-xl px-3 py-2 text-left text-xs font-medium text-white/40 transition hover:bg-white/5 hover:text-white/70"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
