/** Due-date formatting, ported from the prototype's `_fmtDue`. */
export interface DueInfo {
  label: string;
  hot: boolean; // Today / Overdue → accent-colored
}

export function fmtDue(due: string | null): DueInfo | null {
  if (!due) return null;
  const d = new Date(due + "T00:00:00");
  if (isNaN(d.getTime())) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diff = Math.round((d.getTime() - now.getTime()) / 86400000);
  let label: string;
  let hot = false;
  if (diff < 0) {
    label = "Overdue";
    hot = true;
  } else if (diff === 0) {
    label = "Today";
    hot = true;
  } else if (diff === 1) {
    label = "Tomorrow";
  } else if (diff < 7) {
    label = d.toLocaleDateString("en-US", { weekday: "short" });
  } else {
    label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  return { label, hot };
}

/** Relative "time ago" for the Done list, ported from the prototype's `_ago`. */
export function ago(ts?: number | null): string {
  if (!ts) return "";
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return m + "m ago";
  const h = Math.floor(m / 60);
  if (h < 24) return h + "h ago";
  return Math.floor(h / 24) + "d ago";
}

export function todayLabel(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}
