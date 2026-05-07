import { useState } from "react";
import FloatingLabelInput from "../ui/FloatingLabelInput";
import { useUser } from "../../context/UserContext";
import Button from "../ui/Button";
import { GraduationCap } from "lucide-react";

const InfoSetUpModal = () => {
  const { name, setName } = useUser();
  const [tempName, setTempName] = useState("");
  const [error,    setError]    = useState("");

  if (name) return null;

  const handleSubmit = () => {
    if (!tempName.trim()) { setError("Ilagay mo ang pangalan mo 😊"); return; }
    if (tempName.trim().length < 2) { setError("At least 2 characters."); return; }
    setName(tempName.trim());
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-sm p-8">

        {/* Icon */}
        <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <GraduationCap size={32} className="text-indigo-500" />
        </div>

        {/* Text */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-slate-800 mb-1">Kamusta! 👋</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Ano ang itatatawag namin sa iyo? Para mas personal ang experience mo.
          </p>
        </div>

        {/* Input */}
        <div className="mb-1">
          <FloatingLabelInput
            label="What should we call you?"
            value={tempName}
            onChange={(val) => { setTempName(val); setError(""); }}
          />
        </div>

        {error && (
          <p className="text-xs text-red-500 mb-3 pl-1">{error}</p>
        )}

        <div className="mt-4">
          <Button label="Let's go! →" onClick={handleSubmit} />
        </div>

        <p className="text-center text-[11px] text-slate-400 mt-4">
          Hindi kailangan ng account — anonymous ka pa rin. 🔒
        </p>
      </div>
    </div>
  );
};

export default InfoSetUpModal;