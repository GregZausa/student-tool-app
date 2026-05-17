import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-white/10 mt-16 py-10 px-4">
    <div className="max-w-5xl mx-auto">
      {/* Top row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
            S
          </div>
          <div>
            <div className="text-sm font-bold text-white">Stud IQ</div>
            <div className="text-[10px] text-slate-500">
              PH Student Study Platform
            </div>
          </div>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {[
            { label: "Home", to: "/" },
            { label: "About", to: "/about" },
            { label: "Dashboard", to: "/dashboard" },
            { label: "Explore Decks", to: "/explore" },
            { label: "Contact", to: "/contact" },
          ].map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-white/10 pt-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 text-center sm:text-left">
            © {new Date().getFullYear()} Stud IQ. Free study tools for Filipino
            students. 🇵🇭
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/privacy-policy"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-service"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/contact"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* AdSense disclosure */}
        <p className="text-[11px] text-slate-600 text-center mt-4">
          This site uses Google AdSense to display advertisements. Ads help keep
          Stud IQ free for all students.{" "}
          <a
            href="https://www.google.com/settings/ads"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-slate-400 underline"
          >
            Opt out of personalized ads
          </a>
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
