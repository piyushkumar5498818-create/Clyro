import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "Gitclub — College Club Activities & Student Leadership Tracker",
  description:
    "Unified co-curricular platform for Mirai School of Technology (MSOT): NEX-CELL, Kaizen Tech (CP, Web, AI & Data Science), and MALHAR. Real-time QR check-in, rubric grading, and verifiable transcripts.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#070b16",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#070b16] text-slate-100 font-sans relative antialiased selection:bg-blue-600 selection:text-white">
        {/* Lenis Smooth Scroll Provider for entire application */}
        <SmoothScrollProvider>
          {/* Vibrant Fluid Gradient Mesh Backdrop with Electric Cobalt & Cyan Branding */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
            {/* Top-left deep electric royal blue orb */}
            <div className="absolute -top-32 -left-32 w-[680px] h-[680px] rounded-full bg-blue-700/30 blur-[150px] animate-blob" />
            
            {/* Top-right vibrant cyan / azure orb */}
            <div className="absolute -top-20 right-[5%] w-[600px] h-[600px] rounded-full bg-cyan-500/25 blur-[160px] animate-blob-slow" />
            
            {/* Right-center indigo / violet orb */}
            <div className="absolute top-[35%] -right-24 w-[540px] h-[540px] rounded-full bg-indigo-600/20 blur-[140px] animate-blob" />
            
            {/* Bottom-right emerald mint orb */}
            <div className="absolute -bottom-32 right-[10%] w-[620px] h-[620px] rounded-full bg-emerald-500/20 blur-[160px] animate-blob-slow" />
            
            {/* Bottom-left deep cobalt orb */}
            <div className="absolute -bottom-24 -left-20 w-[580px] h-[580px] rounded-full bg-blue-800/30 blur-[150px] animate-blob" />
            
            {/* Center soft azure glow */}
            <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] rounded-full bg-sky-500/15 blur-[170px] pointer-events-none" />

            {/* Subtle high-tech dot pattern texture */}
            <div className="absolute inset-0 bg-[radial-gradient(#38bdf815_1px,transparent_1px)] [background-size:28px_28px] opacity-60" />
          </div>

          {/* Content */}
          <div className="relative z-10 min-h-screen flex flex-col">
            {children}
          </div>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
