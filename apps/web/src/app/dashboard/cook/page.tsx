import { LayoutDashboard, UtensilsCrossed, Package, Repeat, Wallet, BarChart3, Star, Settings } from "lucide-react";
import { DashboardShell, StatCard } from "@/components/DashboardShell";

const navItems = [
  { href: "/dashboard/cook", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/cook/menu", label: "Menu management", icon: UtensilsCrossed },
  { href: "/dashboard/cook/orders", label: "Orders", icon: Package },
  { href: "/dashboard/cook/subscriptions", label: "Subscriptions", icon: Repeat },
  { href: "/dashboard/cook/earnings", label: "Earnings", icon: Wallet },
  { href: "/dashboard/cook/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/cook/reviews", label: "Reviews", icon: Star },
  { href: "/dashboard/cook/settings", label: "Settings", icon: Settings },
];

// In production: GET /api/orders (role=COOK), GET /api/cooks/me
const pendingOrders = [
  { id: "ORD-9021", customer: "Ananya R.", plan: "Weekly Thali Pass", time: "Requested 4 min ago" },
  { id: "ORD-9019", customer: "Ken A.", plan: "Classic Veg Thali", time: "Requested 22 min ago" },
];

export default function CookDashboardPage() {
  return (
    <DashboardShell title="Overview" navItems={navItems} activeHref="/dashboard/cook">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Orders today" value="34" />
        <StatCard label="Active subscribers" value="112" />
        <StatCard label="This month's earnings" value="₹68,400" />
        <StatCard label="Avg. rating" value="4.8" hint="214 reviews" />
      </div>

      <div className="bg-white rounded-2xl border border-ink/8 shadow-card">
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink/8">
          <h2 className="font-display text-lg font-semibold">Orders awaiting response</h2>
        </div>
        <ul className="divide-y divide-ink/8">
          {pendingOrders.map((o) => (
            <li key={o.id} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="text-sm font-medium">{o.customer} · {o.plan}</p>
                <p className="text-xs text-ink/50 mt-0.5">{o.id} · {o.time}</p>
              </div>
              <div className="flex gap-2">
                <button className="text-xs font-semibold bg-leaf text-white px-4 py-2 rounded-full hover:bg-leaf-deep transition-colors">
                  Accept
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
