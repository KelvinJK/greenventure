import { jsPDF } from "jspdf";

export type QuotePdfData = {
  application: string;
  material: string;
  profile: string;
  basis: string;
  allowance: string;
  pieces: number;
  metres: number;
  billed: string;
};

const FOREST: [number, number, number] = [46, 125, 50];
const CHARCOAL: [number, number, number] = [26, 26, 26];
const GREY: [number, number, number] = [110, 110, 110];

/** Builds and downloads an indicative quote PDF for the project sizer result. */
export function downloadQuotePdf(data: QuotePdfData) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const left = 48;

  doc.setFillColor(...CHARCOAL);
  doc.rect(0, 0, pageWidth, 92, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Green Venture Tanzania", left, 44);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(180, 220, 185);
  doc.text("Recycled plastic lumber, decking and furniture", left, 64);

  doc.setTextColor(...CHARCOAL);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("Indicative project quote", left, 134);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...GREY);
  const dated = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  doc.text(`Prepared ${dated}`, left, 152);

  const rows: Array<[string, string]> = [
    ["Project type", data.application],
    ["Material", data.material],
    ["Profile", data.profile],
    ["Measurements", data.basis],
    ["Cutting allowance", data.allowance],
    ["Lengths needed", `${data.pieces} x 3 m lengths`],
    ["Total metres", `${data.metres} m`],
    ["Billed quantity", data.billed],
  ];

  let y = 186;
  rows.forEach(([label, value], index) => {
    if (index % 2 === 0) {
      doc.setFillColor(245, 246, 243);
      doc.rect(left - 10, y - 13, pageWidth - (left - 10) * 2, 26, "F");
    }
    doc.setTextColor(...GREY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(label, left, y + 4);
    doc.setTextColor(...CHARCOAL);
    doc.setFont("helvetica", "bold");
    const wrapped = doc.splitTextToSize(value, pageWidth - left * 2 - 190);
    doc.text(wrapped, left + 190, y + 4);
    y += Math.max(26, wrapped.length * 14 + 12);
  });

  y += 14;

  y += 84;
  doc.setTextColor(...GREY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const note = doc.splitTextToSize(
    "Delivery, fixings, joists, substructure and site conditions will be priced in the final quote.",
    pageWidth - left * 2,
  );
  doc.text(note, left, y);

  y += note.length * 12 + 22;
  doc.setTextColor(...CHARCOAL);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Green Venture Limited", left, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...GREY);
  doc.text("Njiro Road, Arusha, Tanzania", left, y + 15);
  doc.text("(+255) 748 576 025  |  greenventuretanzania@gmail.com", left, y + 30);

  doc.save("green-venture-quote.pdf");
}
