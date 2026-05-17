import React from "react";
import FloatingLabelInput from "./ui/FloatingLabelInput";
import SelectBox from "./ui/SelectBox";
import { GRADE_SELECT_OPTIONS } from "../utils/constants/grade-config";
import Button from "./ui/Button";

const SubjectRow = ({ row, onChange, onDelete, index, isDark }) => (
  <div
    className={`grid grid-cols-[2fr_90px_175px_36px] gap-2 items-start py-2 border-b ${isDark ? "border-slate-700" : "border-slate-100"} last:border-0 animate-[fadeSlideIn_0.2s_ease]`}
  >
    <FloatingLabelInput
      type="text"
      label={`Subject ${index + 1}`}
      value={row.subject}
      onChange={(val) => onChange(row.id, "subject", val)}
    />

    <FloatingLabelInput
      type="number"
      label="Units"
      min={1}
      max={6}
      step={0.5}
      value={row.units}
      onChange={(val) => onChange(row.id, "units", val)}
    />

    <SelectBox
      options={GRADE_SELECT_OPTIONS}
      value={row.grade}
      onChange={(val) => onChange(row.id, "grade", val)}
      placeholder="— Grade —"
      searchable={false}
    />

    <Button onClick={() => onDelete(row.id)} label="x" />
  </div>
);

export default SubjectRow;
