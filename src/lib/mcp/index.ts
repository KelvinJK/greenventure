import { defineMcp } from "@lovable.dev/mcp-js";
import listProductsTool from "./tools/list-products";
import getProductTool from "./tools/get-product";
import listDonationTiersTool from "./tools/list-donation-tiers";
import estimateBoardsTool from "./tools/estimate-boards";

export default defineMcp({
  name: "green-venture-website",
  title: "Green Venture Website",
  version: "0.1.0",
  instructions:
    "Public tools for Green Venture Tanzania, which turns plastic waste into durable decking, furniture, fencing and lumber. Use `list_products` and `get_product` to read the catalogue with TZS prices, `list_donation_tiers` for the school-desk donation tiers, and `estimate_boards_needed` to work out how many 3 m boards a project needs. These tools are read-only and expose only the public catalogue; orders, quotes and customer details are not available here.",
  tools: [listProductsTool, getProductTool, listDonationTiersTool, estimateBoardsTool],
});
