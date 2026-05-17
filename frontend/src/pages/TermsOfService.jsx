import { useNavigate } from "react-router-dom";

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-xl font-bold text-white mb-3">{title}</h2>
    <div className="text-slate-300 text-sm leading-relaxed space-y-3">
      {children}
    </div>
  </div>
);

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-black to-slate-900 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <button
          onClick={() => navigate("/")}
          className="text-slate-400 hover:text-white text-sm mb-8 flex items-center gap-2 transition-colors cursor-pointer"
        >
          ← Back to Home
        </button>

        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-slate-400 text-sm mb-10">
          Last updated:{" "}
          {new Date().toLocaleDateString("en-PH", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <Section title="1. Acceptance of Terms">
          <p>
            By accessing and using Stud IQ ("the Service") at{" "}
            <span className="text-indigo-400">student-tool-app.vercel.app</span>
            , you accept and agree to be bound by these Terms of Service. If you
            do not agree to these terms, please do not use our Service.
          </p>
        </Section>

        <Section title="2. Description of Service">
          <p>
            Stud IQ is a free web-based study tool platform designed for
            Filipino students. The Service includes tools such as:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>GPA / GWA Calculator</li>
            <li>Pomodoro Timer with ambient sounds</li>
            <li>Quiz Generator powered by OpenTDB</li>
            <li>To-do list and task management</li>
            <li>Deadline tracker with notifications</li>
            <li>Notes and learning materials organizer</li>
            <li>Flashcard and quiz deck maker</li>
          </ul>
        </Section>

        <Section title="3. User Accounts">
          <p>
            Stud IQ does not require traditional account registration. Instead,
            we use an anonymous identifier stored in your browser to save your
            data. You are responsible for maintaining access to your browser
            session.
          </p>
          <p>
            If you clear your browser's local storage, your anonymous session ID
            may be lost. We are not responsible for loss of data resulting from
            browser data clearance.
          </p>
        </Section>

        <Section title="4. User Content">
          <p>
            You may create and store content within Stud IQ including notes,
            tasks, deadlines, and flashcard decks. You retain ownership of any
            content you create.
          </p>
          <p>
            By making a deck or content "public", you grant other users of the
            Service the right to view and clone that content for personal
            educational use.
          </p>
          <p>You agree not to create content that is:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Illegal, harmful, or offensive</li>
            <li>Plagiarized or infringing on intellectual property rights</li>
            <li>Misleading or intended to deceive other users</li>
            <li>Spam or commercially motivated</li>
          </ul>
        </Section>

        <Section title="5. Advertising">
          <p>
            Stud IQ displays advertisements through Google AdSense to support
            the free provision of our Service. By using our Service, you agree
            to the display of these advertisements.
          </p>
          <p>
            We do not control the content of third-party advertisements
            displayed on our platform. For information on how to opt out of
            personalized ads, please visit{" "}
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
        </Section>

        <Section title="6. Intellectual Property">
          <p>
            The Stud IQ name, logo, design, and original content are the
            intellectual property of Stud IQ and are protected by applicable
            copyright and trademark laws.
          </p>
          <p>
            Quiz questions sourced from the Open Trivia Database (OpenTDB) are
            provided under the{" "}
            <a
              href="https://creativecommons.org/licenses/by-sa/4.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 underline"
            >
              Creative Commons Attribution-ShareAlike 4.0 International License
            </a>
            .
          </p>
        </Section>

        <Section title="7. Disclaimer of Warranties">
          <p>
            The Service is provided on an "as is" and "as available" basis
            without any warranties of any kind, either express or implied. We do
            not warrant that the Service will be uninterrupted, error-free, or
            completely secure.
          </p>
          <p>
            GPA calculations and other computational tools are provided for
            informational purposes only. Always verify important academic
            calculations with your institution.
          </p>
        </Section>

        <Section title="8. Limitation of Liability">
          <p>
            To the maximum extent permitted by law, Stud IQ shall not be liable
            for any indirect, incidental, special, consequential, or punitive
            damages resulting from your use of or inability to use the Service.
          </p>
        </Section>

        <Section title="9. Changes to Terms">
          <p>
            We reserve the right to modify these Terms of Service at any time.
            Changes will be effective immediately upon posting to the website.
            Your continued use of the Service after any changes constitutes your
            acceptance of the new terms.
          </p>
        </Section>

        <Section title="10. Governing Law">
          <p>
            These Terms shall be governed and construed in accordance with the
            laws of the Republic of the Philippines, without regard to its
            conflict of law provisions.
          </p>
        </Section>

        <Section title="11. Contact">
          <p>
            For questions about these Terms, please visit our{" "}
            <a
              href="/contact"
              className="text-indigo-400 hover:text-indigo-300 underline"
            >
              contact page
            </a>
            .
          </p>
        </Section>
      </div>
    </div>
  );
};

export default TermsOfService;
