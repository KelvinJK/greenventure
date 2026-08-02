import decking from "@/assets/product-decking.jpg";
import furniture from "@/assets/product-furniture.jpg";
import lumber from "@/assets/product-lumber.jpg";
import fencing from "@/assets/product-fencing.jpg";
import deckingLodgeTerrace from "@/assets/decking-lodge-terrace.jpg.asset.json";
import benchSetBlack from "@/assets/furniture-bench-set-black.jpg.asset.json";
import picnicTable from "@/assets/furniture-picnic-table.jpg.asset.json";
import diningSet from "@/assets/furniture-dining-set.jpg.asset.json";
import poolLounger from "@/assets/furniture-pool-lounger.jpg.asset.json";
import gardenChairSet from "@/assets/furniture-garden-chair-set.jpg.asset.json";
import lumberGrooved from "@/assets/lumber-grooved-boards.jpg.asset.json";
import lumberSmooth from "@/assets/lumber-smooth-planks.jpg.asset.json";

const images: Record<string, string> = {
  decking,
  furniture,
  lumber,
  fencing,
  "decking-lodge-terrace": deckingLodgeTerrace.url,
  "furniture-bench-set-black": benchSetBlack.url,
  "furniture-picnic-table": picnicTable.url,
  "furniture-dining-set": diningSet.url,
  "furniture-pool-lounger": poolLounger.url,
  "furniture-garden-chair-set": gardenChairSet.url,
  "lumber-grooved-boards": lumberGrooved.url,
  "lumber-smooth-planks": lumberSmooth.url,
};

export function productImage(key: string): string {
  return images[key] ?? decking;
}
