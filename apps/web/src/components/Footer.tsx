import Link from "next/link";
import { TiffinMark } from "./TiffinStack";

const columns = [
  {
    title: "Customers",
    links: [
      { href: "/browse", label: "Find a home cook" },
      { href: "/pricing", label: "Plans & pricing" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Home cooks",
    links: [
      { href: "/register?role=cook", label: "Become a cook" },
      { href: "/dashboard/cook", label: "Cook dashboard" },
      { href: "/faq", label: "Cook guidelines" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About us" },
      { href: "/contact", label: "Contact" },
      { href: "/faq", label: "Help center" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-leaf-deep text-white/90">
      <div className="container-hf py-16 grid grid-cols-2 md:grid-cols-5 gap-10">
        <div className="col-span-2">
          <div className="flex items-center gap-2.5 mb-4">
            <TiffinMark />
            <span className="font-display text-xl font-semibold text-white">HomeFeast</span>
          </div>
          <p className="text-sm text-white/60 max-w-xs leading-relaxed">
            Homemade meals from verified cooks in your neighborhood — delivered daily, weekly, or monthly.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="font-mono text-xs uppercase tracking-widest text-turmeric mb-4">
              {col.title}
            </h4>
            <ul className="space-y-3">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-white/70 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="container-hf py-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/50">
          <span>© {new Date().getFullYear()} HomeFeast. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white/80">Privacy</Link>
            <Link href="/terms" className="hover:text-white/80">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
