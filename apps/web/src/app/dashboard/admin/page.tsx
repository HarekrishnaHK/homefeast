import { LayoutDashboard, Users, ChefHat, Package, Repeat, AlertCircle, Tag, BarChart3, Settings } from "lucide-react";
import { DashboardShell, StatCard } from "@/components/DashboardShell";

const navItems = [
  { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/admin/users", label: "Users", icon: Users },
  { href: "/dashboard/admin/cooks", label: "Home cooks", icon: ChefHat },
  { href: "/dashboard/admin/orders", label: "Orders", icon: Package },
  { href: "/dashboard/admin/subscriptions", label: "Subscriptions", icon: Repeat },
  { href: "/dashboard/admin/complaints", label: "Complaints", icon: AlertCircle },
  { href: "/dashboard/admin/categories", label: "Categories", icon: Tag },
  { href: "/dashboard/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/admin/settings", label: "Settings", icon: Settings },
];

// In production: GET /api/admin/stats, GET /api/admin/cooks?status=PENDING
const pendingCooks = [
  { name: "Lakshmi's Tiffin Service", city: "Coimbatore", appliedDate: "Jul 10, 2026" },
  { name: "Punjabi Rasoi", city: "Delhi", appliedDate: "Jul 9, 2026" },
  { name: "Konkan Kitchen", city: "Mumbai", appliedDate: "Jul 8, 2026" },
];

export default function AdminDashboardPage() {
  return (
    <DashboardShell title="Overview" navItems={navItems} activeHref="/dashboard/admin">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total users" value="24,180" />
        <StatCard label="Approved cooks" value="852" />
        <StatCard label="Active subscriptions" value="6,340" />
        <StatCard label="Monthly revenue" value="₹41.2L" />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <StatCard label="Order conversion rate" value="68%" />
        <StatCard label="Customer retention" value="74%" />
        <StatCard label="Open complaints" value="12" />
      </div>

      <div className="bg-white rounded-2xl border border-ink/8 shadow-card">
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink/8">
          <h2 className="font-display text-lg font-semibold">Pending cook approvals</h2>
        </div>
        <ul className="divide-y divide-ink/8">
          {pendingCooks.map((c) => (
            <li key={c.name} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="text-sm font-medium">{c.name}</p>
                <p className="text-xs text-ink/50 mt-0.5">{c.city} · Applied {c.appliedDate}</p>
              </div>
              <div className="flex gap-2">
                <button className="text-xs font-semibold bg-leaf text-white px-4 py-2 rounded-full hover:bg-leaf-deep transition-colors">
                  Approve
                </button>
                <button className="text-xs font-semibold border border-ink/15 px-4 py-2 rounded-full hover:bg-paperDim transition-colors">
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </DashboardShell>
  );
}
