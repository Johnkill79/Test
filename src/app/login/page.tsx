import Link from "next/link";
import { redirect } from "next/navigation";
import { LogIn } from "lucide-react";
import { CustomerLoginForm } from "@/components/CustomerLoginForm";
import { getCurrentCustomer } from "@/lib/customerAuthServer";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const customer = await getCurrentCustomer();
  const { next } = await searchParams;
  const nextPath = next?.startsWith("/") ? next : "/";
  if (customer) redirect(nextPath);

  return (
    <div className="container-page py-14">
      <div className="mx-auto max-w-md card-surface p-6 shadow-glow">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 dark:bg-white/5 ring-1 ring-neutral-200 dark:ring-white/10">
            <LogIn className="h-5 w-5 text-gold-500" />
          </span>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Client login</h1>
            <p className="text-sm text-neutral-600 dark:text-white/70">Sign in before booking and checkout.</p>
          </div>
        </div>

        <div className="mt-6">
          <CustomerLoginForm nextPath={nextPath} />
        </div>

        <p className="mt-4 text-sm text-neutral-600 dark:text-white/70">
          No account yet?{" "}
          <Link className="text-gold-500 hover:text-gold-400" href={`/register?next=${encodeURIComponent(nextPath)}`}>
            Create one here
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
