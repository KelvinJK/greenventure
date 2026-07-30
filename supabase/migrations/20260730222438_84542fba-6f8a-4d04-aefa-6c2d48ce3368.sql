-- Make the locked-down state of customer order data explicit.
-- These tables are only ever touched by trusted server-side code (service_role).
REVOKE ALL ON public.orders FROM anon, authenticated;
REVOKE ALL ON public.order_items FROM anon, authenticated;

GRANT ALL ON public.orders TO service_role;
GRANT ALL ON public.order_items TO service_role;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders FORCE ROW LEVEL SECURITY;
ALTER TABLE public.order_items FORCE ROW LEVEL SECURITY;

-- Explicit deny-all policies: no client role can ever read or write these rows,
-- even if a permissive policy is added later (RESTRICTIVE policies AND together).
DROP POLICY IF EXISTS "Orders are never client accessible" ON public.orders;
CREATE POLICY "Orders are never client accessible"
  ON public.orders AS RESTRICTIVE
  FOR ALL TO anon, authenticated
  USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS "Order items are never client accessible" ON public.order_items;
CREATE POLICY "Order items are never client accessible"
  ON public.order_items AS RESTRICTIVE
  FOR ALL TO anon, authenticated
  USING (false) WITH CHECK (false);