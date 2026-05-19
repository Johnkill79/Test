import Link from "next/link";
import { Mail, Phone, MessageCircle } from "lucide-react";

export default function ContactPage() {
  const phoneDisplay = "+63 916 683 2191";
  const phoneTel = "+639166832191";
  const email = "johnkill@outlook.com";
  const location = "Bgy San Pedro, Puerto Princesa City";

  return (
    <div className="container-page py-14">
      <div className="mx-auto max-w-3xl">
        <div className="badge">Contact</div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Contact us</h1>
        <p className="mt-4 text-sm text-neutral-600 dark:text-white/70">
          Reach out for availability, requirements, delivery options, and special requests.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="card-surface p-5">
            <p className="inline-flex items-center gap-2 text-sm font-medium">
              <MessageCircle className="h-4 w-4 text-gold-500" />
              WhatsApp
            </p>
            <p className="mt-2 text-sm text-neutral-600 dark:text-white/70">
              Fastest way to book and confirm details.
            </p>
            <div className="mt-4">
              <Link href="/#fleet" className="btn btn-primary w-full">
                Book via WhatsApp
              </Link>
            </div>
          </div>

          <div className="card-surface p-5">
            <p className="inline-flex items-center gap-2 text-sm font-medium">
              <Phone className="h-4 w-4 text-gold-500" />
              Phone
            </p>
            <p className="mt-2 text-sm text-neutral-600 dark:text-white/70">{phoneDisplay}</p>
            <div className="mt-4">
              <a className="btn btn-ghost w-full" href={`tel:${phoneTel}`}>
                Call
              </a>
            </div>
          </div>

          <div className="card-surface p-5">
            <p className="inline-flex items-center gap-2 text-sm font-medium">
              <Mail className="h-4 w-4 text-gold-500" />
              Email
            </p>
            <p className="mt-2 text-sm text-neutral-600 dark:text-white/70">{email}</p>
            <div className="mt-4">
              <a className="btn btn-ghost w-full" href={`mailto:${email}`}>
                Email us
              </a>
            </div>
          </div>
        </div>

        <div className="mt-4 card-surface p-5">
          <p className="text-sm font-medium">Location</p>
          <p className="mt-2 text-sm text-neutral-600 dark:text-white/70">{location}</p>
        </div>

        <div className="mt-10 card-surface p-6">
          <h2 className="text-lg font-semibold tracking-tight">Quick note</h2>
          <p className="mt-2 text-sm text-neutral-600 dark:text-white/70 leading-relaxed">
            For the best experience, pick a car and dates first, then proceed to payment. If you
            prefer, you can always book via WhatsApp and we’ll confirm everything with you.
          </p>
        </div>
      </div>
    </div>
  );
}

