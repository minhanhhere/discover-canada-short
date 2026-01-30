import type { QuizQuestion } from "./state/useFetchPracticeQuizData";

export function pickRandomArrayIndex(array: any[]) {
  return Math.floor(Math.random() * array.length);
}

function shuffle<T>(items: readonly T[]): T[] {
  const arr = items.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function normalizeQuizSet(
  set: QuizQuestion[] | undefined | null,
): QuizQuestion[] {
  // Defensive copy + shuffle questions and answers
  const questions = (set ?? []).filter(Boolean).map((q) => ({
    ...q,
    answer: shuffle(q.answer ?? []),
  }));
  return shuffle(questions);
}
