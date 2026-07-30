import { createServerFn } from "@tanstack/react-start";
import { getRequestUrl } from "@tanstack/react-start/server";
import { z } from "zod";
import {
  fetchOrderSummary,
  startDonationCheckout,
  startShopCheckout,
} from "./checkout.server";

const customerSchema = z.object({
  name: z.string().trim().max(120).optional().nullable(),
  email: z.string().trim().email().max(200).optional().nullable().or(z.literal("")),
  phone: z.string().trim().max(40).optional().nullable(),
});

export const createShopCheckoutSession = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        items: z
          .array(z.object({ slug: z.string().min(1).max(120), quantity: z.number().int().min(1).max(999) }))
          .min(1)
          .max(50),
        customer: customerSchema,
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    return startShopCheckout(
      data.items,
      {
        name: data.customer.name ?? null,
        email: data.customer.email || null,
        phone: data.customer.phone ?? null,
      },
      getRequestUrl().toString(),
    );
  });

export const createDonationCheckoutSession = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        amountTzs: z.number().int().min(1000).max(2_000_000_000),
        tierName: z.string().min(1).max(120),
        customer: customerSchema,
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    return startDonationCheckout(
      data.amountTzs,
      data.tierName,
      {
        name: data.customer.name ?? null,
        email: data.customer.email || null,
        phone: data.customer.phone ?? null,
      },
      getRequestUrl().toString(),
    );
  });

export const getOrderSummary = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ orderId: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    return fetchOrderSummary(data.orderId);
  });
