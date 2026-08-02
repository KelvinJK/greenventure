export function formatTzs(amount: number): string {
  return `TZS ${new Intl.NumberFormat("en-US").format(Math.round(amount))}`;
}

/** True when a product is priced per running metre rather than per piece. */
export function isPerMetre(unit: string): boolean {
  return unit.toLowerCase().includes("meter") || unit.toLowerCase().includes("metre");
}

/** Snaps a metre quantity to the nearest half metre we can cut and sell. */
export function snapMetres(value: number, min = 0.5, max = 999): number {
  const snapped = Math.round(value * 2) / 2;
  return Math.min(max, Math.max(min, snapped));
}

/** "12.5 m" for lumber, "3" for pieces. */
export function formatQuantity(quantity: number, unit: string): string {
  if (isPerMetre(unit)) {
    const value = Number.isInteger(quantity) ? String(quantity) : quantity.toFixed(1);
    return `${value} m`;
  }
  return String(quantity);
}
