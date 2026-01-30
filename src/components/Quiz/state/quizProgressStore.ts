import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { QuizProgress } from "../QuizProgress";

const DEFAULT_PROGRESS: QuizProgress = {};

type QuizProgressStore = QuizProgress & {
  quizProgress: QuizProgress;
  startQuiz: (quizId: number) => void;
  completeQuiz: (quizId: number, score: string) => void;
  resetQuiz: (quizId: number) => void;
};

export const useQuizProgressStore = create<QuizProgressStore>()(
  persist(
    (set) => ({
      quizProgress: DEFAULT_PROGRESS,

      startQuiz: (quizId) =>
        set(({ quizProgress }) => {
          const quiz = quizProgress[quizId] ?? {
            started: false,
            score: undefined,
          };
          return {
            quizProgress: {
              ...quizProgress,
              [quizId]: {
                ...quiz,
                started: true,
              },
            },
          };
        }),

      completeQuiz: (quizId, score) =>
        set(({ quizProgress }) => {
          return {
            quizProgress: {
              ...quizProgress,
              [quizId]: {
                started: true,
                score,
              },
            },
          };
        }),

      resetQuiz: (quizId) =>
        set(({quizProgress}) => {
          const { [quizId]: _removed, ...rest } = quizProgress;
          return { quizProgress: rest };
        }),
    }),
    {
      name: "quiz-progress",
      version: 1,
    },
  ),
);
