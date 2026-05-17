import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    // In production, connect this to a form service like Formspree or EmailJS
    // For now, we simulate a successful send
    setSent(true);
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 text-white">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <button
          onClick={() => navigate("/")}
          className="text-slate-400 hover:text-white text-sm mb-8 flex items-center gap-2 transition-colors cursor-pointer"
        >
          ← Back to Home
        </button>

        <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
        <p className="text-slate-400 text-sm mb-10">
          Have a question, suggestion, or issue? We'd love to hear from you.
        </p>

        {sent ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-8 text-center">
            <div className="text-4xl mb-3">✅</div>
            <h2 className="text-xl font-bold text-emerald-400 mb-2">
              Message sent!
            </h2>
            <p className="text-slate-300 text-sm">
              Thanks for reaching out. We'll get back to you as soon as
              possible.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-6 bg-indigo-500 hover:bg-indigo-600 px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">
                Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">
                Email
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">
                Subject
              </label>
              <select className={inputClass + " cursor-pointer"}>
                <option value="general">General question</option>
                <option value="bug">Bug report</option>
                <option value="feature">Feature request</option>
                <option value="adsense">Ad / content issue</option>
                <option value="privacy">Privacy concern</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">
                Message
              </label>
              <textarea
                placeholder="Tell us what's on your mind..."
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setError("");
                }}
                rows={5}
                className={inputClass + " resize-none"}
              />
            </div>

            {error && <p className="text-red-400 text-xs pl-1">{error}</p>}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition-colors cursor-pointer"
            >
              Send message →
            </button>

            <p className="text-xs text-slate-500 text-center">
              You can also reach us by submitting this form. We typically
              respond within 1–3 business days.
            </p>
          </form>
        )}

        {/* Quick links */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Helpful links
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Privacy Policy", to: "/privacy-policy" },
              { label: "Terms of Service", to: "/terms-of-service" },
              { label: "About Stud IQ", to: "/about" },
              { label: "Dashboard", to: "/dashboard" },
            ].map(({ label, to }) => (
              <button
                key={to}
                onClick={() => navigate(to)}
                className="text-left px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 text-sm transition-all cursor-pointer"
              >
                {label} →
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
