import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "list_donation_tiers",
  title: "List donation tiers",
  description:
    "List the Green Venture Tanzania school-desk donation tiers with their TZS amounts and descriptions.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async () => {
    const supabase = supabaseAnon();
    const { data, error } = await supabase
      .from("donation_tiers")
      .select("slug, name, amount_tzs, is_custom, description, sort_order")
      .order("sort_order", { ascending: true });

    if (error) throw new ToolError(error.message);

    const tiers = data ?? [];
    return {
      content: [{ type: "text", text: JSON.stringify(tiers, null, 2) }],
      structuredContent: { count: tiers.length, tiers },
    };
  },
});
