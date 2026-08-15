REVOKE ALL ON FUNCTION public.next_gvt_reference() FROM anon;
REVOKE ALL ON FUNCTION public.next_gvt_reference() FROM authenticated;
REVOKE ALL ON SEQUENCE public.gvt_reference_seq FROM anon;
REVOKE ALL ON SEQUENCE public.gvt_reference_seq FROM authenticated;