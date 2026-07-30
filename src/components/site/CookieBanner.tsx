import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

const STORAGE_KEY = "gvt-cookie-consent-v1";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      /* storage unavailable, stay hidden */
    }
  }, []);

  if (!visible) return null;

  const accept = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4">
      <div className="mx-auto grid w-full max-w-4xl gap-4 rounded-lg border border-border bg-card p-5 shadow-card-hover sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <p className="text-sm leading-relaxed text-muted-foreground">
          We use cookies to improve your experience. By continuing to browse, you agree to our use of
          cookies.{" "}
          <Link to="/cookie-policy" className="font-semibold text-primary hover:underline">
            Cookie Policy
          </Link>
        </p>
        <Button className="h-11 px-6 sm:shrink-0" onClick={accept}>
          Accept
        </Button>
      </div>
    </div>
  );
}
