CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  category text NOT NULL,
  price_tzs integer NOT NULL,
  unit text NOT NULL DEFAULT 'each',
  short_description text NOT NULL,
  long_description text NOT NULL DEFAULT '',
  image_key text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.products TO anon;
GRANT SELECT ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are publicly viewable" ON public.products FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.donation_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  amount_tzs integer,
  is_custom boolean NOT NULL DEFAULT false,
  description text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.donation_tiers TO anon;
GRANT SELECT ON public.donation_tiers TO authenticated;
GRANT ALL ON public.donation_tiers TO service_role;
ALTER TABLE public.donation_tiers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Donation tiers are publicly viewable" ON public.donation_tiers FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_type text NOT NULL DEFAULT 'shop',
  customer_name text,
  customer_email text,
  customer_phone text,
  description text,
  total_tzs integer NOT NULL,
  currency text NOT NULL DEFAULT 'TZS',
  status text NOT NULL DEFAULT 'pending',
  payment_reference text,
  checkout_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  unit_price_tzs integer NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.products (slug, name, category, price_tzs, unit, short_description, long_description, image_key, sort_order) VALUES
('classic-recycled-decking-plank', 'Classic Recycled Decking Plank', 'Decking', 15000, 'per meter', 'Our best-selling deck board, milled from 100% post-consumer plastic waste.', 'The Classic Recycled Decking Plank is pressed from shredded post-consumer plastic collected across Dar es Salaam and Arusha. Each board is solid through its full 25mm thickness, so it never needs sealing, staining or oiling, and it will not splinter underfoot even after a decade in full coastal sun.

Fitted with standard hidden clips over a plastic joist frame, a Classic deck shrugs off the long rains, salt air and termites that destroy hardwood in a few seasons. Expect a service life beyond 50 years with nothing more than an occasional wash.', 'decking', 1),
('wide-terrace-decking-board', 'Wide Terrace Decking Board', 'Decking', 22000, 'per meter', 'A 200mm wide board for hotel terraces, pool surrounds and jetties.', 'The Wide Terrace board halves the number of fixings needed on large spans, which makes it the fastest way to lay a hotel terrace, pool surround or lakeside jetty. Its wider face gives a calmer, more architectural rhythm to big areas of deck.

Because the material is non-porous, water simply runs off rather than soaking in. That means no rot around fixings, no black mould in the shade, and a surface that stays cool and grippy when wet.', 'decking', 2),
('heritage-park-bench', 'Heritage Park Bench', 'Furniture', 480000, 'each', 'A two-metre public bench that survives weather, termites and heavy daily use.', 'The Heritage Park Bench pairs a moulded recycled-plastic frame with six full-length slats, giving comfortable seating for three adults. It is specified by municipalities, schools and hotels that are tired of replacing timber benches every other year.

Every component is colour-through, so scratches and knocks never expose raw material underneath. Bolt it down to a slab or set the legs in concrete and it will outlast the building it sits beside.', 'furniture', 3),
('courtyard-dining-table', 'Courtyard Dining Table', 'Furniture', 950000, 'each', 'A six-seater outdoor table that can be left in the sun and rain year round.', 'The Courtyard Dining Table is built from 40mm recycled plastic lumber on a welded internal frame, giving it the reassuring heft of hardwood without any of the maintenance. Leave it outside through a full rainy season and simply wipe it down.

The surface is food-safe, non-absorbent and easy to clean, which makes it a practical choice for restaurants, lodges and family courtyards alike.', 'furniture', 4),
('privacy-fence-slat', 'Privacy Fence Slat', 'Fencing', 9500, 'per meter', 'Interlocking slats for boundary walls, screens and compound fencing.', 'Privacy Fence Slats interlock without fixings along their length, so a run of fence goes up quickly and stays rigid in wind. They are widely used for compound boundaries, generator screens and refuse enclosures.

Unlike timber palings, these slats do not warp, and unlike sheet metal they do not rust or bake in the sun. The colour is moulded through the section, so a knock never means a repaint.', 'fencing', 5),
('structural-post-100x100', 'Structural Post 100x100', 'Lumber', 28000, 'per meter', 'A solid load-bearing post for pergolas, walkways and marine structures.', 'The 100x100 Structural Post carries the loads of pergolas, covered walkways, boardwalks and small marine structures. Because the plastic is inert, it can be set directly into wet ground or concrete without the rot that claims timber posts within a few years.

It cuts, drills and fixes with ordinary woodworking tools, so your existing carpentry team needs no retraining to build with it.', 'lumber', 6),
('structural-beam-50x150', 'Structural Beam 50x150', 'Lumber', 34000, 'per meter', 'A joist and beam section for decks, roofs and framing.', 'The 50x150 Structural Beam is the workhorse of our framing range, used for deck joists, roof purlins and stud framing where moisture would normally be a problem. Reinforced sections are available for longer spans on request.

Every beam diverts roughly forty kilograms of plastic waste from Tanzanian waterways and landfills, so the structure you build is also the reason that waste never reached the ocean.', 'lumber', 7),
('boardwalk-jetty-plank', 'Boardwalk & Jetty Plank', 'Decking', 26000, 'per meter', 'A heavy-duty marine-grade plank for jetties and lakeside boardwalks.', 'The Boardwalk & Jetty Plank is our thickest deck section, developed for constant contact with fresh and salt water. It does not absorb moisture, so it neither swells nor harbours the borers that destroy timber jetties.

A textured top face keeps footing secure when wet, making it a safe choice for public boardwalks, fishing jetties and pool edges.', 'decking', 8);

INSERT INTO public.donation_tiers (slug, name, amount_tzs, is_custom, description, sort_order) VALUES
('one-desk', 'One Desk', 150000, false, 'Provides a durable desk for one student.', 1),
('classroom-set', 'A Classroom Set', 1500000, false, 'Equips an entire row of desks.', 2),
('corporate-partner', 'Corporate Partner', NULL, true, 'Transforms a whole school.', 3);