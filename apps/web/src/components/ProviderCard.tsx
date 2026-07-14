import Link from "next/link";
import { Star, MapPin } from "lucide-react";

export interface ProviderCardData {
  slug: string;
  businessName: string;
  city: string;
  cuisines: string[];
  avgRating: number;
  totalReviews: number;
  startingPrice: number;
  foodType: "VEG" | "NON_VEG" | "MIXED";
  imageUrl: string;
}

const foodTypeDot: Record<ProviderCardData["foodType"], string> = {
  VEG: "bg-leaf",
  NON_VEG: "bg-paprika",
  MIXED: "bg-turmeric",
};

export function ProviderCard({ provider }: { provider: ProviderCardData }) {
  return (
    <Link
      href={`/provider/${provider.slug}`}
      className="group block rounded-2xl bg-white/60 border border-ink/8 overflow-hidden shadow-card hover:shadow-soft hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative h-44 overflow-hidden bg-paperDim">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={provider.imageUrl}
          alt={`Food from ${provider.businessName}`}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span
          className={`absolute top-3 left-3 h-3 w-3 rounded-full ring-2 ring-white ${foodTypeDot[provider.foodType]}`}
          aria-label={provider.foodType}
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-semibold leading-tight">{provider.businessName}</h3>
          <div className="flex items-center gap-1 shrink-0 text-sm font-medium">
            <Star size={14} className="fill-turmeric text-turmeric" />
            {provider.avgRating.toFixed(1)}
          </div>
        </div>
        <p className="text-sm text-ink/60 mt-1">{provider.cuisines.join(" · ")}</p>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-ink/8">
          <span className="flex items-center gap-1 text-xs text-ink/50">
            <MapPin size={13} /> {provider.city}
          </span>
          <span className="text-sm font-semibold">
            ₹{provider.startingPrice}<span className="text-ink/50 font-normal">/meal</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
