// app/layout.client.tsx
import "./globals.css";
import React from "react";
import HeaderClient from "./HeaderClient";

export const metadata = {
  title: "Tuner — Metronome",
  description: "Tuner and metronome web app for practice",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        {/* Skip link for accessibility */}
        <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-3 focus:py-2 focus:rounded shadow">Skip to content</a>

        {/* Client header with active-link highlighting */}
        <HeaderClient />

        <main id="content" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {children}
        </main>

        <footer className="mt-12 border-t border-gray-200 bg-white/60">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
            <div>© {new Date().getFullYear()} Tuner & Metronome — Built with ❤️</div>
            <div className="flex items-center gap-4">
              <a href="/privacy" className="hover:underline">Privacy</a>
              <a href="/terms" className="hover:underline">Terms</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
