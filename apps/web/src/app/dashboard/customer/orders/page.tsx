"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Package, Repeat, Heart, Star, Settings } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { apiFetch } from "@/lib/api";

const navItems = [
  { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/customer/orders", label: "Orders", icon: Package },
  { href: "/dashboard/customer/subscriptions", label: "Subscriptions", icon: Repeat },
  { href: "/dashboard/customer/saved", label: "Saved providers", icon: Heart },
  { href: "/dashboard/customer/reviews", label: "Reviews", icon: Star },
  { href: "/dashboard/customer/settings", label: "Settings", icon: Settings },
];

interface OrderItem {
  id: string;
  quantity: number;
  menu: { name: string };
}
interface Order {
  id: string;
  status: string;
  totalAmount: string;
  deliveryDate: string;
  cook: { businessName: string };
  items: OrderItem[];
}

export default function CustomerOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("hf_access_token");
    if (!token) {
      router.push("/login");
      return;
    }
    apiFetch<{ data: Order[] }>("/api/orders", { accessToken: token })
      .then((res) => setOrders(res.data))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load orders"));
  }, [router]);

  return (
    <DashboardShell title="Orders" navItems={navItems} activeHref="/dashboard/customer/orders">
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 mb-6">
          {error}
        </div>
      )}

      {!orders && !error && <p className="text-sm text-ink/50">Loading orders...</p>}

      {orders && orders.length === 0 && (
        <p className="text-sm text-ink/50">You haven't placed any orders yet.</p>
      )}

      {orders && orders.length > 0 && (
        <div className="bg-white rounded-2xl border border-ink/8 shadow-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink/50 text-xs uppercase tracking-wide">
                <th className="px-6 py-3 font-medium">Order</th>
                <th className="px-6 py-3 font-medium">Cook</th>
                <th className="px-6 py-3 font-medium">Items</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Delivery</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-ink/8">
                  <td className="px-6 py-4 font-medium">#{o.id.slice(-6)}</td>
                  <td className="px-6 py-4 text-ink/70">{o.cook.businessName}</td>
                  <td className="px-6 py-4 text-ink/70">
                    {o.items.map((i) => `${i.quantity}× ${i.menu.name}`).join(", ")}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-leaf/10 text-leaf">
                      {o.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-ink/70">₹{o.totalAmount}</td>
                  <td className="px-6 py-4 text-ink/50">
                    {new Date(o.deliveryDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardShell>
  );
}