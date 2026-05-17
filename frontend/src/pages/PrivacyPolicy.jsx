import { useNavigate } from "react-router-dom";

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-xl font-bold text-white mb-3">{title}</h2>
    <div className="text-slate-300 text-sm leading-relaxed space-y-3">{children}</div>
  </div>
);

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">

        {/* Back */}
        <button
          onClick={() => navigate("/")}
          className="text-slate-400 hover:text-white text-sm mb-8 flex items-center gap-2 transition-colors cursor-pointer"
        >
          ← Back to Home
        </button>

        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-slate-400 text-sm mb-10">
          Last updated: {new Date().toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <Section title="1. Overview">
          <p>
            Stud IQ ("we", "us", or "our") operates the website{" "}
            <span className="text-indigo-400">student-tool-app.vercel.app</span> (the "Service").
            This page informs you of our policies regarding the collection, use, and disclosure
            of personal data when you use our Service and the choices you have associated with that data.
          </p>
          <p>
            We are committed to protecting your privacy. By using Stud IQ, you agree to the
            collection and use of information in accordance with this policy.
          </p>
        </Section>

        <Section title="2. Information We Collect">
          <p>We collect minimal information to provide and improve our Service:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-white">Name (optional):</strong> When you set up your profile,
              you may provide a name or nickname. This is stored to personalize your experience.
            </li>
            <li>
              <strong className="text-white">Anonymous User ID:</strong> We generate a unique
              anonymous identifier (UUID) stored in your browser's local storage. This allows us
              to save your data (todos, deadlines, notes, decks) without requiring an account.
            </li>
            <li>
              <strong className="text-white">Usage Data:</strong> We may collect information on
              how the Service is accessed and used. This may include your browser type, pages
              visited, time and date of visit, and other diagnostic data.
            </li>
          </ul>
        </Section>

        <Section title="3. How We Use Your Data">
          <p>We use the collected data for the following purposes:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>To provide and maintain our Service</li>
            <li>To save your personal study data (tasks, notes, deadlines, flashcard decks)</li>
            <li>To personalize your dashboard experience</li>
            <li>To detect, prevent, and address technical issues</li>
            <li>To improve the overall functionality and user experience of our Service</li>
          </ul>
        </Section>

        <Section title="4. Google AdSense & Cookies">
          <p>
            Stud IQ uses Google AdSense to display advertisements. Google AdSense uses cookies
            and similar tracking technologies to serve ads based on your prior visits to our
            website or other websites on the internet.
          </p>
          <p>
            Google's use of advertising cookies enables it and its partners to serve ads to you
            based on your visit to our site and/or other sites on the Internet. You may opt out
            of personalized advertising by visiting{" "}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 underline"
            >
              Google Ads Settings
            </a>
            .
          </p>
          <p>
            For more information on how Google uses data when you use our site, please visit{" "}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 underline"
            >
              Google's Privacy & Terms
            </a>
            .
          </p>
        </Section>

        <Section title="5. Data Storage">
          <p>
            Your study data (todos, notes, deadlines, flashcard decks) is stored in Supabase,
            a secure cloud database provider. Data is associated with your anonymous UUID and
            is not linked to any personally identifiable information unless you choose to provide
            your name.
          </p>
          <p>
            We retain your data for as long as your anonymous session is active. You may request
            deletion of your data at any time by contacting us.
          </p>
        </Section>

        <Section title="6. Third-Party Services">
          <p>We use the following third-party services:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-white">Supabase</strong> — database storage.{" "}
              <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline">Privacy Policy</a>
            </li>
            <li>
              <strong className="text-white">Google AdSense</strong> — advertising.{" "}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline">Privacy Policy</a>
            </li>
            <li>
              <strong className="text-white">Open Trivia Database (OpenTDB)</strong> — quiz questions.{" "}
              <a href="https://opentdb.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline">Website</a>
            </li>
            <li>
              <strong className="text-white">Vercel</strong> — hosting.{" "}
              <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline">Privacy Policy</a>
            </li>
          </ul>
        </Section>

        <Section title="7. Children's Privacy">
          <p>
            Our Service is intended for use by students. We do not knowingly collect personally
            identifiable information from anyone under the age of 13. If you are a parent or
            guardian and you are aware that your child has provided us with personal data, please
            contact us so we can take the necessary steps to remove that information.
          </p>
        </Section>

        <Section title="8. Your Rights">
          <p>You have the right to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt out of personalized advertising via Google Ads Settings</li>
          </ul>
        </Section>

        <Section title="9. Changes to This Policy">
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes
            by posting the new Privacy Policy on this page and updating the "Last updated" date.
            You are advised to review this Privacy Policy periodically for any changes.
          </p>
        </Section>

        <Section title="10. Contact Us">
          <p>
            If you have any questions about this Privacy Policy, please contact us at{" "}
            <a href="/contact" className="text-indigo-400 hover:text-indigo-300 underline">
              our contact page
            </a>
            .
          </p>
        </Section>

      </div>
    </div>
  );
};

export default PrivacyPolicy;