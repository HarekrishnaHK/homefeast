import { TiffinStack } from "@/components/TiffinStack";

const tiers = [
  { name: "Daily", price: "₹80–150", desc: "Pay per meal. Perfect for trying a new cook.", features: ["No commitment", "Cancel anytime", "Same-day delivery"] },
  { name: "Weekly", price: "₹500–950", desc: "A full work week of meals at a lower per-meal cost.", features: ["6–7 meals", "Menu rotation", "Free delivery"] },
  { name: "Monthly", price: "₹1800–3200", desc: "The best value, with priority delivery slots.", features: ["26+ meals", "Priority slots", "Sunday specials included"] },
];

export default function PricingPage() {
  return (
    <div className="container-hf py-20">
      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-clay">Pricing</span>
          <h1 className="font-display text-4xl font-semibold mt-3">
            Prices are set by each home cook — this is the typical range.
          </h1>
          <p className="mt-4 text-ink/60">
            Exact pricing varies by cook, city, and menu. You'll always see the
            final price before you subscribe.
          </p>
        </div>
        <div className="flex justify-center">
          <div className="w-48"><TiffinStack /></div>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        {tiers.map((tier) => (
          <div key={tier.name} className="bg-white rounded-2xl p-6 border border-ink/8 shadow-card">
            <h3 className="font-display text-xl font-semibold">{tier.name}</h3>
            <p className="text-2xl font-semibold mt-2">{tier.price}</p>
            <p className="text-sm text-ink/60 mt-2">{tier.desc}</p>
            <ul className="mt-5 space-y-2 text-sm text-ink/70">
              {tier.features.map((f) => (
                <li key={f}>· {f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
