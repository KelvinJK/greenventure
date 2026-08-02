ALTER TABLE public.order_items
  ALTER COLUMN quantity TYPE numeric(10,2) USING quantity::numeric(10,2),
  ALTER COLUMN quantity SET DEFAULT 1;