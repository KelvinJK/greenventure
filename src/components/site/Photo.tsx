import { cn } from "@/lib/utils";

/**
 * Renders a real photograph when one exists, otherwise a labelled placeholder
 * showing the intended shot description and aspect ratio so a photographer's
 * image can be dropped straight in later.
 */
export function Photo({
  src,
  alt,
  shot,
  ratio = "4/3",
  className,
  imageClassName,
  priority = false,
  width,
  height,
}: {
  src?: string;
  alt?: string;
  shot: string;
  ratio?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  width?: number;
  height?: number;
}) {
  if (src) {
    return (
      <div className={cn("overflow-hidden bg-muted", className)} style={{ aspectRatio: ratio }}>
        <img
          src={src}
          alt={alt ?? shot}
          width={width ?? 1200}
          height={height ?? 900}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "auto" : "async"}
          fetchPriority={priority ? "high" : "auto"}
          className={cn("size-full object-cover", imageClassName)}
        />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={`Photograph placeholder: ${shot}`}
      className={cn(
        "flex flex-col justify-end gap-1 border border-dashed border-green/35 bg-secondary p-4",
        className,
      )}
      style={{ aspectRatio: ratio }}
    >
      <span className="eyebrow text-green">Photograph to come</span>
      <span className="font-display text-base leading-snug text-foreground">{shot}</span>
      <span className="text-xs text-muted-foreground">Aspect ratio {ratio.replace("/", ":")}</span>
    </div>
  );
}
