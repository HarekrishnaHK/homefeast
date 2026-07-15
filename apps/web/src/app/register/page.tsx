import Link from "next/link";
import { TiffinMark } from "@/components/TiffinStack";

export default async function RegisterPage({
     searchParams,
   }: {
     searchParams?: Promise<{ role?: string }>;
   }) {
     const params = await searchParams;
     const isCook = params?.role === "cook";

  return (
    <div className="container-hf py-20 flex justify-center">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <TiffinMark className="scale-125" />
        </div>
        <h1 className="font-display text-2xl font-semibold text-center">
          {isCook ? "Register as a home cook" : "Create your account"}
        </h1>
        <p className="text-center text-ink/60 text-sm mt-2">
          {isCook
            ? "Join HomeFeast and start selling your homemade meals."
            : "Discover home-cooked meals from verified cooks near you."}
        </p>

        <div className="flex mt-6 rounded-full bg-paperDim p-1 text-sm font-medium">
          <Link
            href="/register"
            className={`flex-1 text-center py-2 rounded-full transition-colors ${!isCook ? "bg-white shadow-card" : "text-ink/60"}`}
          >
            I'm a customer
          </Link>
          <Link
            href="/register?role=cook"
            className={`flex-1 text-center py-2 rounded-full transition-colors ${isCook ? "bg-white shadow-card" : "text-ink/60"}`}
          >
            I'm a home cook
          </Link>
        </div>

        <form className="mt-8 space-y-4" action="/api/auth/register" method="POST">
          <input type="hidden" name="role" value={isCook ? "COOK" : "CUSTOMER"} />
          <div>
            <label htmlFor="name" className="text-sm font-medium">Full name</label>
            <input
              id="name"
              name="name"
              required
              className="mt-1.5 w-full rounded-xl border border-ink/15 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-leaf"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1.5 w-full rounded-xl border border-ink/15 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-leaf"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="city" className="text-sm font-medium">City</label>
            <input
              id="city"
              name="city"
              required
              className="mt-1.5 w-full rounded-xl border border-ink/15 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-leaf"
              placeholder="Bengaluru"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              className="mt-1.5 w-full rounded-xl border border-ink/15 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-leaf"
              placeholder="At least 8 characters"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-leaf text-white font-semibold py-3 rounded-full hover:bg-leaf-deep transition-colors"
          >
            {isCook ? "Submit cook application" : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm text-ink/60 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-leaf font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
