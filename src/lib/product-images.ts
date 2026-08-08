import decking from "@/assets/product-decking.jpg";
import furniture from "@/assets/product-furniture.jpg";
import lumber from "@/assets/product-lumber.jpg";
import fencing from "@/assets/product-fencing.jpg";
const deckingLodgeTerrace = { url: "/media/decking-lodge-terrace.jpg" };
const benchSetBlack = { url: "/media/furniture-bench-set-black.jpg" };
const picnicTable = { url: "/media/furniture-picnic-table.jpg" };
const diningSet = { url: "/media/furniture-dining-set.jpg" };
const poolLounger = { url: "/media/furniture-pool-lounger.jpg" };
const gardenChairSet = { url: "/media/furniture-garden-chair-set.jpg" };
const lumberGrooved = { url: "/media/lumber-grooved-boards.jpg" };
const lumberSmooth = { url: "/media/lumber-smooth-planks.jpg" };
const heritageBench = { url: "/media/furniture-heritage-bench.jpg" };
const courtyardTable = { url: "/media/furniture-courtyard-table.jpg" };
const boardwalkJetty = { url: "/media/decking-boardwalk-jetty.jpg" };
const lumberBeam = { url: "/media/lumber-beam-50x150.jpg" };
const lumberPost = { url: "/media/lumber-post-100x100.jpg" };
const deckingPlankStacks = { url: "/media/decking-plank-stacks.jpg" };

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
  "decking-plank-stacks": deckingPlankStacks.url,
  "lumber-beam-50x150": lumberBeam.url,
  "lumber-post-100x100": lumberPost.url,
  "decking-boardwalk-jetty": boardwalkJetty.url,
  "furniture-heritage-bench": heritageBench.url,
  "furniture-courtyard-table": courtyardTable.url,
};

export function productImage(key: string): string {
  return images[key] ?? decking;
}
