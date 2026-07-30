import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { fetchDonationTiers, fetchProductBySlug, fetchProducts } from "./catalog.server";

export const listProducts = createServerFn({ method: "GET" }).handler(async () => {
  return fetchProducts();
});

export const getProduct = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ slug: z.string().min(1) }).parse(data))
  .handler(async ({ data }) => {
    return fetchProductBySlug(data.slug);
  });

export const listDonationTiers = createServerFn({ method: "GET" }).handler(async () => {
  return fetchDonationTiers();
});
