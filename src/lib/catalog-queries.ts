import { queryOptions } from "@tanstack/react-query";
import { getProduct, listDonationTiers, listProducts } from "./catalog.functions";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price_tzs: number;
  unit: string;
  short_description: string;
  long_description: string;
  image_key: string;
  sort_order: number;
};

export const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: () => listProducts(),
});

export const productQuery = (slug: string) =>
  queryOptions({
    queryKey: ["product", slug],
    queryFn: () => getProduct({ data: { slug } }),
  });

export const donationTiersQuery = queryOptions({
  queryKey: ["donation-tiers"],
  queryFn: () => listDonationTiers(),
});
