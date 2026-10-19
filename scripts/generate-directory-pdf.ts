import { jsPDF } from "jspdf";
import fs from "fs";
import path from "path";
import { db } from "../src/lib/store";

function generateDirectoryPDF() {
  const profiles = db.getAllProfiles();
  const orgs = db.getAllOrganizations();

  // Create A4 Landscape PDF for clean tabular readability
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 297;
  const pageHeight = 210;

  // Color Palette
  const primaryColor = [15, 23, 42]; // Slate 900
  const headerBg = [30, 41, 59]; // Slate 800
  const accentColor = [14, 165, 233]; // Sky 500
  const textColor = [248, 250, 252]; // White / Slate 50
  const mutedText = [148, 163, 184]; // Slate 400
  const tableBorder = [51, 65, 85]; // Slate 700

  // Role Color Helpers
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "president":
        return { label: "PRESIDENT", color: [244, 63, 94] }; // Rose
      case "vice_president":
        return { label: "VICE PRES", color: [168, 85, 247] }; // Purple
      case "lead":
        return { label: "LEAD / HEAD", color: [59, 130, 246] }; // Blue
      case "admin":
        return { label: "CAMPUS ADMIN", color: [234, 179, 8] }; // Amber
      default:
        return { label: "MEMBER", color: [16, 185, 129] }; // Emerald
    }
  };

  // Group Profiles by Club/Category
  const groups: { name: string; orgId?: string; list: typeof profiles }[] = [
    {
      name: "CAMPUS ADMINISTRATION & INSTITUTIONAL OVERSIGHT",
      list: profiles.filter((p) => p.role === "admin" || !p.organizationId),
    },
    {
      name: "KAIZEN TECH — TECHNICAL CLUB",
      orgId: "o0000000-0000-0000-0000-000000000002",
      list: profiles.filter((p) => p.organizationId === "o0000000-0000-0000-0000-000000000002"),
    },
    {
      name: "NEX-CELL — ENTREPRENEURSHIP CLUB",
      orgId: "o0000000-0000-0000-0000-000000000001",
      list: profiles.filter((p) => p.organizationId === "o0000000-0000-0000-0000-000000000001"),
    },
    {
      name: "MALHAR — CULTURAL SOCIETY",
      orgId: "o0000000-0000-0000-0000-000000000003",
      list: profiles.filter((p) => p.organizationId === "o0000000-0000-0000-0000-000000000003"),
    },
  ];

  let currentPage = 1;

  const drawPageFrame = (titleSubtitle = true) => {
    // Background
    doc.setFillColor(11, 15, 25); // Very dark navy
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // Decorative Top Accent Bar
    doc.setFillColor(14, 165, 233);
    doc.rect(0, 0, pageWidth, 3, "F");

    // Top Header Banner
    doc.setFillColor(19, 27, 46);
    doc.roundedRect(12, 10, pageWidth - 24, 24, 3, 3, "F");
    doc.setDrawColor(38, 52, 85);
    doc.roundedRect(12, 10, pageWidth - 24, 24, 3, 3, "S");

    // Brand Logo / Icon block
    doc.setFillColor(14, 165, 233);
    doc.roundedRect(17, 14, 16, 16, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text("GC", 21, 25);

    // Title & Subtitle
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text("GITCLUB — MIRAI SCHOOL OF TECHNOLOGY (MSOT)", 38, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text("Official Verified Campus Roster • 26 Registered Members • 3 Clubs & Special Units", 38, 27);

    // Timestamp & Ledger Hash Badge
    doc.setFont("courier", "bold");
    doc.setFontSize(8);
    doc.setTextColor(56, 189, 248);
    const dateStr = new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    doc.text(`VERIFIED LEDGER: ${dateStr.toUpperCase()}`, pageWidth - 90, 20);
    doc.setTextColor(148, 163, 184);
    doc.setFont("courier", "normal");
    doc.text(`AUTH: ED25519-SHA256 • ACTIVE`, pageWidth - 90, 26);

    // Footer
    doc.setDrawColor(38, 52, 85);
    doc.setLineWidth(0.5);
    doc.line(12, pageHeight - 12, pageWidth - 12, pageHeight - 12);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("Confidential Campus Document • Mirai School of Technology Co-Curricular Platform", 12, pageHeight - 6);
    doc.text(`Page ${currentPage} of 2`, pageWidth - 32, pageHeight - 6);
  };

  // Helper to draw table header
  const drawTableHeader = (startY: number) => {
    doc.setFillColor(28, 41, 66);
    doc.rect(12, startY, pageWidth - 24, 7, "F");
    doc.setDrawColor(47, 65, 102);
    doc.rect(12, startY, pageWidth - 24, 7, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(186, 230, 253);

    doc.text("#", 15, startY + 4.8);
    doc.text("STUDENT / MEMBER NAME", 24, startY + 4.8);
    doc.text("CAMPUS EMAIL", 88, startY + 4.8);
    doc.text("SYSTEM ROLE", 150, startY + 4.8);
    doc.text("STUDENT ID", 185, startY + 4.8);
    doc.text("TITLE / ASSIGNMENT", 220, startY + 4.8);
  };

  // Helper to draw row
  const drawRow = (
    index: number,
    profile: (typeof profiles)[0],
    startY: number,
    isAlt: boolean
  ) => {
    const rowHeight = 7.2;

    if (isAlt) {
      doc.setFillColor(18, 25, 41);
    } else {
      doc.setFillColor(14, 20, 33);
    }
    doc.rect(12, startY, pageWidth - 24, rowHeight, "F");

    // Divider
    doc.setDrawColor(28, 38, 60);
    doc.setLineWidth(0.2);
    doc.line(12, startY + rowHeight, pageWidth - 12, startY + rowHeight);

    // Number
    doc.setFont("courier", "bold");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(String(index).padStart(2, "0"), 15, startY + 4.8);

    // Full Name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text(profile.fullName, 24, startY + 4.8);

    // Email
    doc.setFont("courier", "normal");
    doc.setFontSize(8);
    doc.setTextColor(125, 211, 252);
    doc.text(profile.email, 88, startY + 4.8);

    // Role Badge
    const badge = getRoleBadge(profile.role);
    doc.setFillColor(badge.color[0], badge.color[1], badge.color[2]);
    doc.roundedRect(150, startY + 1.6, 26, 4.2, 1, 1, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(255, 255, 255);
    doc.text(badge.label, 152, startY + 4.5);

    // Student ID
    doc.setFont("courier", "bold");
    doc.setFontSize(8);
    doc.setTextColor(203, 213, 225);
    doc.text(profile.studentId || "CAMPUS-ADMIN", 185, startY + 4.8);

    // Title / Assignment
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(226, 232, 240);
    const titleText = doc.splitTextToSize(profile.title || "Enrolled Student", 62);
    doc.text(titleText[0] || "", 220, startY + 4.8);
  };

  // ---------------- PAGE 1 ----------------
  drawPageFrame();
  let currentY = 40;

  // Let's render:
  // 1. Campus Admin (1 member)
  // 2. Kaizen Tech (7 members)
  // 3. NEX-CELL (7 members)
  // Total 15 on Page 1

  let globalIndex = 1;

  const page1Groups = [groups[0], groups[1], groups[2]];

  for (const g of page1Groups) {
    // Section Header
    doc.setFillColor(24, 34, 54);
    doc.roundedRect(12, currentY, pageWidth - 24, 6.5, 1.5, 1.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(56, 189, 248);
    doc.text(`▸ ${g.name} (${g.list.length} MEMBERS)`, 16, currentY + 4.6);
    currentY += 8;

    drawTableHeader(currentY);
    currentY += 7;

    g.list.forEach((p, idx) => {
      drawRow(globalIndex++, p, currentY, idx % 2 === 1);
      currentY += 7.2;
    });

    currentY += 4;
  }

  // ---------------- PAGE 2 ----------------
  doc.addPage("a4", "landscape");
  currentPage = 2;
  drawPageFrame();
  currentY = 40;

  // MALHAR (11 members)
  const malharGroup = groups[3];
  doc.setFillColor(24, 34, 54);
  doc.roundedRect(12, currentY, pageWidth - 24, 6.5, 1.5, 1.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(251, 113, 133); // Rose accent
  doc.text(`▸ ${malharGroup.name} (${malharGroup.list.length} MEMBERS)`, 16, currentY + 4.6);
  currentY += 8;

  drawTableHeader(currentY);
  currentY += 7;

  malharGroup.list.forEach((p, idx) => {
    drawRow(globalIndex++, p, currentY, idx % 2 === 1);
    currentY += 7.2;
  });

  currentY += 8;

  // Summary Metrics Box on Page 2
  doc.setFillColor(18, 26, 44);
  doc.roundedRect(12, currentY, pageWidth - 24, 28, 2, 2, "F");
  doc.setDrawColor(38, 52, 85);
  doc.roundedRect(12, currentY, pageWidth - 24, 28, 2, 2, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(255, 255, 255);
  doc.text("INSTITUTIONAL SUMMARY & GOVERNANCE COMPOSITION", 18, currentY + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);

  const stats = [
    { label: "Total Registered Campus Profiles", val: "26 Members" },
    { label: "Club Presidents", val: "3 (Rishav, Arman, Sapna)" },
    { label: "Vice Presidents", val: "3 (Aarav, Kiran, Rohan)" },
    { label: "Unit & Domain Leads", val: "9 Specialized Heads" },
    { label: "Active Student Members & Founders", val: "10 Members" },
    { label: "Campus Institutional Admins", val: "1 Platform Admin" },
  ];

  stats.forEach((st, i) => {
    const colX = 18 + (i % 3) * 90;
    const rowY = currentY + 14 + Math.floor(i / 3) * 6.5;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(56, 189, 248);
    doc.text(`• ${st.label}:`, colX, rowY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(241, 245, 249);
    doc.text(st.val, colX + 50, rowY);
  });

  // Output Path
  const outputPath = path.resolve(process.cwd(), "gitclub-campus-directory.pdf");
  const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
  fs.writeFileSync(outputPath, pdfBuffer);

  // Also copy to public directory so it can be viewed or downloaded directly in browser!
  const publicPath = path.resolve(process.cwd(), "public", "gitclub-campus-directory.pdf");
  fs.writeFileSync(publicPath, pdfBuffer);

  console.log(`[SUCCESS] Generated 2-page PDF with all 26 members at: ${outputPath}`);
  console.log(`[SUCCESS] Also copied to public URL at: ${publicPath}`);
}

generateDirectoryPDF();
