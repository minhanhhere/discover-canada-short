export interface QuizProgress {
  started: number[];
  completed: number[];
  scores: Record<number, string | undefined>;
}