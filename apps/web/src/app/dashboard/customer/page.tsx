import { LayoutDashboard, Package, Repeat, Heart, Star, Settings } from "lucide-react";
import { DashboardShell, StatCard } from "@/components/DashboardShell";

const navItems = [
  { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/customer/orders", label: "Orders", icon: Package },
  { href: "/dashboard/customer/subscriptions", label: "Subscriptions", icon: Repeat },
  { href: "/dashboard/customer/saved", label: "Saved providers", icon: Heart },
  { href: "/dashboard/customer/reviews", label: "Reviews", icon: Star },
  { href: "/dashboard/customer/settings", label: "Settings", icon: Settings },
];

// In production: GET /api/orders, GET /api/subscriptions for the logged-in customer
const recentOrders = [
  { id: "ORD-8841", cook: "Meera's Ghar Ka Khana", status: "Out for delivery", date: "Today, 12:30 PM" },
  { id: "ORD-8790", cook: "Annapoorna Tiffins", status: "Delivered", date: "Yesterday, 1:00 PM" },
  { id: "ORD-8712", cook: "Rahim's Kitchen", status: "Delivered", date: "Jul 8, 8:00 PM" },
];

export default function CustomerDashboardPage() {
  return (
    <DashboardShell title="Overview" navItems={navItems} activeHref="/dashboard/customer">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Active subscriptions" value="2" />
        <StatCard label="Orders this month" value="18" />
        <StatCard label="Saved providers" value="5" />
        <StatCard label="Reviews written" value="9" />
      </div>

      <div className="bg-white rounded-2xl border border-ink/8 shadow-card">
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink/8">
          <h2 className="font-display text-lg font-semibold">Recent orders</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink/50 text-xs uppercase tracking-wide">
              <th className="px-6 py-3 font-medium">Order</th>
              <th className="px-6 py-3 font-medium">Cook</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((o) => (
              <tr key={o.id} className="border-t border-ink/8">
                <td className="px-6 py-4 font-medium">{o.id}</td>
                <td className="px-6 py-4 text-ink/70">{o.cook}</td>
                <td className="px-6 py-4">
                  <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-leaf/10 text-leaf">
                    {o.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-ink/50">{o.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
