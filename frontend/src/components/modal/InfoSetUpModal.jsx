import React, { useState } from "react";
import FloatingLabelInput from "../FloatingLabelInput";
import { useUser } from "../../context/UserContext";
import Button from "../Button";

const InfoSetUpModal = () => {
  const { setName } = useUser();
  const [tempName, setTempName] = useState("");

  const handleSubmit = () => {
    if (!tempName.trim()) return;
    setName(tempName); 
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white/90 text-black p-6 rounded-xl shadow-lg w-[90%] max-w-sm">
        <FloatingLabelInput
          label="What should we call you?"
          value={tempName}
          onChange={setTempName}
        />

        <Button label="Confirm" onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default InfoSetUpModal;
