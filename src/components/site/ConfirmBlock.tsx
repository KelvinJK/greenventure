import { cn } from "@/lib/utils";

/**
 * Visible placeholder for content the client has not confirmed yet. Deliberately
 * obvious so it can never be mistaken for finished copy.
 */
export function ConfirmBlock({ children, className }: { children: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-block border border-dashed border-terracotta bg-terracotta/10 px-2 py-1 text-sm font-semibold text-terracotta",
        className,
      )}
    >
      [CONFIRM: {children}]
    </span>
  );
}
