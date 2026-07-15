"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TiffinMark } from "@/components/TiffinStack";
import { apiFetch } from "@/lib/api";

interface LoginResponse {
  user: { id: string; name: string; email: string; role: "CUSTOMER" | "COOK" | "ADMIN" };
  accessToken: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await apiFetch<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem("hf_access_token", data.accessToken);
      localStorage.setItem("hf_user", JSON.stringify(data.user));

      if (data.user.role === "COOK") router.push("/dashboard/cook");
      else if (data.user.role === "ADMIN") router.push("/dashboard/admin");
      else router.push("/dashboard/customer");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-hf py-20 flex justify-center">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <TiffinMark className="scale-125" />
        </div>
        <h1 className="font-display text-2xl font-semibold text-center">Welcome back</h1>
        <p className="text-center text-ink/60 text-sm mt-2">Log in to manage your orders and subscriptions.</p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-ink/15 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-leaf"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-leaf text-white font-semibold py-3 rounded-full hover:bg-leaf-deep transition-colors disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log in"}
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