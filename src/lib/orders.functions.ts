import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { lookupOrderByReference } from "./orders.server";

export const lookupOrder = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ reference: z.string().trim().min(3).max(40) }).parse(data))
  .handler(async ({ data }) => lookupOrderByReference(data.reference));
