import { Lock } from "lucide-react";
import { AdminLoginForm } from "@/components/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="container-page py-14">
      <div className="mx-auto max-w-md card-surface p-6 shadow-glow">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 dark:bg-white/5 ring-1 ring-neutral-200 dark:ring-white/10">
            <Lock className="h-5 w-5 text-gold-500" />
          </span>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Admin login</h1>
            <p className="text-sm text-neutral-600 dark:text-white/70">
              Enter your password to access the dashboard.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <AdminLoginForm />
        </div>

        <p className="mt-4 text-xs text-neutral-500 dark:text-white/55">
          Set your password in <span className="font-medium text-neutral-900 dark:text-white">.env.local</span> as{" "}
          <span className="font-medium text-neutral-900 dark:text-white">ADMIN_PASSWORD</span>.
        </p>
      </div>
    </div>
  );
}

