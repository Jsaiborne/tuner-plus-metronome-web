"use client";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">
        Your privacy is important to us. This website does not directly collect,
        store, or share any personal information about visitors.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Third-Party Advertising</h2>
      <p className="mb-4">
        We use third-party advertising services, including Google AdSense, to
        display ads on this website. These services may use cookies and similar
        technologies to serve relevant ads based on your interests.
      </p>
      <p className="mb-4">
        Google, as a third-party vendor, uses cookies to serve ads. Google’s use
        of the <em>DoubleClick DART cookie</em> enables it and its partners to
        serve ads to users based on their visit to this site and other sites on
        the Internet. Users may opt out of personalized advertising by visiting{" "}
        <a
          href="https://www.google.com/settings/ads/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 underline"
        >
          Google Ads Settings
        </a>
        .
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Cookies</h2>
      <p className="mb-4">
        Cookies are small text files stored in your browser. They may be used by
        advertising partners to measure ad performance and deliver more relevant
        ads. You can choose to disable cookies through your browser settings,
        though this may affect your experience.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Your Choices</h2>
      <p className="mb-4">
        You can learn more about how Google uses information from partner sites
        at{" "}
        <a
          href="https://policies.google.com/technologies/partner-sites"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 underline"
        >
          Google Privacy & Terms
        </a>
        .
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Contact</h2>
      <p>
        If you have any questions about this Privacy Policy, you may contact us
        at: <span className="font-medium">[your email or contact form link]</span>
      </p>
    </div>
  );
}
