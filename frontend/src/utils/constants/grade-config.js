export const GRADE_OPTIONS = [
  "1.0",
  "1.25",
  "1.50",
  "1.75",
  "2.0",
  "2.25",
  "2.50",
  "2.75",
  "3.0",
  "4.0",
  "5.0",
  "INC",
];

export const GRADE_LABELS = {
  "1.0": "Excellent",
  1.25: "Very Good",
  "1.50": "Very Good",
  1.75: "Good",
  "2.0": "Good",
  2.25: "Satisfactory",
  "2.50": "Satisfactory",
  2.75: "Passing",
  "3.0": "Passing",
  "4.0": "Conditional",
  "5.0": "Failed",
  INC: "Incomplete",
};

export const GRADE_SELECT_OPTIONS = GRADE_OPTIONS.map((g) => ({
  value: g,
  label: GRADE_LABELS[g] ? `${g} · ${GRADE_LABELS[g]}` : g,
}));

export const gradeTableRows = [
  ["1.0", "Excellent", "97–100%", "Summa Cum Laude"],
  ["1.25", "Very Good", "94–96%", "Magna Cum Laude"],
  ["1.50", "Very Good", "91–93%", "Magna Cum Laude"],
  ["1.75", "Good", "88–90%", "Cum Laude"],
  ["2.0", "Good", "85–87%", "Cum Laude"],
  ["2.25", "Satisfactory", "82–84%", "Dean's List"],
  ["2.50", "Satisfactory", "79–81%", "Dean's List"],
  ["2.75", "Passing", "76–78%", "Passed"],
  ["3.0", "Passing", "75%", "Passed"],
  ["4.0", "Conditional", "70–74%", "Re-exam required"],
  ["5.0", "Failed", "Below 70%", "Failed"],
];
