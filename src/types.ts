export type QuadKey = "do" | "sch" | "del" | "elim";

export interface Task {
  id?: number;
  title: string;
  quad: QuadKey;
  done: boolean;
  doneAt?: number | null; // epoch ms when completed
  order?: number; // sort position within a quadrant (lower = higher up)
  createdAt?: number; // epoch ms when created; drives the "waiting" age pill
}
