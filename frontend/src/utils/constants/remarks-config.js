export const REMARKS_CONFIG = {
  excellent: {
    label: "Summa Cum Laude",
    color: "#14532d",
    bg: "#dcfce7",
    border: "#86efac",
  },
  veryGood: {
    label: "Magna Cum Laude",
    color: "#166534",
    bg: "#f0fdf4",
    border: "#86efac",
  },
  good: {
    label: "Cum Laude",
    color: "#14532d",
    bg: "#f0fdf4",
    border: "#bbf7d0",
  },
  satisfactory: {
    label: "Dean's List",
    color: "#713f12",
    bg: "#fefce8",
    border: "#fde047",
  },
  passing: {
    label: "Passed",
    color: "#92400e",
    bg: "#fffbeb",
    border: "#fcd34d",
  },
  conditional: {
    label: "Conditional",
    color: "#7c2d12",
    bg: "#fff7ed",
    border: "#fdba74",
  },
  failed: {
    label: "Failed",
    color: "#7f1d1d",
    bg: "#fef2f2",
    border: "#fca5a5",
  },
  inc: {
    label: "Incomplete",
    color: "#1e3a5f",
    bg: "#eff6ff",
    border: "#93c5fd",
  },
};

export const getRemarks = (gwa, hasInc) => {
  {
    if (hasInc) return REMARKS_CONFIG.inc;
    if (gwa <= 1.0) return REMARKS_CONFIG.excellent;
    if (gwa <= 1.5) return REMARKS_CONFIG.veryGood;
    if (gwa <= 2.0) return REMARKS_CONFIG.good;
    if (gwa <= 2.5) return REMARKS_CONFIG.satisfactory;
    if (gwa <= 3.0) return REMARKS_CONFIG.passing;
    if (gwa < 5.0) return REMARKS_CONFIG.conditional;
    return REMARKS_CONFIG.failed;
  }
};
