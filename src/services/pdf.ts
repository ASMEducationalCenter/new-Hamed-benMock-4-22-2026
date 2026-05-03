import jsPDF from "jspdf";
import type { TranscriptionItem } from "../types";
import asmTemplate from "../assets/asm-template.jpg";
import { auth } from "./firebase";

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

    const drawTemplate = () => {
      // Note: asmTemplate should be a base64 string or a valid image source
      doc.addImage(asmTemplate, "JPEG", 0, 0, pageWidth, pageHeight);
    };

    drawTemplate();
    let y = CONTENT_TOP;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("ASM Educational Center Mock Interview Chat Summary", CONTENT_LEFT, y);
    y += 24;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const userEmail = auth?.currentUser?.email || "Unknown User";
    const description = `This transcript documents a simulated Tier 1 IT Help Desk interview conducted through the ASM Educational Center Mock Interview Simulator for ${userEmail}. The content reflects candidate responses and coaching feedback for training purposes.`;
    const descriptionLines = doc.splitTextToSize(description, maxWidth);

    descriptionLines.forEach((line: string) => {
      if (y + lineHeight > CONTENT_BOTTOM) {
        doc.addPage();
        drawTemplate();
        y = CONTENT_TOP;
      }
      doc.text(line, CONTENT_LEFT, y);
      y += lineHeight;
    });

    y += 14;
    doc.setFontSize(10);
    if (y + lineHeight > CONTENT_BOTTOM) {
      doc.addPage();
      drawTemplate();
      y = CONTENT_TOP;
    }
    doc.text(`Generated on: ${new Date().toLocaleString()}`, CONTENT_LEFT, y);
    y += 20;

    doc.setDrawColor(180);
    doc.line(CONTENT_LEFT, y, pageWidth - CONTENT_RIGHT, y);
    y += 20;

    doc.setFontSize(11);
    items.forEach((item) => {
      const speaker = item.role === "user" ? "You" : "Coach";
      if (y + lineHeight > CONTENT_BOTTOM) {
        doc.addPage();
        drawTemplate();
        y = CONTENT_TOP;
      }
      doc.setFont("helvetica", "bold");
      doc.text(`${speaker}:`, CONTENT_LEFT, y);
      y += lineHeight;

      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(item.text || "", maxWidth);
      lines.forEach((line: string) => {
        if (y + lineHeight > CONTENT_BOTTOM) {
          doc.addPage();
          drawTemplate();
          y = CONTENT_TOP;
        }
        doc.text(line, CONTENT_LEFT, y);
        y += lineHeight;
      });
      y += 12;
    });

    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - 50, pageHeight - 25, { align: "right" });
    }

    doc.save(`ASM_Mock_Interview_${new Date().toISOString().slice(0, 10)}.pdf`);
  } catch (err: any) {
    console.error("PDF generation failed:", err);
    alert("PDF download failed. Please check the browser console for details.");
  }
}
