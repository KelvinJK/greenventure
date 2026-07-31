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

/** Standard stock board: 3 m long, 6 inches (152.4 mm) wide. */
const BOARD_LENGTH_M = 3;

const widthOptions = [
  { value: "101.6", label: '4 in (101.6 mm)' },
  { value: "152.4", label: '6 in (152.4 mm), standard' },
  { value: "203.2", label: '8 in (203.2 mm)' },
];

const thicknessOptions = [
  { value: "15", label: "1.5 cm, decking & cladding" },
  { value: "35", label: "3.5 cm, heavy duty / structural" },
];

function toNumber(value: string): number {
  const parsed = Number.parseFloat(value.replace(",", "."));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

export function CoverageCalculator({ product }: { product: Product }) {
  const { addLine } = useCart();
  const perMeter = product.unit.toLowerCase().includes("meter");

  const [mode, setMode] = useState<"area" | "dimensions">("area");
  const [area, setArea] = useState("");
  const [width, setWidth] = useState("");
  const [length, setLength] = useState("");
  const [boardWidthMm, setBoardWidthMm] = useState("152.4");
  const [thicknessMm, setThicknessMm] = useState("15");
  const [gapMm, setGapMm] = useState("5");
  const [wastePct, setWastePct] = useState("10");

  const result = useMemo(() => {
    const baseArea =
      mode === "area" ? toNumber(area) : toNumber(width) * toNumber(length);
    if (baseArea <= 0) return null;

    const boardWidthM = toNumber(boardWidthMm) / 1000 || 0.1524;
    const gapM = Math.max(0, toNumber(gapMm)) / 1000;
    const waste = Math.min(50, Math.max(0, toNumber(wastePct))) / 100;

    const effectiveWidthM = boardWidthM + gapM;
    const coveragePerBoard = BOARD_LENGTH_M * effectiveWidthM;
    const areaWithWaste = baseArea * (1 + waste);

    const boards = Math.ceil(areaWithWaste / coveragePerBoard);
    const linearMeters = boards * BOARD_LENGTH_M;
    const cartQuantity = Math.min(999, perMeter ? linearMeters : boards);
    const estimate = product.price_tzs * cartQuantity;

    return {
      baseArea,
      boards,
      linearMeters,
      coveragePerBoard,
      cartQuantity,
      estimate,
      capped: (perMeter ? linearMeters : boards) > 999,
    };
  }, [
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

  return (
    <section className="mt-8 rounded-lg border border-border bg-muted/40 p-5 sm:p-6">
      <header className="flex items-start gap-3">
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Calculator className="size-4" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-display text-base leading-snug">How much do I need?</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter the space you are covering and we work out the pieces for you. Stock boards are 3 m
            long and {thicknessMm === "35" ? "3.5 cm" : "1.5 cm"} thick.
          </p>
        </div>
      </header>

      <Tabs value={mode} onValueChange={(value) => setMode(value as "area" | "dimensions")} className="mt-5">
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

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
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
              <dd className="mt-1 font-display text-2xl text-primary">{result.boards} boards</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                Total length
              </dt>
              <dd className="mt-1 font-display text-2xl">{result.linearMeters} m</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                Area entered
              </dt>
              <dd className="mt-1 text-sm font-semibold">
                {result.baseArea.toFixed(2)} m², each board covers{" "}
                {result.coveragePerBoard.toFixed(2)} m²
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                Estimated cost
              </dt>
              <dd className="mt-1 text-sm font-semibold">
                {formatTzs(result.estimate)}{" "}
                <span className="font-normal text-muted-foreground">
                  ({result.cartQuantity} × {product.unit.replace("per ", "")})
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
            Add {result.cartQuantity} {perMeter ? "metres" : "pieces"} to cart
          </Button>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            Figures include your cutting allowance and are rounded up to whole 3 m boards. Joists,
            posts and fixings are quoted separately, ask us for a full bill of materials.
          </p>
        </div>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">
          Enter your measurements above to see the number of boards, total metres and an estimated
          cost.
        </p>
      )}
    </section>
  );
}
