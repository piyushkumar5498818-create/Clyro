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
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans">
        {children}
      </body>
    </html>
  );
}
