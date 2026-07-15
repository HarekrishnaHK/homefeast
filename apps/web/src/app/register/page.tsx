import Link from "next/link";
import { TiffinMark } from "@/components/TiffinStack";
import { RegisterForm } from "@/components/RegisterForm";

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

        <RegisterForm isCook={isCook} />

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