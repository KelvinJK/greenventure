CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  client_name text NOT NULL,
  location text NOT NULL,
  scope text NOT NULL,
  result text NOT NULL,
  image_keys text[] NOT NULL DEFAULT '{}',
  featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.projects TO anon;
GRANT SELECT ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Projects are publicly viewable" ON public.projects FOR SELECT TO anon, authenticated USING (true);

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS product_group text,
  ADD COLUMN IF NOT EXISTS specs jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS price_note text;

ALTER TABLE public.quote_requests
  ADD COLUMN IF NOT EXISTS reference text UNIQUE,
  ADD COLUMN IF NOT EXISTS location text,
  ADD COLUMN IF NOT EXISTS product text,
  ADD COLUMN IF NOT EXISTS quantity numeric,
  ADD COLUMN IF NOT EXISTS quantity_unit text,
  ADD COLUMN IF NOT EXISTS installation text,
  ADD COLUMN IF NOT EXISTS timeline text,
  ADD COLUMN IF NOT EXISTS drawing_path text;

ALTER TABLE public.quote_requests ALTER COLUMN message DROP NOT NULL;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS reference text UNIQUE,
  ADD COLUMN IF NOT EXISTS product_summary text,
  ADD COLUMN IF NOT EXISTS notes text;

CREATE SEQUENCE IF NOT EXISTS public.gvt_reference_seq;

CREATE OR REPLACE FUNCTION public.next_gvt_reference()
RETURNS text
LANGUAGE sql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 'GVT-' || to_char(now(), 'YYMM') || '-' ||
         lpad(((nextval('public.gvt_reference_seq') % 10000))::text, 4, '0')
$$;

REVOKE ALL ON FUNCTION public.next_gvt_reference() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.next_gvt_reference() TO service_role;

INSERT INTO public.projects (slug, client_name, location, scope, result, featured, sort_order) VALUES
  ('nyikani-camps', 'Nyikani Camps', 'Serengeti and Tarangire', '32 demountable bathroom units.', 'Units built in the workshop and bolted together on site.', true, 10),
  ('leonotis-adventures', 'Leonotis Adventures', 'Lake Natron', 'Cladding and decking, ongoing.', 'Ongoing supply of cladding and decking.', true, 20),
  ('nyssa-balloon-safaris', 'Nyssa Balloon Safaris', 'Serengeti', 'Octagon build and Serengeti hubs.', 'Octagon build and hub platforms delivered.', true, 30),
  ('entara-lodges', 'Entara Lodges', 'Tanzania', 'Three platforms, 120 m² of decking.', '25-year structural warranty on contract terms.', false, 40),
  ('safari-royal-holdings', 'Safari Royal Holdings', 'Tanzania', 'Seven bathroom units.', 'Seven units supplied.', false, 50),
  ('land-of-nature', 'Land of Nature', 'Tanzania', 'Ongoing supply.', 'Ongoing supply.', false, 60),
  ('zara-camps', 'Zara Camps', 'Tanzania', '56 m² cladding.', '56 m² of cladding supplied.', false, 70),
  ('mpingo-ridge-holdings', 'Mpingo Ridge Holdings', 'Tanzania', '12 sun loungers.', '12 sun loungers supplied.', false, 80),
  ('antara-arusha-national-park', 'Antara', 'Arusha National Park', '750 linear metres.', '750 linear metres of lumber supplied.', false, 90),
  ('st-jude-doris-mollel', 'The School of St Jude and Doris Mollel Foundation', 'Arusha', 'Institutional supply.', 'Institutional supply.', false, 100);