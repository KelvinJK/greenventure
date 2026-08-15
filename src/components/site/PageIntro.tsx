/** Standard editorial page header: eyebrow label, serif title, lead paragraph. */
export function PageIntro({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <header className="border-b border-border bg-secondary/60">
      <div className="shell py-14 md:py-20">
        <p className="eyebrow text-green">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl text-4xl md:text-6xl">{title}</h1>
        {lead && <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{lead}</p>}
      </div>
    </header>
  );
}
