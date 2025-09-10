"use client";

export default function Contact() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-2xl p-8 text-gray-800 dark:text-gray-100">
        <h1 className="text-4xl font-extrabold mb-4">Contact</h1>

        <p className="text-lg mb-6">
          I’d love to hear from you — whether it’s a bug report, feature request, or just a hello. 
        </p>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Quick links</h2>
          <ul className="space-y-2 text-sm">
            <li>
              Email: <a href="mailto:bahehdowski@gmail.com" className="underline">bahehdowski@gmail.com</a>
            </li>
            <li>
              GitHub: <a href="https://github.com/Jsaiborne" className="underline">github.com/Jsaiborne</a>
            </li>
            
            <li>
              X: <a href="https://x.com/JSaiborne?t=kW_KdHxfP09lJ2QEhxPO9g&s=08 " className="underline">@jsaiborne</a>
            </li>
            <li>
              Source code: <a href="https://github.com/Jsaiborne/tuner-plus-metronome-web" className="underline">View on GitHub</a>
            </li>
          </ul>
        </section>

        
      </div>
    </main>
  );
}
