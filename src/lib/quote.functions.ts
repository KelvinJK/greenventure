import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { saveQuoteRequest } from "./quote.server";

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  company: z.string().trim().max(160).optional().nullable(),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional().nullable(),
  location: z.string().trim().max(200).optional().nullable(),
  product: z.string().trim().max(200).optional().nullable(),
  quantity: z.number().nonnegative().max(1_000_000).optional().nullable(),
  quantityUnit: z.string().trim().max(40).optional().nullable(),
  installation: z.string().trim().max(40).optional().nullable(),
  timeline: z.string().trim().max(200).optional().nullable(),
  message: z.string().trim().max(4000).optional().nullable(),
  drawing: z
    .object({
      name: z.string().min(1).max(200),
      contentBase64: z.string().max(8_000_000),
      contentType: z.string().max(120),
    })
    .optional()
    .nullable(),
});

export const submitQuoteRequest = createServerFn({ method: "POST" })
  .inputValidator((data) => schema.parse(data))
  .handler(async ({ data }) =>
    saveQuoteRequest({
      name: data.name,
      company: data.company || null,
      email: data.email,
      phone: data.phone || null,
      location: data.location || null,
      product: data.product || null,
      quantity: data.quantity ?? null,
      quantityUnit: data.quantityUnit || null,
      installation: data.installation || null,
      timeline: data.timeline || null,
      message: data.message || null,
      drawing: data.drawing ?? null,
    }),
  );
