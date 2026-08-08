import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "get_product",
  title: "Get product",
  description:
    "Get one Green Venture Tanzania product by its slug, including full description, TZS price and unit.",
  inputSchema: {
    slug: z.string().describe("Product slug, e.g. classic-recycled-decking-plank."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ slug }) => {
    const supabase = supabaseAnon();
    const { data, error } = await supabase
      .from("products")
      .select("slug, name, category, price_tzs, unit, short_description, long_description")
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw new ToolError(error.message);
    if (!data) throw new ToolError(`No product found with slug "${slug}".`);

    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { product: data },
    };
  },
});
