import type { QuadKey } from "./types";

/**
 * Design tokens ported verbatim from the Quadrant.dc.html prototype.
 * These were the tweakable "editor" props in Claude Design.
 */
export const ACCENT = "#bd5f3a"; // options: #bd5f3a, #3f6ec8, #5f7a4f, #7d5fb0
export const DIM_LEVEL = 0.16; // focus-mode dim opacity for inactive quadrants
export const COMPACT = false; // denser card layout

export const ACCENT_SOFT = ACCENT + "22"; // ~13% alpha, used for focus glow

/** Priority order the focus walk follows. */
export const QUAD_ORDER: QuadKey[] = ["do", "sch", "del", "elim"];

export interface QuadMeta {
  key: QuadKey;
  label: string;
  sub: string;
  icon: string;
  col: number;
  row: number;
  border: string;
  bg: string;
  lc: string; // label color
  ic: string; // icon color
  sc: string; // sub color
  cbg: string; // count chip background
  cc: string; // count chip color
}

export const QUAD_META: QuadMeta[] = [
  { key: "do",   label: "Do First",  sub: "Urgent + Important",         icon: "●", col: 2, row: 2, border: "2px solid #2a2825",   bg: "#ffffff", lc: "#2a2825", ic: "#2a2825", sc: "#8a857c", cbg: "#2a2825", cc: "#ffffff" },
  { key: "sch",  label: "Schedule",  sub: "Not urgent + Important",     icon: "◐", col: 3, row: 2, border: "1.5px solid #b8b2a6", bg: "#fdfcf9", lc: "#2a2825", ic: "#6e6a63", sc: "#9a948a", cbg: "#ece7dc", cc: "#6e6a63" },
  { key: "del",  label: "Delegate",  sub: "Urgent + Not important",     icon: "◔", col: 2, row: 3, border: "1.5px solid #d6d0c2", bg: "#fbfaf6", lc: "#6e6a63", ic: "#a39d92", sc: "#a8a296", cbg: "#f0ece2", cc: "#9a948a" },
  { key: "elim", label: "Eliminate", sub: "Not urgent + Not important", icon: "○", col: 3, row: 3, border: "1.5px dashed #ddd7ca", bg: "#f8f6f1", lc: "#9a948a", ic: "#bdb6a8", sc: "#b3ada1", cbg: "#f2eee6", cc: "#a8a296" },
];

export const quadByKey = (k: QuadKey): QuadMeta =>
  QUAD_META.find((m) => m.key === k)!;
