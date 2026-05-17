import { useState } from "react";
import { GraduationCap, ArrowRight } from "lucide-react";
import { useUser } from "../../context/UserContext";
import { updateUserName } from "../../config/user";
import FloatingLabelInput from "../ui/FloatingLabelInput";

const InfoSetUpModal = () => {
  const { session, needsOnboarding, refreshUser } = useUser();
  const [tempName, setTempName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!needsOnboarding) return null;

  const handleSubmit = async () => {
    if (!tempName.trim()) {
      setError("Ilagay mo ang pangalan mo 😊");
      return;
    }
    if (tempName.trim().length < 2) {
      setError("At least 2 characters.");
      return;
    }

    setSaving(true);
    setError("");

    const updated = await updateUserName(session.user.id, tempName.trim());
    if (!updated) {
      setError("Something went wrong. Try again.");
      setSaving(false);
      return;
    }

    await refreshUser();
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-sm p-8">
        <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <GraduationCap size={32} className="text-indigo-500" />
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">
            Kamusta! 👋
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Ano ang itatatawag namin sa iyo? Para mas personal ang experience mo
            sa Stud IQ.
          </p>
        </div>

        {/* Input */}
        <div className="mb-2">
          <FloatingLabelInput
            label="What should we call you?"
            type="text"
            value={tempName}
            onChange={(val) => {
              setTempName(val);
              setError("");
            }}
          />
        </div>

        {error && <p className="text-xs text-red-500 mb-3 pl-1">{error}</p>}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={saving || !tempName.trim()}
          className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-semibold text-sm transition-colors cursor-pointer"
        >
          {saving ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Let's go! <ArrowRight size={15} />
            </>
          )}
        </button>

        <p className="text-center text-[11px] text-slate-400 mt-4">
          Pwede mo itong baguhin sa settings anytime. 🔒
        </p>
      </div>
    </div>
  );
};

export default InfoSetUpModal;
