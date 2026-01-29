export default function About() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-2xl p-8 text-gray-800 dark:text-gray-100">
        <h1 className="text-4xl font-extrabold mb-4">About the Project</h1>

        <p className="text-lg mb-6">
          I am <strong>Jotham Saiborne</strong> — a Masters Computer Science student, web developer, and hobbyist musician. I built this <strong>Professional Web Tuner and Metronome</strong> to solve a personal frustration: finding a clean, ad-light, and technically accurate practice tool that works directly in the browser.
        </p>

        <section className="space-y-6 mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">Technical Precision</h2>
            <p>
              This app utilizes the <strong>Web Audio API</strong> for high-fidelity pitch detection and rhythmic accuracy. The tuner uses an autocorrelation algorithm to provide real-time frequency feedback for guitar, violin, and other chromatic instruments. Unlike many web tools, all audio processing happens locally on your device, ensuring zero latency and total privacy.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-2">Our Mission</h2>
            <p>
              This project started as a fun side experiment but grew into a focused application for musicians of all levels. Whether you are a student practicing scales or a professional fine-tuning your instrument before a session, the goal is to provide a seamless, high-performance interface.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-2">Support & Development</h2>
            <p>
              To maintain the server infrastructure required for real-time audio analysis and to support my ongoing graduate research in computer science, this site utilizes a non-intrusive support model. This approach ensures that the essential tuner and metronome functionalities remain free of charge, providing a professional environment that respects the musician&aposs focus and attention. I am committed to keeping these tools accessible to help fellow musicians improve their craft.
            </p>
          </div>
        </section>

        <p className="text-sm text-gray-500 mt-8 border-t pt-4 italic">
          As a Christian, I give thanks and glory to God for the ability to create and share these tools. Thank you for being part of this journey—I hope this app helps you find your rhythm and stay in tune.
        </p>
      </div>
    </main>
  );
}