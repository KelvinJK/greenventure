import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";
import { toast } from "sonner";

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
import { useCart } from "@/context/CartContext";
import { formatTzs } from "@/lib/format";
import type { Product } from "@/lib/catalog-queries";

/** Standard stock piece: 3 m long. */
const BOARD_LENGTH_M = 3;

const widthOptions = [
  { value: "101.6", label: "4 in (101.6 mm)" },
  { value: "140", label: "140 mm grooved deck board" },
  { value: "150", label: "150 mm plank (6 in nominal)" },
  { value: "152.4", label: "6 in (152.4 mm)" },
  { value: "203.2", label: "8 in (203.2 mm)" },
];

const thicknessOptions = [
  { value: "15", label: "1.5 cm, cladding & light decking" },
  { value: "25", label: "2.5 cm, grooved deck board" },
  { value: "35", label: "3.5 cm, heavy duty / structural" },
];

/**
 * Per-product defaults so the calculator opens with the real profile of the
 * board being viewed. `linear` products (posts, beams) are sold by running
 * metre and are not laid out across an area.
 */
const profiles: Record<string, { widthMm: string; thicknessMm: string; linear?: boolean }> = {
  "grooved-deck-board-140x25": { widthMm: "140", thicknessMm: "25" },
  "smooth-plastic-plank-150x35": { widthMm: "150", thicknessMm: "35" },
  "structural-post-100x100": { widthMm: "101.6", thicknessMm: "35", linear: true },
  "structural-beam-50x150": { widthMm: "150", thicknessMm: "35", linear: true },
};

function toNumber(value: string): number {
  const parsed = Number.parseFloat(value.replace(",", "."));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function thicknessLabel(mm: string): string {
  const cm = toNumber(mm) / 10;
  return cm > 0 ? `${cm} cm` : "1.5 cm";
}

export function CoverageCalculator({ product }: { product: Product }) {
  const { addLine } = useCart();
  const perMeter = product.unit.toLowerCase().includes("meter");
  const profile = profiles[product.slug];
  const isLinear = Boolean(profile?.linear);

  const [mode, setMode] = useState<"area" | "dimensions">("area");
  const [area, setArea] = useState("");
  const [width, setWidth] = useState("");
  const [length, setLength] = useState("");
  const [runMeters, setRunMeters] = useState("");
  const [boardWidthMm, setBoardWidthMm] = useState(profile?.widthMm ?? "152.4");
  const [thicknessMm, setThicknessMm] = useState(profile?.thicknessMm ?? "15");
  const [gapMm, setGapMm] = useState("5");
  const [wastePct, setWastePct] = useState("10");

  const result = useMemo(() => {
    const waste = Math.min(50, Math.max(0, toNumber(wastePct))) / 100;

    if (isLinear) {
      const run = toNumber(runMeters);
      if (run <= 0) return null;
      const pieces = Math.ceil((run * (1 + waste)) / BOARD_LENGTH_M);
      const linearMeters = pieces * BOARD_LENGTH_M;
      const billed = perMeter ? linearMeters : pieces;
      const cartQuantity = Math.min(999, billed);
      return {
        baseArea: 0,
        run,
        boards: pieces,
        linearMeters,
        coveragePerBoard: 0,
        cartQuantity,
        estimate: product.price_tzs * cartQuantity,
        capped: billed > 999,
      };
    }

    const baseArea =
      mode === "area" ? toNumber(area) : toNumber(width) * toNumber(length);
    if (baseArea <= 0) return null;

    const boardWidthM = toNumber(boardWidthMm) / 1000 || 0.1524;
    const gapM = Math.max(0, toNumber(gapMm)) / 1000;

    const effectiveWidthM = boardWidthM + gapM;
    const coveragePerBoard = BOARD_LENGTH_M * effectiveWidthM;
    const areaWithWaste = baseArea * (1 + waste);

    const boards = Math.ceil(areaWithWaste / coveragePerBoard);
    const linearMeters = boards * BOARD_LENGTH_M;
    const billed = perMeter ? linearMeters : boards;
    const cartQuantity = Math.min(999, billed);

    return {
      baseArea,
      run: 0,
      boards,
      linearMeters,
      coveragePerBoard,
      cartQuantity,
      estimate: product.price_tzs * cartQuantity,
      capped: billed > 999,
    };
  }, [
    isLinear,
    runMeters,
    mode,
    area,
    width,
    length,
    boardWidthMm,
    gapMm,
    wastePct,
    perMeter,
    product.price_tzs,
  ]);

  const unitWord = perMeter ? "metres" : "pieces";

  return (
    <section className="mt-8 rounded-lg border border-border bg-muted/40 p-5 sm:p-6">
      <header className="flex items-start gap-3">
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Calculator className="size-4" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-display text-base leading-snug">
            {isLinear ? "How many lengths do I need?" : "How much do I need?"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {isLinear
              ? `Enter the total running metres for your frame and we work out the 3 m lengths. This profile is ${thicknessLabel(thicknessMm)} thick and priced ${product.unit}.`
              : `Enter the space you are covering and we work out the pieces for you. Stock boards are 3 m long, ${toNumber(boardWidthMm)} mm wide and ${thicknessLabel(thicknessMm)} thick, priced ${product.unit}.`}
          </p>
        </div>
      </header>

      {isLinear ? (
        <div className="mt-5">
          <Label htmlFor="calc-run" className="text-sm font-semibold">
            Total running length needed (m)
          </Label>
          <Input
            id="calc-run"
            inputMode="decimal"
            placeholder="e.g. 32"
            value={runMeters}
            onChange={(event) => setRunMeters(event.target.value)}
            className="mt-2 h-11"
          />
        </div>
      ) : (
        <Tabs
          value={mode}
          onValueChange={(value) => setMode(value as "area" | "dimensions")}
          className="mt-5"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="area" className="min-h-10">
              Square metres
            </TabsTrigger>
            <TabsTrigger value="dimensions" className="min-h-10">
              Width × length
            </TabsTrigger>
          </TabsList>

          <TabsContent value="area" className="mt-4">
            <Label htmlFor="calc-area" className="text-sm font-semibold">
              Total area (m²)
            </Label>
            <Input
              id="calc-area"
              inputMode="decimal"
              placeholder="e.g. 24"
              value={area}
              onChange={(event) => setArea(event.target.value)}
              className="mt-2 h-11"
            />
          </TabsContent>

          <TabsContent value="dimensions" className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="calc-width" className="text-sm font-semibold">
                Width (m)
              </Label>
              <Input
                id="calc-width"
                inputMode="decimal"
                placeholder="e.g. 4"
                value={width}
                onChange={(event) => setWidth(event.target.value)}
                className="mt-2 h-11"
              />
            </div>
            <div>
              <Label htmlFor="calc-length" className="text-sm font-semibold">
                Length (m)
              </Label>
              <Input
                id="calc-length"
                inputMode="decimal"
                placeholder="e.g. 6"
                value={length}
                onChange={(event) => setLength(event.target.value)}
                className="mt-2 h-11"
              />
            </div>
          </TabsContent>
        </Tabs>
      )}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {!isLinear && (
          <div>
            <Label className="text-sm font-semibold">Board width</Label>
            <Select value={boardWidthMm} onValueChange={setBoardWidthMm}>
              <SelectTrigger className="mt-2 h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {widthOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div>
          <Label className="text-sm font-semibold">Thickness</Label>
          <Select value={thicknessMm} onValueChange={setThicknessMm}>
            <SelectTrigger className="mt-2 h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {thicknessOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {!isLinear && (
          <div>
            <Label htmlFor="calc-gap" className="text-sm font-semibold">
              Gap between boards (mm)
            </Label>
            <Input
              id="calc-gap"
              inputMode="decimal"
              value={gapMm}
              onChange={(event) => setGapMm(event.target.value)}
              className="mt-2 h-11"
            />
          </div>
        )}
        <div>
          <Label htmlFor="calc-waste" className="text-sm font-semibold">
            Cutting allowance (%)
          </Label>
          <Input
            id="calc-waste"
            inputMode="decimal"
            value={wastePct}
            onChange={(event) => setWastePct(event.target.value)}
            className="mt-2 h-11"
          />
        </div>
      </div>

      {result ? (
        <div className="mt-6 rounded-md border border-border bg-card p-5">
          <dl className="grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                Pieces needed
              </dt>
              <dd className="mt-1 font-display text-2xl text-primary">
                {result.boards} × 3 m {result.boards === 1 ? "length" : "lengths"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                Total length
              </dt>
              <dd className="mt-1 font-display text-2xl">{result.linearMeters} m</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                {isLinear ? "Length entered" : "Area entered"}
              </dt>
              <dd className="mt-1 text-sm font-semibold">
                {isLinear
                  ? `${result.run.toFixed(2)} m of framing`
                  : `${result.baseArea.toFixed(2)} m², each board covers ${result.coveragePerBoard.toFixed(2)} m²`}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                Estimated cost
              </dt>
              <dd className="mt-1 text-sm font-semibold">
                {formatTzs(result.estimate)}{" "}
                <span className="font-normal text-muted-foreground">
                  ({result.cartQuantity} {perMeter ? "m" : "pcs"} at{" "}
                  {formatTzs(product.price_tzs)} {product.unit})
                </span>
              </dd>
            </div>
          </dl>

          <Button
            className="mt-5 h-11 w-full bg-brand-accent text-brand-accent-foreground hover:bg-brand-accent/85"
            onClick={() => {
              addLine(
                {
                  slug: product.slug,
                  name: product.name,
                  priceTzs: product.price_tzs,
                  unit: product.unit,
                  imageKey: product.image_key,
                },
                result.cartQuantity,
              );
              toast.success(
                `Added ${result.cartQuantity} ${perMeter ? "m" : "pieces"} of ${product.name} to your cart`,
              );
            }}
          >
            Add {result.cartQuantity} {unitWord} to cart
          </Button>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            {perMeter
              ? "Per metre pricing is applied to the full 3 m lengths you will receive, including your cutting allowance."
              : "Figures include your cutting allowance and are rounded up to whole 3 m boards."}{" "}
            Joists, posts and fixings are quoted separately, ask us for a full bill of materials.
          </p>
          {result.capped ? (
            <p className="mt-2 text-xs font-semibold text-muted-foreground">
              Large order capped at 999 {unitWord} online, contact us for a project quote.
            </p>
          ) : null}
        </div>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">
          {isLinear
            ? "Enter your running metres above to see the number of 3 m lengths and an estimated cost."
            : "Enter your measurements above to see the number of boards, total metres and an estimated cost."}
        </p>
      )}
    </section>
  );
}
