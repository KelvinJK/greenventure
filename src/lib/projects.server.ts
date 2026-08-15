import { createPublicSupabase } from "./catalog.server";

const PROJECT_COLUMNS =
  "id, slug, client_name, location, scope, result, image_keys, featured, sort_order";

export async function fetchProjects() {
  const supabase = createPublicSupabase();
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_COLUMNS)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}
