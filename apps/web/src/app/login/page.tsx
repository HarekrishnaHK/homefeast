import Link from "next/link";
import { TiffinMark } from "@/components/TiffinStack";

export default function LoginPage() {
  return (
    <div className="container-hf py-20 flex justify-center">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <TiffinMark className="scale-125" />
        </div>
        <h1 className="font-display text-2xl font-semibold text-center">Welcome back</h1>
        <p className="text-center text-ink/60 text-sm mt-2">Log in to manage your orders and subscriptions.</p>

        <form className="mt-8 space-y-4" action="/api/auth/login" method="POST">
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
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1.5 w-full rounded-xl border border-ink/15 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-leaf"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-leaf text-white font-semibold py-3 rounded-full hover:bg-leaf-deep transition-colors"
          >
            Log in
          </button>
        </form>

        <p className="text-center text-sm text-ink/60 mt-6">
          New to HomeFeast?{" "}
          <Link href="/register" className="text-leaf font-medium hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
