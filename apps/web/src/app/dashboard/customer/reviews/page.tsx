import { LayoutDashboard, Package, Repeat, Heart, Star, Settings } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";

const navItems = [
  { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/customer/orders", label: "Orders", icon: Package },
  { href: "/dashboard/customer/subscriptions", label: "Subscriptions", icon: Repeat },
  { href: "/dashboard/customer/saved", label: "Saved providers", icon: Heart },
  { href: "/dashboard/customer/reviews", label: "Reviews", icon: Star },
  { href: "/dashboard/customer/settings", label: "Settings", icon: Settings },
];

export default function ReviewsPage() {
  return (
    <DashboardShell title="Reviews" navItems={navItems} activeHref="/dashboard/customer/reviews">
      <div className="bg-white rounded-2xl border border-ink/8 shadow-card p-8 text-center">
        <p className="text-sm text-ink/60">
          Your written reviews will appear here. This section is coming soon.
        </p>
      </div>
    </DashboardShell>
  );
}