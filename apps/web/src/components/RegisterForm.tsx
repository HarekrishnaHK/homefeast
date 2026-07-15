"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

interface RegisterResponse {
  user: { id: string; name: string; email: string; role: "CUSTOMER" | "COOK" | "ADMIN" };
  accessToken: string;
}

export function RegisterForm({ isCook }: { isCook: boolean }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name") as string,
      email: form.get("email") as string,
      city: form.get("city") as string,
      password: form.get("password") as string,
      role: isCook ? "COOK" : "CUSTOMER",
    };

    try {
      const data = await apiFetch<RegisterResponse>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      localStorage.setItem("hf_access_token", data.accessToken);
      localStorage.setItem("hf_user", JSON.stringify(data.user));

      if (data.user.role === "COOK") router.push("/dashboard/cook");
      else router.push("/dashboard/customer");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
          {error}
        </div>
      )}
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
        disabled={loading}
        className="w-full bg-leaf text-white font-semibold py-3 rounded-full hover:bg-leaf-deep transition-colors disabled:opacity-60"
      >
        {loading ? "Submitting..." : isCook ? "Submit cook application" : "Create account"}
      </button>
    </form>
  );
}