import decking from "@/assets/product-decking.jpg";
import furniture from "@/assets/product-furniture.jpg";
import lumber from "@/assets/product-lumber.jpg";
import fencing from "@/assets/product-fencing.jpg";

const images: Record<string, string> = {
  decking,
  furniture,
  lumber,
  fencing,
};

export function productImage(key: string): string {
  return images[key] ?? decking;
}
