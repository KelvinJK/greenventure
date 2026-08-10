import { useMemo, useState } from "react";
import { Calculator, FileDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatTzs, isPerMetre } from "@/lib/format";
import { downloadQuotePdf } from "@/lib/quote-pdf";
import type { Product } from "@/lib/catalog-queries";

const BOARD_LENGTH_M = 3;

const applications = [
  { value: "decking", label: "Deck or terrace floor", categories: ["Decking", "Lumber"], area: true },
  { value: "cladding", label: "Wall cladding or screen", categories: ["Decking", "Lumber"], area: true },
  { value: "fencing", label: "Fencing or boundary", categories: ["Fencing", "Lumber"], area: true },
  { value: "framing", label: "Frame, joists, posts", categories: ["Lumber"], area: false },
  { value: "boardwalk", label: "Boardwalk or jetty", categories: ["Decking", "Lumber"], area: true },
] as const;

function toNumber(value: string): number {
  const parsed = Number.parseFloat(value.replace(",", "."));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

/** Reads the mm profile out of a slug like "grooved-deck-board-140x25". */
function profileOf(product: Product): { widthMm: number; thicknessMm: number } {
  const match = /(\d{2,3})x(\d{2,3})/.exec(product.slug);
  if (match) {
    const a = Number(match[1]);
    const b = Number(match[2]);
    return { widthMm: Math.max(a, b), thicknessMm: Math.min(a, b) };
  }
  return { widthMm: 152.4, thicknessMm: 15 };
}

export function QuoteEstimator({
  products,
  onUseEstimate,
}: {
  products: Product[];
  onUseEstimate: (summary: string) => void;
}) {
  const [application, setApplication] = useState<string>("decking");
  const app = applications.find((item) => item.value === application) ?? applications[0];

  const eligible = useMemo(
    () => products.filter((product) => app.categories.includes(product.category as never)),
    [products, app],
  );

  const [slug, setSlug] = useState<string>("");
  const selected =
    eligible.find((product) => product.slug === slug) ?? eligible[0] ?? null;

  const [mode, setMode] = useState<"area" | "dimensions">("area");
  const [area, setArea] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [runMeters, setRunMeters] = useState("");
  const [gapMm, setGapMm] = useState("5");
  const [wastePct, setWastePct] = useState("10");

  const linear = !app.area;

  const result = useMemo(() => {
    if (!selected) return null;
    const waste = Math.min(50, Math.max(0, toNumber(wastePct))) / 100;
    const perMetre = isPerMetre(selected.unit);
    const profile = profileOf(selected);

    if (linear) {
      const run = toNumber(runMeters);
      if (run <= 0) return null;
      const pieces = Math.ceil((run * (1 + waste)) / BOARD_LENGTH_M);
      const metres = pieces * BOARD_LENGTH_M;
      const billed = perMetre ? metres : pieces;
      return {
        baseArea: 0,
        run,
        pieces,
        metres,
        coveragePerBoard: 0,
        estimate: selected.price_tzs * billed,
        billed,
        perMetre,
        profile,
      };
    }

    const baseArea = mode === "area" ? toNumber(area) : toNumber(width) * toNumber(height);
    if (baseArea <= 0) return null;

    const effectiveWidthM = profile.widthMm / 1000 + Math.max(0, toNumber(gapMm)) / 1000;
    const coveragePerBoard = BOARD_LENGTH_M * effectiveWidthM;
    const pieces = Math.ceil((baseArea * (1 + waste)) / coveragePerBoard);
    const metres = pieces * BOARD_LENGTH_M;
    const billed = perMetre ? metres : pieces;

    return {
      baseArea,
      run: 0,
      pieces,
      metres,
      coveragePerBoard,
      estimate: selected.price_tzs * billed,
      billed,
      perMetre,
      profile,
    };
  }, [selected, linear, runMeters, mode, area, width, height, gapMm, wastePct]);

  function summary(): string {
    if (!selected || !result) return "";
    return [
      `Project type: ${app.label}`,
      `Material: ${selected.name} (${result.profile.widthMm} mm x ${result.profile.thicknessMm} mm profile)`,
      linear
        ? `Linear run to cover: ${result.run.toFixed(2)} m`
        : `Area to cover: ${result.baseArea.toFixed(2)} m2${mode === "dimensions" ? ` (${toNumber(width)} m x ${toNumber(height)} m)` : ""}`,
      `Cutting allowance: ${Math.min(50, Math.max(0, toNumber(wastePct)))}%`,
      `I need ${result.pieces} pieces of 3 m ${selected.name} (${result.billed} ${result.perMetre ? "m" : "pcs"} total).`,
      `This is to cover ${result.baseArea.toFixed(2)} m² of ${app.label}.`,
      "Please provide a final quote including delivery.",
    ].join("\n");
  }

  function handleDownload() {
    if (!selected || !result) return;
    downloadQuotePdf({
      application: app.label,
      material: selected.name,
      profile: `${result.profile.widthMm} mm x ${result.profile.thicknessMm} mm, 3 m lengths`,
      basis: linear
        ? `${result.run.toFixed(2)} m running length`
        : `${result.baseArea.toFixed(2)} m2${mode === "dimensions" ? ` (${toNumber(width)} m x ${toNumber(height)} m)` : ""}, ${Math.max(0, toNumber(gapMm))} mm board gap`,
      allowance: `${Math.min(50, Math.max(0, toNumber(wastePct)))}%`,
      pieces: result.pieces,
      metres: result.metres,
      billed: `${result.billed} ${result.perMetre ? "m" : "pcs"}`,
    });
  }

  return (
    <section className="mt-10 rounded-lg border border-border bg-muted/40 p-5 sm:p-6">
      <header className="flex items-start gap-3">
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Calculator className="size-4" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-display text-base leading-snug">Size up your project first</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter the space you want to build and we work out the lengths and total metres. Add it to your request and we will confirm the final quote with delivery.
          </p>
        </div>
      </header>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <Label className="text-sm font-semibold">What are you building?</Label>
          <Select
            value={application}
            onValueChange={(value) => {
              setApplication(value);
              setSlug("");
            }}
          >
            <SelectTrigger className="mt-2 h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {applications.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-sm font-semibold">Material</Label>
          <Select value={selected?.slug ?? ""} onValueChange={setSlug}>
            <SelectTrigger className="mt-2 h-11">
              <SelectValue placeholder="Choose a profile" />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {eligible.map((product) => (
                <SelectItem key={product.slug} value={product.slug}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {linear ? (
        <div className="mt-4">
          <Label htmlFor="quote-run" className="text-sm font-semibold">
            Total running length needed (m)
          </Label>
          <Input
            id="quote-run"
            inputMode="decimal"
            placeholder="e.g. 48"
            value={runMeters}
            onChange={(event) => setRunMeters(event.target.value)}
            className="mt-2 h-11"
          />
        </div>
      ) : (
        <Tabs value={mode} onValueChange={(value) => setMode(value as "area" | "dimensions")} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="area" className="min-h-10">
              Square metres
            </TabsTrigger>
            <TabsTrigger value="dimensions" className="min-h-10">
              Width × length
            </TabsTrigger>
          </TabsList>
          <TabsContent value="area" className="mt-4">
            <Label htmlFor="quote-area" className="text-sm font-semibold">
              Total area (m²)
            </Label>
            <Input
              id="quote-area"
              inputMode="decimal"
              placeholder="e.g. 120"
              value={area}
              onChange={(event) => setArea(event.target.value)}
              className="mt-2 h-11"
            />
          </TabsContent>
          <TabsContent value="dimensions" className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="quote-width" className="text-sm font-semibold">
                Width (m)
              </Label>
              <Input
                id="quote-width"
                inputMode="decimal"
                placeholder="e.g. 8"
                value={width}
                onChange={(event) => setWidth(event.target.value)}
                className="mt-2 h-11"
              />
            </div>
            <div>
              <Label htmlFor="quote-height" className="text-sm font-semibold">
                Length or height (m)
              </Label>
              <Input
                id="quote-height"
                inputMode="decimal"
                placeholder="e.g. 15"
                value={height}
                onChange={(event) => setHeight(event.target.value)}
                className="mt-2 h-11"
              />
            </div>
          </TabsContent>
        </Tabs>
      )}

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {!linear && (
          <div>
            <Label htmlFor="quote-gap" className="text-sm font-semibold">
              Gap between boards (mm)
            </Label>
            <Input
              id="quote-gap"
              inputMode="decimal"
              value={gapMm}
              onChange={(event) => setGapMm(event.target.value)}
              className="mt-2 h-11"
            />
          </div>
        )}
        <div>
          <Label htmlFor="quote-waste" className="text-sm font-semibold">
            Cutting allowance (%)
          </Label>
          <Input
            id="quote-waste"
            inputMode="decimal"
            value={wastePct}
            onChange={(event) => setWastePct(event.target.value)}
            className="mt-2 h-11"
          />
        </div>
      </div>

      {selected && result ? (
        <div className="mt-6 rounded-md border border-border bg-card p-5">
          <dl className="grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                Lengths needed
              </dt>
              <dd className="mt-1 font-display text-2xl text-primary">
                {result.pieces} × 3 m
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                Total metres
              </dt>
              <dd className="mt-1 font-display text-2xl">{result.metres} m</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                {linear ? "Length entered" : "Area entered"}
              </dt>
              <dd className="mt-1 text-sm font-semibold">
                {linear
                  ? `${result.run.toFixed(2)} m of framing`
                  : `${result.baseArea.toFixed(2)} m², each length covers ${result.coveragePerBoard.toFixed(2)} m²`}
              </dd>
            </div>
          </dl>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full"
              onClick={() => onUseEstimate(summary())}
            >
              Add this to my request
            </Button>
            <Button type="button" variant="secondary" className="h-11 w-full" onClick={handleDownload}>
              <FileDown className="size-4" aria-hidden="true" />
              Download quote PDF
            </Button>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            Delivery, fixings, joists and site conditions will be priced in the final quote.
          </p>
        </div>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">
          Choose a material and enter your measurements to see lengths and metres.
        </p>
      )}
    </section>
  );
}
