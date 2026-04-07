import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { OrderRecord } from '@/types/order';

// ── Brand colors ──
const NAVY: [number, number, number] = [26, 26, 46];
const BRAND: [number, number, number] = [224, 131, 43];
const GRAY: [number, number, number] = [136, 136, 136];
const LIGHT_BG: [number, number, number] = [248, 246, 243];
const WHITE: [number, number, number] = [255, 255, 255];

const fmt = (v: number) => `KWD ${v.toFixed(3)}`;

// ── Reusable helpers ──

const drawLine = (doc: jsPDF, y: number, x1 = 20, x2 = 190) => {
  doc.setDrawColor(...GRAY);
  doc.setLineWidth(0.3);
  doc.line(x1, y, x2, y);
};

const sectionLabel = (doc: jsPDF, text: string, y: number) => {
  doc.setFontSize(8);
  doc.setTextColor(...GRAY);
  doc.setFont('helvetica', 'normal');
  doc.text(text.toUpperCase(), 20, y);
};

// ── Main PDF generator ──

export const generateInvoicePdf = (order: OrderRecord): jsPDF => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pw = doc.internal.pageSize.getWidth();

  const createdDate = new Date(order.createdAt);
  const dateStr = createdDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = createdDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  let y = 20;

  // ─── Header ───
  // Brand name
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('Mayar', 20, y);
  const mayarW = doc.getTextWidth('Mayar');
  doc.setTextColor(...BRAND);
  doc.text('Shop', 20 + mayarW, y);

  doc.setFontSize(8);
  doc.setTextColor(...GRAY);
  doc.setFont('helvetica', 'normal');
  doc.text('Premium Fashion & Lifestyle', 20, y + 5);

  // INVOICE label - right aligned
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('INVOICE', pw - 20, y, { align: 'right' });

  y += 10;
  // Header line
  doc.setDrawColor(...NAVY);
  doc.setLineWidth(0.8);
  doc.line(20, y, pw - 20, y);

  y += 10;

  // ─── Invoice Metadata ───
  const metaLeft = [
    ['Invoice No.', order.orderNumber],
    ['Order No.', order.orderNumber],
    ['Tracking ID', order.trackingId],
  ];
  const metaRight = [
    ['Date', dateStr],
    ['Time', timeStr],
    ['Payment', order.payment.name.en],
  ];

  doc.setFontSize(8);
  metaLeft.forEach(([label, val], i) => {
    doc.setTextColor(...GRAY);
    doc.setFont('helvetica', 'normal');
    doc.text(label, 20, y + i * 5);
    doc.setTextColor(...NAVY);
    doc.setFont('helvetica', 'bold');
    doc.text(val, 55, y + i * 5);
  });

  metaRight.forEach(([label, val], i) => {
    doc.setTextColor(...GRAY);
    doc.setFont('helvetica', 'normal');
    doc.text(label, 120, y + i * 5);
    doc.setTextColor(...NAVY);
    doc.setFont('helvetica', 'bold');
    doc.text(val, 150, y + i * 5);
  });

  y += 20;
  drawLine(doc, y);
  y += 8;

  // ─── Customer & Address ───
  sectionLabel(doc, 'Customer Details', y);
  const addrLabelY = y;
  doc.text('DELIVERY ADDRESS', 110, addrLabelY);
  y += 5;

  doc.setFontSize(9);
  doc.setTextColor(...NAVY);
  doc.setFont('helvetica', 'bold');
  doc.text(`${order.customer.firstName} ${order.customer.lastName}`, 20, y);
  y += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text(order.customer.phone, 20, y);
  y += 4;
  doc.text(order.customer.email, 20, y);

  // Address - right column
  let ay = addrLabelY + 5;
  doc.setFontSize(9);
  doc.setTextColor(...NAVY);
  doc.setFont('helvetica', 'bold');
  doc.text(`${order.address.area}`, 110, ay);
  ay += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text(`Block ${order.address.block}, Street ${order.address.street}`, 110, ay);
  ay += 4;
  doc.text(`Building ${order.address.building}${order.address.floor ? `, Floor ${order.address.floor}` : ''}${order.address.flatOffice ? `, ${order.address.flatOffice}` : ''}`, 110, ay);

  y = Math.max(y, ay) + 8;
  drawLine(doc, y);
  y += 5;

  // ─── Items Table ───
  const tableBody = order.items.map(item => {
    const variant = [item.color, item.size ? `Size: ${item.size}` : ''].filter(Boolean).join(' · ');
    return [
      { content: `${item.name.en}${variant ? `\n${variant}` : ''}`, styles: { cellWidth: 80 } },
      { content: String(item.quantity), styles: { halign: 'center' as const } },
      { content: fmt(item.unitPrice), styles: { halign: 'right' as const } },
      { content: fmt(item.lineTotal), styles: { halign: 'right' as const, fontStyle: 'bold' as const } },
    ];
  });

  autoTable(doc, {
    startY: y,
    head: [['Item', 'Qty', 'Unit Price', 'Total']],
    body: tableBody,
    theme: 'plain',
    margin: { left: 20, right: 20 },
    headStyles: {
      fillColor: LIGHT_BG,
      textColor: GRAY,
      fontStyle: 'bold',
      fontSize: 7.5,
      cellPadding: { top: 3, bottom: 3, left: 4, right: 4 },
    },
    bodyStyles: {
      textColor: NAVY,
      fontSize: 8.5,
      cellPadding: { top: 3.5, bottom: 3.5, left: 4, right: 4 },
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { halign: 'center', cellWidth: 20 },
      2: { halign: 'right', cellWidth: 35 },
      3: { halign: 'right', cellWidth: 35 },
    },
    alternateRowStyles: { fillColor: [252, 251, 249] },
    didDrawPage: () => {},
  });

  y = (doc as any).lastAutoTable.finalY + 8;

  // ─── Totals Section ───
  const totalsX = 120;
  const valX = pw - 20;

  const addTotalRow = (label: string, value: string, bold = false, color: readonly number[] = NAVY) => {
    doc.setFontSize(bold ? 10 : 8.5);
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setTextColor(...(color as [number, number, number]));
    doc.text(label, totalsX, y);
    doc.text(value, valX, y, { align: 'right' });
    y += bold ? 7 : 5;
  };

  addTotalRow('Subtotal', fmt(order.subtotal));
  if (order.discountTotal > 0) {
    addTotalRow(`Discount${order.promoCode ? ` (${order.promoCode})` : ''}`, `-${fmt(order.discountTotal)}`, false, BRAND);
  }
  addTotalRow('Shipping', order.shippingTotal === 0 ? 'Free' : fmt(order.shippingTotal));

  y += 1;
  doc.setDrawColor(...NAVY);
  doc.setLineWidth(0.6);
  doc.line(totalsX, y, valX, y);
  y += 6;

  addTotalRow('Total', fmt(order.total), true);

  // ─── Shipping & Payment info ───
  y += 6;
  drawLine(doc, y);
  y += 8;

  sectionLabel(doc, 'Shipping Method', y);
  doc.text('PAYMENT METHOD', 110, y);
  y += 5;

  doc.setFontSize(8.5);
  doc.setTextColor(...NAVY);
  doc.setFont('helvetica', 'normal');
  doc.text(order.shipping.name.en, 20, y);
  doc.text(order.payment.name.en, 110, y);
  y += 4;
  doc.setTextColor(...GRAY);
  doc.text(order.shipping.estimate.en, 20, y);
  doc.text(`Status: ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}`, 110, y);

  // ─── Footer ───
  const footerY = doc.internal.pageSize.getHeight() - 20;
  drawLine(doc, footerY - 5);

  doc.setFontSize(7.5);
  doc.setTextColor(...GRAY);
  doc.setFont('helvetica', 'normal');
  doc.text('Thank you for shopping with Mayar Shop', pw / 2, footerY, { align: 'center' });
  doc.text('support@mayarshop.com  ·  +965 2222 3333  ·  mayarshop.com', pw / 2, footerY + 4, { align: 'center' });
  doc.setFontSize(6.5);
  doc.text('This is a computer-generated invoice and does not require a signature.', pw / 2, footerY + 8, { align: 'center' });

  return doc;
};

// ── Public API ──

/** Download invoice as PDF file */
export const downloadInvoice = (order: OrderRecord): void => {
  const doc = generateInvoicePdf(order);
  doc.save(`Mayar-Invoice-${order.orderNumber}.pdf`);
};

/** Open print dialog for invoice */
export const printInvoice = (order: OrderRecord): void => {
  const doc = generateInvoicePdf(order);
  const blobUrl = doc.output('bloburl');
  const win = window.open(blobUrl as unknown as string, '_blank');
  if (win) {
    win.addEventListener('load', () => {
      setTimeout(() => win.print(), 300);
    });
  }
};

/** Get invoice data for display (future: GET /api/invoices/:orderId) */
export const getInvoiceData = async (orderId: string): Promise<OrderRecord | null> => {
  const { getOrderById } = await import('@/services/api/orderService');
  return getOrderById(orderId);
};
