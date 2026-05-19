import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page py-16">
      <div className="card-surface p-6">
        <h1 className="text-xl font-semibold tracking-tight">Page not found</h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-white/70">
          The page you’re looking for doesn’t exist.
        </p>
        <div className="mt-6">
          <Link href="/" className="btn btn-primary">
            Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

