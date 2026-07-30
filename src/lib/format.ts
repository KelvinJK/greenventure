export function formatTzs(amount: number): string {
  return `TZS ${new Intl.NumberFormat("en-US").format(Math.round(amount))}`;
}
