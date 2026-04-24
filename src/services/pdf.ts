import jsPDF from "jspdf";
import type { TranscriptionItem } from "../types";
import { auth } from "./firebase";
import logo from "../assets/asm-logo.png";

export function downloadTranscriptPdf(items: TranscriptionItem[]) {
  try {
    if (!items || items.length === 0) {
      alert("No chat messages were captured yet. Please complete at least one question/answer, then try again.");
      return;
    }

    const doc = new jsPDF({
      unit: "pt",
      format: "letter",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const lineHeight = 14;

    const CONTENT_LEFT = 60;
    const CONTENT_RIGHT = 60;
    const CONTENT_TOP = 130;
    const CONTENT_BOTTOM = pageHeight - 100;
    const maxWidth = pageWidth - CONTENT_LEFT - CONTENT_RIGHT;

    const drawHeaderFooter = () => {
      // Header Section
      // Top accent line
      doc.setDrawColor(180, 0, 0); // ASM Red
      doc.setLineWidth(2);
      doc.line(0, 80, pageWidth, 80);

      try {
        // Logo
        doc.addImage(logo, "PNG", CONTENT_LEFT, 20, 100, 50);
      } catch (e) {
        console.warn("Logo failed to load for PDF", e);
      }

      // Title/Company Name
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(30, 41, 59); // slate-800
      doc.text("ASM Educational Center (ASM)", pageWidth / 2 + 20, 50, { align: "center" });

      // Badge (Placeholder for 34 Years)
      doc.setDrawColor(180, 0, 0);
      doc.setLineWidth(1);
      doc.circle(pageWidth - 80, 45, 25);
      doc.setFontSize(14);
      doc.setTextColor(180, 0, 0);
      doc.text("34", pageWidth - 80, 45, { align: "center" });
      doc.setFontSize(8);
      doc.text("YEARS", pageWidth - 80, 55, { align: "center" });

      // Footer Section
      doc.setDrawColor(180, 0, 0);
      doc.setLineWidth(1);
      doc.line(CONTENT_LEFT, pageHeight - 70, pageWidth - CONTENT_RIGHT, pageHeight - 70);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(100);
      const footerLine1 = "11200 Rockville Pike, Suite 220 | Rockville, Maryland 20852 | USA | Phone: +1 301-984-7400";
      const footerLine2 = "Web: www.asmed.com | E-mail: info@asmed.com";
      doc.text(footerLine1, pageWidth / 2, pageHeight - 55, { align: "center" });
      doc.text(footerLine2, pageWidth / 2, pageHeight - 42, { align: "center" });
    };

    drawHeaderFooter();
    let y = CONTENT_TOP;

    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Mock Interview Chat Summary", CONTENT_LEFT, y);
    y += 24;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const userEmail = auth?.currentUser?.email || "Unknown User";
    const description = `This transcript documents a simulated Tier 1 IT Help Desk interview conducted through the ASM Educational Center Mock Interview Simulator for ${userEmail}. The content reflects candidate responses and coaching feedback for training purposes.`;
    const descriptionLines = doc.splitTextToSize(description, maxWidth);

    descriptionLines.forEach((line: string) => {
      if (y + lineHeight > CONTENT_BOTTOM) {
        doc.addPage();
        drawHeaderFooter();
        y = CONTENT_TOP;
      }
      doc.text(line, CONTENT_LEFT, y);
      y += lineHeight;
    });

    y += 14;
    doc.setFontSize(10);
    if (y + lineHeight > CONTENT_BOTTOM) {
      doc.addPage();
      drawHeaderFooter();
      y = CONTENT_TOP;
    }
    doc.text(`Generated on: ${new Date().toLocaleString()}`, CONTENT_LEFT, y);
    y += 30;

    // Chat Log Section
    items.forEach((item) => {
      const speaker = item.role === "user" ? "You" : "Coach";
      
      // Calculate block height
      const lines = doc.splitTextToSize(item.text || "", maxWidth);
      const blockHeight = (lines.length + 1) * lineHeight + 12;

      if (y + blockHeight > CONTENT_BOTTOM) {
        doc.addPage();
        drawHeaderFooter();
        y = CONTENT_TOP;
      }

      // Role background/label
      doc.setFont("helvetica", "bold");
      if (item.role === 'user') {
        doc.setTextColor(79, 70, 229); // Indigo for user
      } else {
        doc.setTextColor(51, 65, 85); // Slate for coach
      }
      doc.text(`${speaker.toUpperCase()}`, CONTENT_LEFT, y);
      y += lineHeight + 2;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(30, 41, 59);
      lines.forEach((line: string) => {
        doc.text(line, CONTENT_LEFT, y);
        y += lineHeight;
      });
      y += 12;

      // Divider line
      doc.setDrawColor(240);
      doc.setLineWidth(0.5);
      doc.line(CONTENT_LEFT, y - 6, pageWidth - CONTENT_RIGHT, y - 6);
      y += 6;
    });

    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(150);
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - CONTENT_RIGHT, pageHeight - 25, { align: "right" });
    }

    doc.save(`ASM_Mock_Interview_${new Date().toISOString().slice(0, 10)}.pdf`);
  } catch (err: any) {
    console.error("PDF generation failed:", err);
    alert("PDF download failed. Please check the browser console for details.");
  }
}
