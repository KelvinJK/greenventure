/**
 * Single source of truth for editorial content supplied by Green Venture Limited.
 * Nothing here may be invented: every figure, price, name and certificate
 * reference comes from the client brief. Where a value is still unconfirmed it
 * is expressed as a `confirm` string and rendered as a visible placeholder.
 */

export const company = {
  legalName: "Green Venture Limited",
  tradingName: "Green Venture Tanzania",
  shortName: "GVT",
  founded: "Founded 2015, incorporated 2018",
  companyNumber: "22443",
  vatNumber: "100-12835-S",
  factory: "Njiro Industrial Area, Nane Nane Grounds, Arusha, Tanzania",
  postal: "P.O. Box 72484, Arusha, Tanzania",
  email: "greenventuretanzania@gmail.com",
  phoneDisplay: "+255 748 576 025",
  phoneTel: "+255748576025",
  whatsapp: "255748576025",
  founder: "Edgar Edmund Tarimo",
  founderTitle: "Founder & Managing Director",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Njiro%20Industrial%20Area%2C%20Nane%20Nane%20Grounds%2C%20Arusha%2C%20Tanzania",
} as const;

export const whatsappMessage =
  "Hello Green Venture, I would like to ask about recycled plastic lumber.";

export const whatsappHref = `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(
  whatsappMessage,
)}`;

export const vatNote = "Prices exclude 18% VAT";
export const indicativeNote =
  "Prices are indicative and subject to confirmation on a written quotation.";
export const collectionNote =
  "Green Venture does not deliver. All orders are collected by the client from the Njiro yard, Arusha.";

export const warranty = [
  { term: "10 years", detail: "Structural" },
  { term: "5 years", detail: "Surface and colour" },
  { term: "1 year", detail: "Manufacturing defects" },
] as const;

export const warrantyExtension =
  "Extended structural warranty available on contract terms for large projects.";

export const impactFigures = [
  {
    value: null,
    confirm: "1,800+ or 2,000+",
    label: "tonnes of post-consumer plastic processed since founding",
  },
  {
    value: "130+",
    label: "independent waste collectors in the network, approximately 80% women",
  },
  { value: "12", label: "full-time employees, 95% under 30" },
  { value: "20", label: "carpenters trained to build with recycled lumber" },
  { value: "5,000+", label: "students reached through waste-management education sessions" },
] as const;

export const certifications = [
  { name: "OSHA Certificate of Registration of a Factory", ref: "203 602 075" },
  { name: "GCLA chemical importer registration", ref: "B002-TC000416" },
  { name: "BRELA certificate of incorporation", ref: null },
  { name: "TRA TIN and VAT registration", ref: null },
  { name: "Arusha City Council business licence", ref: null },
] as const;

export const howItsMade = [
  { step: "Collect", detail: "Post-consumer HDPE bought from independent collectors." },
  { step: "Sort", detail: "Separated by polymer type and colour." },
  { step: "Wash", detail: "Cleaned of labels, residue and contamination." },
  { step: "Granulate", detail: "Shredded and granulated into feedstock." },
  { step: "Extrude", detail: "Extruded into solid profiles under heat and pressure." },
  { step: "Finish", detail: "Cut to length, ribbed or smoothed, and finished." },
] as const;

export const valueStrip = ["No maintenance", "No termites", "No splinters"] as const;

export type Spec = { label: string; value: string };

export type ProductPage = {
  slug: string;
  title: string;
  navLabel: string;
  summary: string;
  description: string;
  specs: Spec[];
  price?: string;
  priceConfirm?: string;
  priceNote?: string;
  photo: { src?: string; shot: string; ratio: string };
};

export const productPages: ProductPage[] = [
  {
    slug: "lumber",
    title: "Construction lumber",
    navLabel: "Lumber",
    summary: "Standard plank profile, cut to order from 6 m stock lengths.",
    description:
      "Solid extruded plank in the standard construction profile. It is worked with ordinary carpentry tools, fixed with screws, and needs no sealing, staining or treatment over its life. It does not rot, warp, splinter or feed termites.",
    specs: [
      { label: "Profile", value: 'Standard plank, 4" × 1.5" (100 × 38 mm)' },
      { label: "Weight", value: "2.5 kg per linear metre" },
      { label: "Stock length", value: "6 m, cut to order" },
      { label: "Material", value: "100% post-consumer recycled HDPE" },
    ],
    price: "TSH 16,000 per linear metre, ex-VAT",
    photo: {
      src: "/media/lumber-smooth-planks.jpg",
      shot: "Stacked lumber planks in the Njiro yard",
      ratio: "4/3",
    },
  },
  {
    slug: "decking",
    title: "Decking board",
    navLabel: "Decking",
    summary: "6\" ribbed anti-slip decking board.",
    description:
      "A ribbed board with an anti-slip surface, laid on a subframe or fixed directly to an existing platform. It holds up to sun, rain and foot traffic without annual oiling or sanding.",
    specs: [
      { label: "Profile", value: '6" ribbed anti-slip board, 152 × 30 mm' },
      { label: "Coverage", value: "1 m² of decking = 12.5 linear metres" },
      { label: "Material", value: "100% post-consumer recycled HDPE" },
    ],
    priceConfirm: "decking price per m² — 118,000 / 130,000 / 160,000 TSH",
    photo: {
      src: "/media/decking-lodge-terrace.jpg",
      shot: "Ribbed decking laid on a lodge terrace",
      ratio: "4/3",
    },
  },
  {
    slug: "prefabricated-panels",
    title: "Prefabricated panels",
    navLabel: "Prefabricated panels",
    summary: "2 m² pre-assembled decking panels on an integrated lumber base frame.",
    description:
      "Pre-assembled decking panels of 2 m², built on an integrated lumber base frame. Portable and relocatable with no permanent fixing, so a camp can lift and move its platforms. Priced above fixed installations because the frame is included. Built for camps that move.",
    specs: [
      { label: "Panel size", value: "2 m² pre-assembled" },
      { label: "Base", value: "Integrated lumber base frame" },
      { label: "Fixing", value: "Portable and relocatable, no permanent fixing" },
      { label: "Material", value: "100% post-consumer recycled HDPE" },
    ],
    photo: {
      shot: "Prefabricated 2 m² panel being lifted into position at a mobile camp",
      ratio: "4/3",
    },
  },
  {
    slug: "cladding-and-bathroom-units",
    title: "Cladding and bathroom units",
    navLabel: "Cladding & bathroom units",
    summary: "Split planks for wall cladding, and demountable bathroom and toilet units.",
    description:
      "Split planks for wall cladding, and demountable bathroom and toilet units built in the workshop and bolted together on site. No wet trades, no curing time.",
    specs: [
      { label: "Cladding", value: "Split planks, fixed to a new frame or an existing wall" },
      { label: "Units", value: "Demountable bathroom and toilet units, bolted together on site" },
      { label: "Site work", value: "No wet trades, no curing time" },
      { label: "Material", value: "100% post-consumer recycled HDPE" },
    ],
    photo: {
      shot: "Demountable bathroom unit clad in split planks, being bolted together on site",
      ratio: "4/3",
    },
  },
  {
    slug: "furniture",
    title: "Furniture",
    navLabel: "Furniture",
    summary: "Adirondack chair, sun bed, picnic table, dining set and planter boxes.",
    description:
      "Outdoor furniture built from the same solid profiles as the lumber. It stays outside all year, through rain and sun, without treatment.",
    specs: [
      { label: "Range", value: "Adirondack chair" },
      { label: "Range", value: "Sun bed" },
      { label: "Range", value: "6-seater picnic table" },
      { label: "Range", value: "6-person dining set" },
      { label: "Range", value: "Planter boxes" },
      { label: "Material", value: "100% post-consumer recycled HDPE" },
    ],
    priceConfirm: "furniture price list — two versions in circulation, supply the current one",
    photo: {
      src: "/media/furniture-dining-set.jpg",
      shot: "Dining set in recycled plastic lumber",
      ratio: "4/3",
    },
  },
  {
    slug: "other",
    title: "Other products",
    navLabel: "Other products",
    summary: "School desks, fencing posts, tent platforms and custom profiles.",
    description:
      "Beyond the standard range, the factory produces school desks, fencing posts, tent platforms, and custom profiles made to drawing.",
    specs: [
      { label: "School desks", value: "Solid recycled plastic construction" },
      { label: "Fencing posts", value: "Termite and water resistant" },
      { label: "Tent platforms", value: "Built to camp layout" },
      { label: "Custom profiles", value: "Made to drawing" },
    ],
    photo: {
      src: "/media/lumber-post-100x100.jpg",
      shot: "Fencing posts stacked in the yard",
      ratio: "4/3",
    },
  },
];

export const solutions = [
  {
    title: "Complete system",
    detail:
      "A raised metal or aluminium subframe plus GVT boards, supplied and installed by Green Venture.",
    diagram: "Section drawing: raised metal subframe with GVT boards fixed over it",
  },
  {
    title: "Boards only on an existing platform",
    detail: "The client has the frame. Green Venture supplies and fits the boards.",
    diagram: "Section drawing: GVT boards fitted to a client-built platform",
  },
  {
    title: "Deck replacement",
    detail: "Strip worn timber decking and refit with GVT boards on the existing platform.",
    diagram: "Before and after drawing: worn timber stripped, GVT boards refitted",
  },
  {
    title: "Direct fix",
    detail:
      "Boards fixed straight to concrete, timber or another substrate. Wall cladding follows the same principle: split planks on a new frame, or onto an existing wall.",
    diagram: "Section drawing: boards and split cladding fixed directly to substrate",
  },
] as const;

export const quantityUnits = ["linear metres", "m²", "units"] as const;

export const installationOptions = ["Yes", "No", "Not sure"] as const;

export const orderStatuses = [
  "Received",
  "In production",
  "Ready for collection",
  "Collected",
] as const;

/** Estimator constants. Both are supplied facts, not assumptions. */
export const KG_PER_LINEAR_METRE = 2.5;
export const LINEAR_METRES_PER_SQM_DECKING = 12.5;
