"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HeaderClient() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);

  const linkClass = (href: string) => {
    const active = pathname === href || (href === "/" && pathname === "/");
    return `px-3 py-2 rounded-md text-sm font-medium ${
      active
        ? "text-gray-900 font-semibold underline underline-offset-4 decoration-2 decoration-indigo-400"
        : "text-gray-600 hover:text-gray-900"
    }`;
  };

  return (
    <header className="w-full bg-white/80 backdrop-blur sticky top-0 z-40 border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand / Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt="Tuner & Metronome logo"
                width={36}
                height={36}
                priority
                className="block"
              />
              <div>
                <div className="text-lg font-semibold leading-tight">Tuner & Metronome</div>
                <div className="text-xs text-gray-500">Practice smarter</div>
              </div>
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/" className={linkClass("/")}>Tuner</Link>
            <Link href="/metronome" className={linkClass("/metronome")}>Metronome</Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label="Toggle menu"
              className="inline-flex items-center justify-center w-10 h-10 rounded-md hover:bg-gray-100"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Mobile panel */}
            <div className={`${open ? "translate-x-0" : "translate-x-full"} transform transition-transform fixed inset-y-0 right-0 w-64 bg-white shadow-lg border-l border-gray-200 p-6 z-50`}>
              <nav className="flex flex-col gap-3">
                <Link href="/" className={linkClass("/")}>Tuner</Link>
                <Link href="/metronome" className={linkClass("/metronome")}>Metronome</Link>
              </nav>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
