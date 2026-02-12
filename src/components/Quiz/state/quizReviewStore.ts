import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { QuizReview } from "../QuizReview";

const DEFAULT_REVIEW: QuizReview = {
  bookmarkedQuestions: [],
  missedQuestions: [],
};

type QuizReviewStore = {
  quizReview: QuizReview;
  addBookmarkedQuestion: (quizId: number, questionId: number) => void;
  addMissedQuestion: (quizId: number, questionId: number) => void;
  removeBookmarkedQuestion: (quizId: number, questionId: number) => void;
  removeMissedQuestion: (quizId: number, questionId: number) => void;
};

export const useQuizReviewStore = create<QuizReviewStore>()(
  persist(
    (set) => ({
      quizReview: DEFAULT_REVIEW,

      addBookmarkedQuestion: (quizId: number, questionId: number) => {
        set((state) => {
          const exists = state.quizReview.bookmarkedQuestions.some(
            (q) => q.quizIdx === quizId && q.questionIdx === questionId,
          );

          if (exists) return state;

          return {
            quizReview: {
              ...state.quizReview,
              bookmarkedQuestions: [
                ...state.quizReview.bookmarkedQuestions,
                {
                  quizIdx: quizId,
                  questionIdx: questionId,
                  missedTimes: 0,
                },
              ],
            },
          };
        });
      },

      addMissedQuestion: (quizId: number, questionId: number) => {
        set((state) => {
          const existingIndex = state.quizReview.missedQuestions.findIndex(
            (q) => q.quizIdx === quizId && q.questionIdx === questionId,
          );

          if (existingIndex >= 0) {
            const updated = [...state.quizReview.missedQuestions];
            updated[existingIndex] = {
              ...updated[existingIndex],
              missedTimes: updated[existingIndex].missedTimes + 1,
            };
            return {
              quizReview: {
                ...state.quizReview,
                missedQuestions: updated,
              },
            };
          }

          return {
            quizReview: {
              ...state.quizReview,
              missedQuestions: [
                ...state.quizReview.missedQuestions,
                {
                  quizIdx: quizId,
                  questionIdx: questionId,
                  missedTimes: 1,
                },
              ],
            },
          };
        });
      },

      removeBookmarkedQuestion: (quizId: number, questionId: number) => {
        set((state) => ({
          quizReview: {
            ...state.quizReview,
            bookmarkedQuestions: state.quizReview.bookmarkedQuestions.filter(
              (q) => !(q.quizIdx === quizId && q.questionIdx === questionId),
            ),
          },
        }));
      },

      removeMissedQuestion: (quizId: number, questionId: number) => {
        set((state) => ({
          quizReview: {
            ...state.quizReview,
            missedQuestions: state.quizReview.missedQuestions.filter(
              (q) => !(q.quizIdx === quizId && q.questionIdx === questionId),
            ),
          },
        }));
      },
    }),
    {
      name: "quiz-review",
      version: 1,
    },
  ),
);
