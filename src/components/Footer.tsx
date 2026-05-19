import { SiteLogoLink } from "@/components/SiteLogo";

export function Footer() {
  const address = "Bgy San Pedro, Puerto Princesa City";
  const mapQuery = encodeURIComponent("Bgy San Pedro, Puerto Princesa City, Palawan");
  const mapSrc = `https://www.google.com/maps?q=${mapQuery}&output=embed`;

  return (
    <footer className="border-t border-neutral-200 dark:border-white/10">
      <div className="container-page py-12 text-sm text-neutral-500 dark:text-white/60">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="space-y-3">
            <SiteLogoLink
              showWordmark={false}
              logoHeightClass="h-12 w-auto"
              maxWidthClass="max-w-[220px] sm:max-w-[280px]"
            />
            <p className="text-neutral-500 dark:text-white/50">{address}</p>
            <p className="text-neutral-500 dark:text-white/50">
              <a className="text-neutral-700 hover:text-neutral-900 dark:text-white/70 dark:hover:text-white" href="tel:+639166832191">
                +63 916 683 2191
              </a>
              <span className="mx-2 text-neutral-300 dark:text-white/20">•</span>
              <a className="text-neutral-700 hover:text-neutral-900 dark:text-white/70 dark:hover:text-white" href="mailto:johnkill@outlook.com">
                johnkill@outlook.com
              </a>
            </p>
          </div>

          <div className="space-y-3">
            <p className="font-semibold text-neutral-900 dark:text-white tracking-wide">Quick links</p>
            <div className="grid grid-cols-2 gap-2">
              <a className="text-neutral-700 hover:text-neutral-900 dark:text-white/70 dark:hover:text-white" href="/">
                Home
              </a>
              <a className="text-neutral-700 hover:text-neutral-900 dark:text-white/70 dark:hover:text-white" href="/gallery">
                Gallery
              </a>
              <a className="text-neutral-700 hover:text-neutral-900 dark:text-white/70 dark:hover:text-white" href="/about">
                About
              </a>
              <a className="text-neutral-700 hover:text-neutral-900 dark:text-white/70 dark:hover:text-white" href="/contact">
                Contact
              </a>
              <a className="text-neutral-700 hover:text-neutral-900 dark:text-white/70 dark:hover:text-white" href="/#fleet">
                Fleet
              </a>
              <a className="text-neutral-700 hover:text-neutral-900 dark:text-white/70 dark:hover:text-white" href="/admin">
                Admin
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <p className="font-semibold text-neutral-900 dark:text-white tracking-wide">Map</p>
            <div className="overflow-hidden rounded-2xl bg-neutral-100 dark:bg-white/5 ring-1 ring-neutral-200 dark:ring-white/10">
              <iframe
                title="JP CAR RENTAL Location Map"
                src={mapSrc}
                className="h-56 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-neutral-200 dark:border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-neutral-600 dark:text-white/55">© {new Date().getFullYear()} JP CAR RENTAL</p>
        </div>
      </div>
    </footer>
  );
}

