import Link from "next/link";
import fs from "node:fs";
import path from "node:path";

/**
 * Logo file in `public/`.
 * Supported: SVG, PNG, WebP (use `<img>` so no extra Next.js image config).
 */
const LOGO_CANDIDATES = ["/logo.png", "/logo.webp", "/logo.jpg", "/logo.jpeg", "/logo.svg"];

function resolveSiteLogoPath() {
  for (const candidate of LOGO_CANDIDATES) {
    const fullPath = path.join(process.cwd(), "public", candidate.replace(/^\//, ""));
    if (fs.existsSync(fullPath)) return candidate;
  }
  return "/logo.svg";
}

type SiteLogoLinkProps = {
  /** Set false if your image already includes the business name. */
  showWordmark?: boolean;
  /**
   * Fixed height reads larger in a 64px-tall navbar than max-h alone.
   * Use `h-10` / `h-11` for compact bars; widen `maxWidthClass` if the artwork is horizontal.
   */
  logoHeightClass?: string;
  /** Cap width so the menu still fits on small screens (widen on md+ below). */
  maxWidthClass?: string;
};

export function SiteLogoLink({
  showWordmark = true,
  logoHeightClass = "h-11 w-auto",
  maxWidthClass = "max-w-[132px] sm:max-w-[200px] md:max-w-[260px]"
}: SiteLogoLinkProps) {
  const siteLogoPath = resolveSiteLogoPath();

  return (
    <Link href="/" className="flex min-w-0 shrink items-center gap-2">
      <img
        src={siteLogoPath}
        alt="JP CAR RENTAL"
        width={260}
        height={64}
        fetchPriority="high"
        decoding="async"
        className={`block shrink-0 ${logoHeightClass} ${maxWidthClass} object-contain object-left [image-rendering:-webkit-optimize-contrast]`}
      />
      {showWordmark ? (
        <span className="text-sm font-semibold tracking-wide text-neutral-900 dark:text-white">
          JP CAR RENTAL
        </span>
      ) : null}
    </Link>
  );
}
