import { FolderOpen } from "lucide-react";
import React from "react";
import MaterialCard from "./cards/MaterialCard";

const SubjectGroup = ({ subject, materials, onDelete }) => (
  <div className="mb-6">
    <div className="flex items-center gap-2 mb-3">
      <FolderOpen size={14} className="text-indigo-400" />
      <h2 className="text-sm font-semibold text-slate-700">
        {subject || "Uncategorized"}
      </h2>
      <span className="text-[10px] text-slate-400 font-medium bg-slate-100 px-1.5 py-0.5 rounded-full">
        {materials.length}
      </span>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {materials.map((m) => (
        <MaterialCard key={m.id} material={m} onDelete={onDelete} />
      ))}
    </div>
  </div>
);

export default SubjectGroup;
