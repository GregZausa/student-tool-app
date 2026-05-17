import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn, signUp } from "../config/user";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";

const AuthPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const reset = () => {
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    reset();

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (tab === "signup") {
      if (password !== confirm) {
        setError("Passwords do not match.");
        return;
      }
    }

    setLoading(true);

    if (tab === "login") {
      const { error } = await signIn(email.trim(), password);
      if (error) {
        setError(
          error.message === "Invalid login credentials"
            ? "Wrong email or password. Please try again."
            : error.message,
        );
        setLoading(false);
        return;
      }
      // UserContext onAuthStateChange will handle the rest
      navigate("/dashboard");
    } else {
      const { error } = await signUp(email.trim(), password);
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      setSuccess("Account created! You can now log in.");
      setTab("login");
      setPassword("");
      setConfirm("");
    }

    setLoading(false);
  };

  const inputClass = `
    w-full pl-10 pr-4 py-3 rounded-xl border border-white/10
    bg-white/5 text-white placeholder:text-slate-500
    outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20
    transition-all text-sm
  `;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-black to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-indigo-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
            S
          </div>
          <h1 className="text-2xl font-bold text-white">Stud IQ</h1>
          <p className="text-slate-400 text-sm mt-1">
            Study smarter, not harder 📚
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-7">
          {/* Tabs */}
          <div className="flex gap-1 bg-white/5 rounded-xl p-1 mb-6">
            {["login", "signup"].map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  reset();
                }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer capitalize ${
                  tab === t
                    ? "bg-indigo-500 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {t === "login" ? "Log in" : "Sign up"}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Email */}
            <div className="relative">
              <Mail
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  reset();
                }}
                className={inputClass}
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type={showPw ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  reset();
                }}
                className={inputClass + " pr-10"}
                autoComplete={
                  tab === "login" ? "current-password" : "new-password"
                }
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>

            {/* Confirm password — signup only */}
            {tab === "signup" && (
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirm}
                  onChange={(e) => {
                    setConfirm(e.target.value);
                    reset();
                  }}
                  className={inputClass}
                  autoComplete="new-password"
                />
              </div>
            )}

            {/* Error / Success */}
            {error && (
              <p className="text-red-400 text-xs pl-1 animate-pulse">{error}</p>
            )}
            {success && (
              <p className="text-emerald-400 text-xs pl-1">{success}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-semibold text-sm transition-colors cursor-pointer mt-1"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {tab === "login" ? "Log in" : "Create account"}
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Forgot password hint */}
          {tab === "login" && (
            <p className="text-center text-xs text-slate-500 mt-4">
              Forgot your password?{" "}
              <button
                onClick={async () => {
                  if (!email.trim()) {
                    setError("Enter your email first.");
                    return;
                  }
                  reset();
                  const { error } = await import("../config/supabase").then(
                    ({ supabase }) =>
                      supabase.auth.resetPasswordForEmail(email.trim(), {
                        redirectTo: `${window.location.origin}/reset-password`,
                      }),
                  );
                  if (error) setError(error.message);
                  else
                    setSuccess("Password reset email sent! Check your inbox.");
                }}
                className="text-indigo-400 hover:text-indigo-300 cursor-pointer underline"
              >
                Reset it
              </button>
            </p>
          )}
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          <button
            onClick={() => navigate("/")}
            className="hover:text-slate-300 cursor-pointer transition-colors"
          >
            ← Back to Home
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
