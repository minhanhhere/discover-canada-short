export interface QuizProgress {
  [key: number]: {
    started: boolean;
    score: string | undefined;
  };
}