import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AgriLink — Market Intelligence for a Stronger Tomorrow',
  description:
    'A farmer-friendly agricultural market intelligence dashboard offering historical APMC mandi price observations, regional market comparisons, and rule-based insights.',
  keywords: [
    'AgriLink',
    'Agriculture',
    'Market Intelligence',
    'APMC Mandi Prices',
    'Tomato Prices',
    'Farmer Dashboard',
    'Tamil Nadu Mandi',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-slate-50">
      <body className="min-h-full flex flex-col antialiased text-slate-900 bg-slate-50 selection:bg-emerald-100 selection:text-emerald-900">
        {children}
      </body>
    </html>
  );
}
