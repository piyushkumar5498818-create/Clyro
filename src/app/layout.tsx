import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clyro — College Club Activities Tracker",
  description:
    "Unified platform for MSOT club registries, attendance check-in, activity workflows, submissions, evaluations, and verified transcripts.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#070913] text-slate-100 font-sans relative antialiased selection:bg-indigo-500 selection:text-white">
        {/* Vibrant Organic Fluid Gradient Mesh Backdrop */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
          {/* Top-left deep indigo/violet orb */}
          <div className="absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full bg-indigo-600/35 blur-[140px] animate-blob" />
          
          {/* Top-right vibrant fuchsia/magenta orb */}
          <div className="absolute -top-20 right-[5%] w-[580px] h-[580px] rounded-full bg-fuchsia-600/30 blur-[150px] animate-blob-slow" />
          
          {/* Right-center coral/orange radiant orb */}
          <div className="absolute top-[35%] -right-24 w-[520px] h-[520px] rounded-full bg-rose-500/25 blur-[140px] animate-blob" />
          
          {/* Bottom-right electric emerald/teal mint orb */}
          <div className="absolute -bottom-32 right-[10%] w-[600px] h-[600px] rounded-full bg-emerald-500/25 blur-[150px] animate-blob-slow" />
          
          {/* Bottom-left warm orange/coral orb */}
          <div className="absolute -bottom-24 -left-20 w-[550px] h-[550px] rounded-full bg-amber-500/25 blur-[140px] animate-blob" />
          
          {/* Center soft blue accent */}
          <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-violet-600/20 blur-[160px] pointer-events-none" />

          {/* Subtle star/dot pattern texture */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:28px_28px] opacity-40" />
        </div>

        {/* Content */}
        <div className="relative z-10 min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
