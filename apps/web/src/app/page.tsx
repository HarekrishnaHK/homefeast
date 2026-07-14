import Link from "next/link";
import { Search, Star, ShieldCheck, Clock, Soup, ArrowRight } from "lucide-react";
import { TiffinStack } from "@/components/TiffinStack";
import { ProviderCard, ProviderCardData } from "@/components/ProviderCard";

const popularCooks: ProviderCardData[] = [
  {
    slug: "meera-ghar-ka-khana",
    businessName: "Meera's Ghar Ka Khana",
    city: "Bengaluru",
    cuisines: ["North Indian", "Punjabi"],
    avgRating: 4.8,
    totalReviews: 214,
    startingPrice: 90,
    foodType: "VEG",
    imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80",
  },
  {
    slug: "annapoorna-tiffins",
    businessName: "Annapoorna Tiffins",
    city: "Chennai",
    cuisines: ["South Indian", "Chettinad"],
    avgRating: 4.9,
    totalReviews: 312,
    startingPrice: 80,
    foodType: "VEG",
    imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&q=80",
  },
  {
    slug: "rahims-kitchen",
    businessName: "Rahim's Kitchen",
    city: "Hyderabad",
    cuisines: ["Mughlai", "Biryani"],
    avgRating: 4.7,
    totalReviews: 189,
    startingPrice: 120,
    foodType: "NON_VEG",
    imageUrl: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&q=80",
  },
  {
    slug: "the-bong-thali",
    businessName: "The Bong Thali",
    city: "Kolkata",
    cuisines: ["Bengali"],
    avgRating: 4.6,
    totalReviews: 145,
    startingPrice: 100,
    foodType: "MIXED",
    imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&q=80",
  },
];

const plans = [
  { type: "Daily", price: "₹80–150", desc: "Try before you commit. One meal at a time, cancel anytime.", color: "bg-turmeric" },
  { type: "Weekly", price: "₹500–950", desc: "A steady rhythm for the work week, with menu variety built in.", color: "bg-leaf-light" },
  { type: "Monthly", price: "₹1800–3200", desc: "The best value — and first pick of your cook's weekly specials.", color: "bg-leaf" },
];

const steps = [
  { n: "01", title: "Find your cook", desc: "Filter by cuisine, diet, price, and neighborhood to find a home cook near you." },
  { n: "02", title: "Pick a plan", desc: "Choose daily, weekly, or monthly — see the exact menu before you subscribe." },
  { n: "03", title: "Meals arrive", desc: "Your cook prepares and delivers fresh, home-cooked meals on schedule." },
  { n: "04", title: "Rate & repeat", desc: "Review your experience and auto-renew the plans you love." },
];

const testimonials = [
  { name: "Ananya R.", role: "Customer, Bengaluru", quote: "Finally, lunch that tastes like it came from my own kitchen — not a cloud kitchen.", rating: 5 },
  { name: "Vikram S.", role: "Customer, Pune", quote: "Switched from delivery apps to a monthly plan with a home cook. Better food, lower cost.", rating: 5 },
  { name: "Fatima K.", role: "Home cook, Hyderabad", quote: "HomeFeast let me turn my cooking into a real income without opening a restaurant.", rating: 5 },
];

const stats = [
  { value: "12,000+", label: "Meals delivered weekly" },
  { value: "850+", label: "Verified home cooks" },
  { value: "24", label: "Cities served" },
  { value: "4.7/5", label: "Average cook rating" },
];

export default function HomePage() {
  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden bg-leaf-gradient text-white">
        <div className="container-hf py-20 md:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block font-mono text-xs uppercase tracking-widest bg-white/10 px-3 py-1.5 rounded-full mb-6">
              Now in 24 cities
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] text-balance">
              Real home cooking, from a real home kitchen.
            </h1>
            <p className="mt-6 text-lg text-white/75 max-w-lg leading-relaxed">
              Skip the cloud kitchens. Subscribe to daily, weekly, or monthly tiffins
              made by verified home cooks in your neighborhood.
            </p>

            {/* Search bar */}
            <form action="/browse" className="mt-8 flex flex-col sm:flex-row gap-3 max-w-lg">
              <div className="flex-1 flex items-center gap-2 bg-white rounded-full px-5 py-3.5 shadow-soft">
                <Search size={18} className="text-ink/40 shrink-0" />
                <input
                  name="q"
                  type="text"
                  placeholder="Search by cuisine, cook, or neighborhood"
                  className="w-full bg-transparent text-ink text-sm placeholder:text-ink/40 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="bg-turmeric text-ink font-semibold px-6 py-3.5 rounded-full hover:bg-turmeric-deep transition-colors shadow-soft shrink-0"
              >
                Find a cook
              </button>
            </form>

            <div className="mt-8 flex items-center gap-6 text-sm text-white/60">
              <span className="flex items-center gap-1.5"><ShieldCheck size={16} /> FSSAI verified</span>
              <span className="flex items-center gap-1.5"><Clock size={16} /> On-time delivery</span>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="w-56 sm:w-64">
              <TiffinStack />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- POPULAR COOKS ---------- */}
      <section className="py-20">
        <div className="container-hf">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-clay">Loved this week</span>
              <h2 className="font-display text-3xl font-semibold mt-2">Popular home cooks</h2>
            </div>
            <Link href="/browse" className="hidden sm:flex items-center gap-1 text-sm font-medium text-leaf hover:text-leaf-deep">
              View all <ArrowRight size={15} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularCooks.map((cook) => (
              <ProviderCard key={cook.slug} provider={cook} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FEATURED PLANS ---------- */}
      <section className="py-20 bg-paperDim">
        <div className="container-hf">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-clay">Choose your rhythm</span>
            <h2 className="font-display text-3xl font-semibold mt-2">Featured meal plans</h2>
            <p className="mt-3 text-ink/60">Every plan mirrors the tiffin stack — start small, or commit for the best value.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {plans.map((plan) => (
              <div key={plan.type} className="bg-white rounded-2xl p-6 shadow-card border border-ink/8">
                <span className={`inline-block h-2.5 w-10 rounded-full ${plan.color} mb-4`} />
                <h3 className="font-display text-xl font-semibold">{plan.type}</h3>
                <p className="text-2xl font-semibold mt-2">{plan.price}</p>
                <p className="text-sm text-ink/60 mt-3 leading-relaxed">{plan.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- WHY CHOOSE HOMEFEAST ---------- */}
      <section className="py-20">
        <div className="container-hf grid md:grid-cols-3 gap-8">
          {[
            { icon: ShieldCheck, title: "Verified cooks", desc: "Every provider is FSSAI-checked and manually approved before they can list a menu." },
            { icon: Soup, title: "Actually homemade", desc: "No commercial kitchens — meals are cooked in home kitchens, the way they're meant to be." },
            { icon: Clock, title: "Reliable delivery", desc: "Cooks set their own delivery windows, so you always know when to expect your tiffin." },
          ].map((item) => (
            <div key={item.title} className="flex flex-col items-start">
              <div className="h-12 w-12 rounded-xl bg-leaf/10 flex items-center justify-center mb-4">
                <item.icon size={22} className="text-leaf" />
              </div>
              <h3 className="font-display text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-ink/60 mt-2 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- HOW IT WORKS ---------- */}
      <section className="py-20 bg-leaf-deep text-white">
        <div className="container-hf">
          <div className="mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-turmeric">The process</span>
            <h2 className="font-display text-3xl font-semibold mt-2">How it works</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.n} className="border-t border-white/15 pt-5">
                <span className="font-mono text-sm text-turmeric">{step.n}</span>
                <h3 className="font-display text-lg font-semibold mt-2">{step.title}</h3>
                <p className="text-sm text-white/60 mt-2 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- REVIEWS ---------- */}
      <section className="py-20">
        <div className="container-hf">
          <div className="mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-clay">What people say</span>
            <h2 className="font-display text-3xl font-semibold mt-2">Customer reviews</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 shadow-card border border-ink/8">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} className="fill-turmeric text-turmeric" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-ink/80">"{t.quote}"</p>
                <p className="text-sm font-semibold mt-4">{t.name}</p>
                <p className="text-xs text-ink/50">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- STATISTICS ---------- */}
      <section className="py-16 bg-paperDim">
        <div className="container-hf grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-display text-3xl sm:text-4xl font-semibold text-leaf">{s.value}</p>
              <p className="text-sm text-ink/60 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- BECOME A COOK CTA ---------- */}
      <section className="py-20">
        <div className="container-hf">
          <div className="bg-leaf-gradient rounded-3xl px-8 py-14 sm:px-16 text-center text-white relative overflow-hidden">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold max-w-xl mx-auto text-balance">
              Cook at home? Turn it into a business.
            </h2>
            <p className="mt-4 text-white/70 max-w-md mx-auto">
              Set your own menu, prices, and delivery hours. HomeFeast handles discovery, subscriptions, and payments.
            </p>
            <Link
              href="/register?role=cook"
              className="inline-flex items-center gap-2 mt-8 bg-turmeric text-ink font-semibold px-7 py-3.5 rounded-full hover:bg-turmeric-deep transition-colors shadow-soft"
            >
              Become a home cook <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
