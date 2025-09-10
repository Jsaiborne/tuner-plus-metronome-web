"use client";

export default function About() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-2xl p-8 text-gray-800 dark:text-gray-100">
        <h1 className="text-4xl font-extrabold mb-4">About</h1>

        <p className="text-lg mb-4">
          I am <strong>Jotham Saiborne</strong> — a masters computer science student, web developer, and hobbyist musician.
        </p>

        <section className="space-y-3 mb-4">
          <p>
          This tuner + metronome started as a side project: I wanted to build something that would be of use to myself and others — not just an experiment. Over time it grew into a small, focused app that I hope would be of use in your music practice.
          </p>

          <p>
            To help fund my studies and continue developing the app, it includes unobtrusive ads. My aim is to keep the experience simple and free while respecting your attention.
          </p>

          <p>
            If you have suggestions, feature requests, or find a bug, I would love to hear from you. Please <a href="/contact" className="underline">get in touch</a> — your feedback helps me improve the app.
          </p>
        </section>

        <p className="text-sm text-gray-500 mt-8">
          As a Christian, I give thanks and glory to God for all his blessings on me. Thank you for using the app — I hope it helps you become a better musician.
        </p>
      </div>
    </main>
  );
}





















// "use client";

// export default function About() {
//   return (
//     <main className="max-w-3xl mx-auto px-6 py-12">
//       <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-2xl p-8 text-gray-800 dark:text-gray-100">
//         <h1 className="text-4xl font-extrabold mb-4">About</h1>

//         <p className="text-lg mb-4">
//           I'm <strong>Jotham Saiborne</strong> — a computer science student, web developer, and hobbyist musician.
//         </p>

//         <section className="space-y-3 mb-4">
//           <p>
//             This tuner + metronome started as a side project: I wanted to build something that would be of use to myself and others — not just an experiment. Over time it grew into a small, focused app that I hope would be of use in your music practice.
//           </p>

//           <p>
//             To support my studies and keep development moving, the app includes unobtrusive ads. My goal is to maintain a simple, ad-friendly experience while keeping the app free to use.
//           </p>

//           <p>
//             If you have suggestions, feature requests, or find a bug, I would love to hear from you. Please <a href="/contact" className="underline">get in touch</a> — feedback helps me improve the app.
//           </p>
//         </section>

//         <div className="flex flex-wrap gap-3 mt-6">
//           <a
//             href="/contact"
//             className="inline-block px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 font-medium hover:shadow"
//           >
//             Contact
//           </a>

//           <a
//             href="/privacy"
//             className="inline-block px-4 py-2 rounded-lg bg-transparent border border-gray-200 dark:border-gray-700 font-medium hover:bg-gray-50"
//           >
//             Privacy
//           </a>
//         </div>

//         <p className="text-sm text-gray-500 mt-8">
//           As a Christian, I give thanks to God for His guidance and provision. Thank you for using the app — I hope it helps you become a better musician.
//         </p>
//       </div>
//     </main>
//   );
// }
