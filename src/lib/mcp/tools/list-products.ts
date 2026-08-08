import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

const COLUMNS =
  "slug, name, category, price_tzs, unit, short_description, long_description, sort_order";

export default defineTool({
  name: "list_products",
  title: "List products",
  description:
    "List the Green Venture Tanzania recycled-plastic product catalogue (decking, furniture, fencing, lumber) with TZS prices and units. Optionally filter by category.",
  inputSchema: {
    category: z
      .string()
      .optional()
      .describe("Optional category filter, e.g. Decking, Furniture, Fencing, Lumber."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ category }) => {
    const supabase = supabaseAnon();
    let query = supabase.from("products").select(COLUMNS).order("sort_order", { ascending: true });
    if (category) query = query.ilike("category", category);

    const { data, error } = await query;
    if (error) throw new ToolError(error.message);

    const products = data ?? [];
    return {
      content: [{ type: "text", text: JSON.stringify(products, null, 2) }],
      structuredContent: { count: products.length, products },
    };
  },
});
