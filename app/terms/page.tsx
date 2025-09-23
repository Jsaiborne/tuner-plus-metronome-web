"use client";

import React from "react";
import Link from "next/link";

export default function TermsOfUse() {
  const effectiveDate = "September 24, 2025";

  const ld = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Terms of Use — Tuner + Metronome",
    "url": typeof window !== "undefined" ? window.location.href : "https://example.com/terms",
    "description": "Terms of use for the Tuner + Metronome web application describing permitted use, disclaimers, and contact information.",
  };

  return (
    <div className="prose max-w-3xl mx-auto px-4 py-10 text-gray-800">
      {/* JSON-LD metadata */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      <header>
        <h1 className="text-3xl font-bold mb-2">Terms of Use</h1>
        <div className="text-sm text-slate-600 mb-6">
          Effective date: <span className="font-medium">{effectiveDate}</span>
        </div>
      </header>

      <section className="space-y-4">
        <p>
          By accessing or using this website and the web-based tools provided (the "Service"), you agree to be bound by these Terms of Use.
          If you do not agree with these terms, please do not use the Service.
        </p>

        <h2 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">1. Acceptance of Terms</h2>
        <p>
          These Terms govern your use of the site and any content, functionality and services offered on or through the site. We may update
          these Terms from time to time; continued use after changes constitutes acceptance of the updated Terms.
        </p>

        <h2 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">2. Permitted Use</h2>
        <p>
          You are granted a limited, non-exclusive, non-transferable, revocable license to access and use the Service for personal, non-commercial purposes,
          subject to these Terms. You may not use the Service for unlawful purposes or in ways that would violate the rights of others.
        </p>

        <h2 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">3. User Content & Conduct</h2>
        <p>
          Any content you submit (for example, feedback or messages via the contact form) must not infringe the rights of others, contain
          illegal material, or be abusive. We reserve the right to remove or disable access to any user content that violates these Terms.
        </p>

        <h2 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">4. Intellectual Property</h2>
        <p>
          Unless otherwise stated, the site and its original content, features and functionality are owned by the site operator and are protected
          by applicable intellectual property laws. You may not reproduce, distribute, modify or create derivative works of the content without
          our prior written permission.
        </p>

        <h2 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">5. Disclaimer</h2>
        <p>
          THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SITE
          WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE FROM HARMFUL COMPONENTS. TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES.
        </p>

        <h2 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">6. Limitation of Liability</h2>
        <p>
          IN NO EVENT WILL WE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES ARISING OUT OF YOUR USE OF THE SERVICE,
          EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. OUR AGGREGATE LIABILITY FOR DIRECT DAMAGES IS LIMITED TO THE AMOUNT PAID BY YOU (IF ANY)
          FOR USE OF THE SERVICE, OR INR 1,000 (ONE THOUSAND INDIAN RUPEES), WHICHEVER IS LOWER.
        </p>

        <h2 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">7. Indemnity</h2>
        <p>
          You agree to indemnify and hold harmless the site operator and its affiliates from any claims, losses, liabilities, damages, expenses
          (including reasonable attorneys' fees) arising out of your breach of these Terms or your use of the Service.
        </p>

        <h2 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">8. Third-Party Links & Advertising</h2>
        <p>
          The Service may contain links to third-party sites and may display third-party advertisements. We do not control and are not responsible
          for the content, privacy practices, or terms of those third parties. See our <Link href="/privacy" className="text-indigo-600">Privacy Policy</Link> for information about
          advertising and cookies.
        </p>

        <h2 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">9. Termination</h2>
        <p>
          We may suspend or terminate your access to the Service at any time, without prior notice or liability, for any reason including breach
          of these Terms or unlawful conduct.
        </p>

        <h2 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">10. Governing Law & Dispute Resolution</h2>
        <p>
          These Terms are governed by and construed in accordance with the laws of India. By using the Service you agree that any dispute shall be
          subject to the exclusive jurisdiction of the courts located in India.
        </p>

        <h2 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">11. Changes to the Terms</h2>
        <p>
          We reserve the right to modify or update these Terms at any time. We will post the updated Terms on this page with a revised effective
          date. Your continued use after changes means you accept the updated Terms.
        </p>

        <h2 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">12. Contact</h2>
        <p>
          If you have questions about these Terms, please contact us:
        </p>
        <p>
          Email:{" "}
          <a href="mailto:bahehdowski@gmail.com" className="font-medium text-indigo-600 underline">
            bahehdowski@gmail.com
          </a>
        </p>

        <h2 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">13. Severability</h2>
        <p>
          If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum
          extent necessary and the remaining provisions will remain in full force and effect.
        </p>

        <h2 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">14. Entire Agreement</h2>
        <p>
          These Terms constitute the entire agreement between you and the site operator regarding the Service and supersede all prior agreements.
        </p>
      </section>
    </div>
  );
}
