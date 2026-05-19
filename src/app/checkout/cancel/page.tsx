import Link from "next/link";
import { XCircle } from "lucide-react";

export default async function CheckoutCancelPage() {
  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-xl card-surface p-6">
        <div className="flex items-start gap-3">
          <XCircle className="mt-1 h-6 w-6 text-neutral-500 dark:text-white/60" />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Payment cancelled</h1>
            <p className="mt-2 text-sm text-neutral-600 dark:text-white/70">
              No worries. You can try again, or book instantly via WhatsApp from the homepage.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="btn btn-primary w-full">
            Back to homepage
          </Link>
          <Link href="/#fleet" className="btn btn-ghost w-full">
            View cars
          </Link>
        </div>
      </div>
    </div>
  );
}

