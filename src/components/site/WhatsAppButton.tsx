import { MessageCircle } from "lucide-react";

import { whatsappHref } from "@/lib/site-content";

/** Floating WhatsApp contact button, present on every page. */
export function WhatsAppButton() {
  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Message Green Venture on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-green text-green-foreground shadow-card transition-transform hover:scale-105"
    >
      <MessageCircle className="size-6" aria-hidden="true" />
    </a>
  );
}
