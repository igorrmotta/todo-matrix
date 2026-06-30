/** Compact "waiting" age label from a task's creation time: "Today" / "3d" / "2w". */
export function waiting(createdAt?: number): string {
  if (!createdAt) return "";
  const created = new Date(createdAt);
  created.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Math.round((today.getTime() - created.getTime()) / 86400000);
  if (days <= 0) return "Today";
  if (days < 7) return `${days}d`;
  return `${Math.floor(days / 7)}w`;
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
