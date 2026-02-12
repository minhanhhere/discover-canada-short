export interface QuizQuestionStat {
  quizIdx: number;
  questionIdx: number;
  missedTimes: number;
}

export interface QuizReview {
  bookmarkedQuestions: QuizQuestionStat[];
  missedQuestions: QuizQuestionStat[];
}
