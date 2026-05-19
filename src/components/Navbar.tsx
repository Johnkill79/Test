import Link from "next/link";
import { Shield, Images, Phone, Info, Home, LogIn, UserPlus, LogOut } from "lucide-react";
import { customerLogoutAction } from "@/app/login/actions";
import { getCurrentCustomer } from "@/lib/customerAuthServer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SiteLogoLink } from "@/components/SiteLogo";

export async function Navbar() {
  const customer = await getCurrentCustomer();

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-stone-50/85 backdrop-blur dark:border-white/10 dark:bg-ink-950/70">
      <div className="container-page flex h-16 min-h-16 items-center justify-between gap-2 sm:gap-3">
        <SiteLogoLink
          showWordmark={false}
          logoHeightClass="h-11 w-auto sm:h-12"
          maxWidthClass="max-w-[132px] sm:max-w-[210px] md:max-w-[280px]"
        />

        <nav className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-1.5 sm:gap-2">
          <ThemeToggle />
          <Link href="/" className="btn btn-ghost hidden md:inline-flex">
            <Home className="h-4 w-4" />
            Home
          </Link>
          <Link href="/gallery" className="btn btn-ghost hidden md:inline-flex">
            <Images className="h-4 w-4" />
            Gallery
          </Link>
          <Link href="/about" className="btn btn-ghost hidden md:inline-flex">
            <Info className="h-4 w-4" />
            About
          </Link>
          <Link href="/contact" className="btn btn-ghost hidden md:inline-flex">
            <Phone className="h-4 w-4" />
            Contact
          </Link>
          <Link href="/admin" className="btn btn-ghost">
            <Shield className="h-4 w-4" />
            Admin
          </Link>
          {customer ? (
            <form action={customerLogoutAction}>
              <button type="submit" className="btn btn-ghost">
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </form>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost">
                <LogIn className="h-4 w-4" />
                Login
              </Link>
              <Link href="/register" className="btn btn-primary hidden md:inline-flex">
                <UserPlus className="h-4 w-4" />
                Create account
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

