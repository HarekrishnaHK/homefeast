import { Star, MapPin, Clock, ShieldCheck } from "lucide-react";

// In production this is fetched from GET /api/cooks/:slug (see apps/api/src/controllers/cookController.ts)
const provider = {
  businessName: "Meera's Ghar Ka Khana",
  city: "Bengaluru · Indiranagar",
  bio: "Home-style North Indian thalis made fresh every afternoon, the way my mother taught me — minimal oil, maximum flavor.",
  avgRating: 4.8,
  totalReviews: 214,
  deliveryWindow: "12:00 PM – 2:00 PM",
  cuisines: ["North Indian", "Punjabi"],
  coverImageUrl: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=1200&q=80",
  menus: [
    {
      name: "Classic Veg Thali",
      planType: "DAILY",
      price: 90,
      items: ["2 Roti", "Dal Tadka", "Seasonal Sabzi", "Rice", "Salad"],
    },
    {
      name: "Weekly Thali Pass",
      planType: "WEEKLY",
      price: 560,
      items: ["6 meals/week", "Rotating sabzi menu", "Free delivery"],
    },
    {
      name: "Monthly Family Plan",
      planType: "MONTHLY",
      price: 2100,
      items: ["26 meals/month", "Sunday special thali", "Priority delivery slot"],
    },
  ],
  reviews: [
    { name: "Rohit M.", rating: 5, comment: "Tastes exactly like home. The dal is unbeatable." },
    { name: "Priya D.", rating: 5, comment: "Never missed a delivery window in 3 months of subscribing." },
    { name: "Ken A.", rating: 4, comment: "Great food, wish there were more spice-level options." },
  ],
};

export default async function ProviderDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <div>
      <div className="relative h-64 sm:h-80 bg-paperDim">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={provider.coverImageUrl} alt={provider.businessName} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
      </div>

      <div className="container-hf -mt-16 relative pb-20">
        <div className="bg-white rounded-2xl shadow-soft border border-ink/8 p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-semibold">{provider.businessName}</h1>
              <p className="text-ink/60 mt-1 flex items-center gap-1 text-sm">
                <MapPin size={14} /> {provider.city}
              </p>
            </div>
            <div className="flex items-center gap-1 text-lg font-semibold">
              <Star size={18} className="fill-turmeric text-turmeric" />
              {provider.avgRating}
              <span className="text-sm font-normal text-ink/50">({provider.totalReviews} reviews)</span>
            </div>
          </div>

          <p className="mt-5 text-ink/70 leading-relaxed max-w-2xl">{provider.bio}</p>

          <div className="flex flex-wrap gap-6 mt-6 text-sm text-ink/60">
            <span className="flex items-center gap-1.5"><Clock size={15} /> Delivery: {provider.deliveryWindow}</span>
            <span className="flex items-center gap-1.5"><ShieldCheck size={15} /> FSSAI verified</span>
            <span>{provider.cuisines.join(" · ")}</span>
          </div>
        </div>

        {/* Menus / Plans */}
        <div className="mt-12">
          <h2 className="font-display text-2xl font-semibold mb-6">Menus & plans</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {provider.menus.map((menu) => (
              <div key={menu.name} className="bg-white rounded-2xl p-6 border border-ink/8 shadow-card flex flex-col">
                <span className="font-mono text-[11px] uppercase tracking-widest text-clay">{menu.planType}</span>
                <h3 className="font-display text-lg font-semibold mt-1">{menu.name}</h3>
                <p className="text-2xl font-semibold mt-3">₹{menu.price}</p>
                <ul className="mt-4 space-y-1.5 text-sm text-ink/60 flex-1">
                  {menu.items.map((item) => (
                    <li key={item}>· {item}</li>
                  ))}
                </ul>
                <button className="mt-5 w-full bg-leaf text-white text-sm font-semibold py-2.5 rounded-full hover:bg-leaf-deep transition-colors">
                  Subscribe
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-14">
          <h2 className="font-display text-2xl font-semibold mb-6">Reviews</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {provider.reviews.map((r) => (
              <div key={r.name} className="bg-paperDim rounded-2xl p-5">
                <div className="flex gap-0.5 mb-2">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} size={13} className="fill-turmeric text-turmeric" />
                  ))}
                </div>
                <p className="text-sm text-ink/80">{r.comment}</p>
                <p className="text-xs text-ink/50 mt-3">{r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
