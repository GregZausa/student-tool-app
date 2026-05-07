import { useState, useEffect, useCallback } from "react";
import AdSenseAd from "../utils/AdSenseAd";
import {
  GRADE_LABELS,
  GRADE_OPTIONS,
  GRADE_SELECT_OPTIONS,
  gradeTableRows,
} from "../utils/constants/grade-config";
import { getRemarks, REMARKS_CONFIG } from "../utils/constants/remarks-config";
import FloatingLabelInput from "../components/ui/FloatingLabelInput";
import SelectBox from "../components/ui/SelectBox";
import StatCard from "../components/cards/StatCard";
import Button from "../components/ui/Button";
import Header from "../components/layout/Header";
import { Calculator, GraduationCap, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TipBox from "../components/TipBox";
import { getBarColor, getBarWidth } from "../utils/functions/gpa-calculator";
import SemesterTab from "../components/SemesterTab";
import SubjectRow from "../components/SubjectRow";
import { useTheme } from "../context/ThemeContext";

let idCounter = 0;
const uid = () => ++idCounter;

const GPACalculator = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const backtoHome = () => {
    navigate("/");
  };
  const [activeSem, setActiveSem] = useState(0);
  const [semesters, setSemesters] = useState([
    { label: "1st Sem", rows: [] },
    { label: "2nd Sem", rows: [] },
    { label: "Summer", rows: [] },
  ]);
  const [copied, setCopied] = useState(false);
  const [showTip, setShowTip] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowTip(true), 20000);
    return () => clearTimeout(t);
  }, []);

  const currentRows = semesters[activeSem].rows;

  const updateRows = useCallback(
    (updater) => {
      setSemesters((prev) =>
        prev.map((sem, i) =>
          i === activeSem ? { ...sem, rows: updater(sem.rows) } : sem,
        ),
      );
    },
    [activeSem],
  );

  const addRow = () =>
    updateRows((rows) => [
      ...rows,
      { id: uid(), subject: "", units: "3", grade: "" },
    ]);

  const deleteRow = (id) =>
    updateRows((rows) => rows.filter((r) => r.id !== id));

  const changeRow = (id, field, val) =>
    updateRows((rows) =>
      rows.map((r) => (r.id === id ? { ...r, [field]: val } : r)),
    );

  const resetSem = () => updateRows(() => []);

  const compute = (rows) => {
    let totalPts = 0,
      totalUnits = 0,
      hasInc = false;
    rows.forEach(({ grade, units }) => {
      const u = parseFloat(units);
      if (!grade || !u || isNaN(u)) return;
      if (grade === "INC") {
        hasInc = true;
        return;
      }
      const g = parseFloat(grade);
      if (isNaN(g)) return;
      totalPts += g * u;
      totalUnits += u;
    });
    const gwa = totalUnits > 0 ? totalPts / totalUnits : null;
    return { gwa, totalUnits, hasInc };
  };

  const { gwa, totalUnits, hasInc } = compute(currentRows);
  const allRows = semesters.flatMap((s) => s.rows);
  const { gwa: cumGwa } = compute(allRows);

  const remarks = gwa !== null ? getRemarks(gwa, hasInc) : null;
  const barWidth = gwa !== null ? getBarWidth(gwa) : 0;
  const barColorClass = gwa !== null ? getBarColor(gwa) : "bg-slate-200";

  const copyResult = () => {
    const link = "https://student-tool-app.vercel.app/";
    const text =
      gwa !== null
        ? `My GWA this semester: ${gwa.toFixed(2)} (${remarks?.label}) — Compute yours here: ${link}`
        : `Check you GWA here: ${link}`;

    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Header
        isDark={isDark}
        header="PH GPA CALCULATOR"
        subHeader="Philippine grading system · 1.0 (Excellent) to 5.0 (Failed)"
        icon={<Calculator size={20} className="text-sky-500" />}
      />

      <div className="max-w-2xl mx-auto px-4 pb-16">
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mt-5 mb-4">
          {semesters.map((sem, i) => (
            <SemesterTab
              key={i}
              label={sem.label}
              active={activeSem === i}
              onClick={() => setActiveSem(i)}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2.5 mb-5">
          <StatCard
            label="Sem GWA"
            value={gwa !== null ? gwa.toFixed(2) : "—"}
            color="text-indigo-500"
          />
          <StatCard
            label="Sem units"
            value={
              totalUnits > 0
                ? totalUnits % 1 === 0
                  ? totalUnits
                  : totalUnits.toFixed(1)
                : "0"
            }
            color="text-sky-500"
          />
          <StatCard
            label="Cumulative GWA"
            value={cumGwa !== null ? cumGwa.toFixed(2) : "—"}
            color="text-emerald-500"
          />
        </div>

        {remarks && (
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-2xl border mb-4 animate-[fadeSlideIn_0.3s_ease]"
            style={{ background: remarks.bg, borderColor: remarks.border }}
          >
            <span className="text-xl">
              {remarks.label.includes("Laude")
                ? "🏆"
                : remarks.label === "Failed"
                  ? "📋"
                  : remarks.label === "Incomplete"
                    ? "⏳"
                    : "✅"}
            </span>
            <div>
              <div
                className="font-semibold text-sm"
                style={{ color: remarks.color }}
              >
                {remarks.label}
              </div>
              <div
                className="text-xs opacity-75"
                style={{ color: remarks.color }}
              >
                {gwa !== null ? `GWA: ${gwa.toFixed(4)}` : ""}
              </div>
            </div>
          </div>
        )}

        <div className="mb-5">
          <div className="flex justify-between text-xs text-slate-400 mb-1.5">
            <span>Performance meter</span>
            <span className="font-mono font-medium">
              {gwa !== null ? `${barWidth.toFixed(0)}%` : "—"}
            </span>
          </div>
          <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${barColorClass}`}
              style={{ width: `${barWidth}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-300 mt-1">
            <span>5.0 Failed</span>
            <span>3.0 Passing</span>
            <span>1.0 Excellent</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-3">
          <div className="grid grid-cols-[2fr_90px_175px_36px] gap-2 mb-2">
            {["Subject / Course", "Units", "Grade", ""].map((h, i) => (
              <div
                key={i}
                className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider"
              >
                {h}
              </div>
            ))}
          </div>

          {currentRows.length === 0 ? (
            <div className="text-center py-8 text-slate-300">
              <div className="text-3xl mb-2">📚</div>
              <div className="text-sm">No subjects yet. Add one below!</div>
            </div>
          ) : (
            currentRows.map((row, i) => (
              <SubjectRow
                key={row.id}
                row={row}
                index={i}
                onChange={changeRow}
                onDelete={deleteRow}
              />
            ))
          )}
        </div>

        <div className="flex justify-between gap-2 mb-5 flex-wrap">
          <div className="flex justify-between">
            <Button onClick={addRow} label="+ Add subject" />
            <Button
              onClick={copyResult}
              label={copied ? "✓ Copied!" : "📋 Share result"}
              variant="ghost"
            />
          </div>
          <div className="justify-end">
            <Button
              onClick={resetSem}
              label="Reset sem"
              variant="ghostDanger"
            />
          </div>
        </div>

        <AdSenseAd />

        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-4">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">
            📊 PH grading scale reference
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  {["Grade", "Description", "% Equivalent", "Remarks"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-2.5 py-2 text-left text-[10px] text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {gradeTableRows.map(([g, desc, pct, rmk], i) => (
                  <tr
                    key={g}
                    className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
                  >
                    <td
                      className={`px-2.5 py-2 font-mono font-semibold ${
                        parseFloat(g) <= 2.0
                          ? "text-green-600"
                          : parseFloat(g) <= 3.0
                            ? "text-amber-600"
                            : "text-red-500"
                      }`}
                    >
                      {g}
                    </td>
                    <td className="px-2.5 py-2 text-slate-700">{desc}</td>
                    <td className="px-2.5 py-2 text-slate-500">{pct}</td>
                    <td className="px-2.5 py-2 text-slate-500">{rmk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <TipBox
          title="Tips para mapabuti ang GWA mo"
          icon={Lightbulb}
          tips={[
            <>
              Unahin ang mga subject na may malaking units—sila ang may
              pinakamalaking epekto sa GWA mo.
            </>,
            <>
              Kahit maliit na improvement (hal. 2.0 → 1.75) sa major subject,
              malaking boost na agad sa overall average.
            </>,
            <>
              Gamitin ang <strong>Summer sem</strong> para makita kung paano mo
              pa pwedeng iangat ang cumulative GWA.
            </>,
            <>
              Targetin ang grades na mas mataas sa passing—huwag lang pumasa,
              aim higher.
            </>,
            <>
              Ayusin agad ang INC grades—hindi sila kasama ngayon, pero bababa
              ang GWA mo once ma-resolve.
            </>,
          ]}
        />

        {showTip && (
          <div className="bg-blue-50 rounded-2xl border border-blue-200 p-4 mb-4 flex items-center gap-3 animate-[fadeSlideIn_0.4s_ease]">
            <span className="text-xl">🔗</span>
            <div className="flex-1">
              <div className="text-sm font-semibold text-blue-800">
                Ibahagi ang iyong result!
              </div>
              <div className="text-xs text-blue-500">
                I-share ang iyong GWA sa mga kaklase mo.
              </div>
            </div>
            <button
              onClick={copyResult}
              className="px-3.5 py-2 rounded-xl bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600 transition-colors cursor-pointer"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        )}

        <AdSenseAd />

        <p className="text-center text-[11px] text-slate-500 mt-5">
          PH GPA Calculator · For Filipino students 🇵🇭
        </p>
      </div>
    </div>
  );
};

export default GPACalculator;
