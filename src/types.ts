export type QuadKey = "do" | "sch" | "del" | "elim";

export interface Task {
  id?: number;
  title: string;
  due: string | null; // ISO date (yyyy-mm-dd) or null
  quad: QuadKey;
  done: boolean;
  doneAt?: number | null; // epoch ms when completed
  order?: number; // sort position within a quadrant (lower = higher up)
}
