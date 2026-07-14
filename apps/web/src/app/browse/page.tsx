import { Search, SlidersHorizontal } from "lucide-react";
import { ProviderCard, ProviderCardData } from "@/components/ProviderCard";

// In production this list comes from GET /api/cooks with query params for
// city, cuisine, foodType, planType, and price range (see apps/api/src/controllers/cookController.ts)
const allCooks: ProviderCardData[] = [
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
  {
    slug: "gujju-rasoi",
    businessName: "Gujju Rasoi",
    city: "Ahmedabad",
    cuisines: ["Gujarati"],
    avgRating: 4.9,
    totalReviews: 402,
    startingPrice: 85,
    foodType: "VEG",
    imageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&q=80",
  },
  {
    slug: "maharashtrian-thali-house",
    businessName: "Maharashtrian Thali House",
    city: "Pune",
    cuisines: ["Maharashtrian"],
    avgRating: 4.5,
    totalReviews: 98,
    startingPrice: 95,
    foodType: "VEG",
    imageUrl: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=600&q=80",
  },
];

const filterGroups = [
  { label: "Diet", options: ["Veg", "Non-Veg", "Egg", "Vegan"] },
  { label: "Plan", options: ["Daily", "Weekly", "Monthly"] },
  { label: "Cuisine", options: ["North Indian", "South Indian", "Bengali", "Gujarati", "Mughlai"] },
];

export default function BrowsePage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  return (
    <div className="container-hf py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold">Find a home cook</h1>
        <p className="text-ink/60 mt-2">
          {searchParams?.q ? `Results for "${searchParams.q}"` : "Browse verified home cooks and tiffin providers near you."}
        </p>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <div className="flex-1 flex items-center gap-2 bg-white rounded-full px-5 py-3 border border-ink/10">
          <Search size={17} className="text-ink/40" />
          <input
            defaultValue={searchParams?.q}
            placeholder="Search by cuisine, cook, or neighborhood"
            className="w-full bg-transparent text-sm focus:outline-none"
          />
        </div>
        <button className="flex items-center gap-2 border border-ink/10 bg-white px-4 py-3 rounded-full text-sm font-medium">
          <SlidersHorizontal size={15} /> Filters
        </button>
      </div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-10">
        <aside className="hidden lg:block space-y-8">
          {filterGroups.map((group) => (
            <div key={group.label}>
              <h4 className="font-mono text-xs uppercase tracking-widest text-clay mb-3">{group.label}</h4>
              <div className="space-y-2">
                {group.options.map((opt) => (
                  <label key={opt} className="flex items-center gap-2 text-sm text-ink/70">
                    <input type="checkbox" className="rounded border-ink/20 text-leaf focus:ring-leaf" />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </aside>

        <div>
          <p className="text-sm text-ink/50 mb-4">{allCooks.length} providers found</p>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {allCooks.map((cook) => (
              <ProviderCard key={cook.slug} provider={cook} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
