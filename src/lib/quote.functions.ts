import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { saveQuoteRequest } from "./quote.server";

export const submitQuoteRequest = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        name: z.string().trim().min(1).max(120),
        company: z.string().trim().max(160).optional().nullable(),
        email: z.string().trim().email().max(200),
        phone: z.string().trim().max(40).optional().nullable(),
        message: z.string().trim().min(1).max(4000),
      })
      .parse(data),
  )
  .handler(async ({ data }) =>
    saveQuoteRequest({
      name: data.name,
      company: data.company || null,
      email: data.email,
      phone: data.phone || null,
      message: data.message,
    }),
  );
