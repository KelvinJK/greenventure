import { createServerFn } from "@tanstack/react-start";

import { fetchProjects } from "./projects.server";

export const listProjects = createServerFn({ method: "GET" }).handler(async () => fetchProjects());
