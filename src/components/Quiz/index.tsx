import React, { useEffect, useMemo, useState } from "react";
import {
  useFetchPracticeQuizData,
} from "./state/useFetchPracticeQuizData";
import styles from "./styles.module.css";
import QuizIntro from "./QuizIntro";
import QuizError from "./QuizError";
import QuizMap from "./QuizMap";
import { useQuizProgressStore } from "./state/quizProgressStore";
import { useQuizReviewStore } from "./state/quizReviewStore";
import { normalizeQuizSet, pickRandomArrayIndex } from "./quizUtils";

export default function Quiz() {
  const quizProgress = useQuizProgressStore((s) => s.quizProgress);
  const markQuizStarted = useQuizProgressStore((s) => s.startQuiz);
  const completeQuiz = useQuizProgressStore((s) => s.completeQuiz);
  const resetQuiz = useQuizProgressStore((s) => s.resetQuiz);

  const bookmarkedQuestions = useQuizReviewStore((s) => s.quizReview.bookmarkedQuestions);
  const addBookmarkedQuestion = useQuizReviewStore((s) => s.addBookmarkedQuestion);
  const removeBookmarkedQuestion = useQuizReviewStore((s) => s.removeBookmarkedQuestion);
  const addMissedQuestion = useQuizReviewStore((s) => s.addMissedQuestion);

  const {
    data: quizData,
    isLoading,
    isError,
    error,
    refetch,
  } = useFetchPracticeQuizData();

  const [autoNextOnCorrect, setAutoNextOnCorrect] = useState(true);
  const [quizSetIndex, setQuizSetIndex] = useState<number | null>(null);
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [answerHistory, setAnswerHistory] = useState<Record<number, number>>({});

  const selectedSet = useMemo(() => {
    if (!quizData) return null;
    if (quizSetIndex === null) return null;
    if (quizSetIndex < 0 || quizSetIndex >= quizData.length) return null;
    return quizData[quizSetIndex];
  }, [quizData, quizSetIndex]);

  const questions = useMemo(() => normalizeQuizSet(selectedSet), [selectedSet]);

  const currentQuestion =
    questionIndex < 0 || questionIndex >= questions.length
      ? null
      : questions[questionIndex];

  const reveal = selectedAnswerIndex !== null;

  const questionStatuses = useMemo(() => {
    return questions.map((q, idx) => {
      const chosen = answerHistory[idx];
      if (typeof chosen !== "number") return "unanswered" as const;
      return q.answer?.[chosen]?.isCorrect
        ? ("correct" as const)
        : ("incorrect" as const);
    });
  }, [questions, answerHistory]);

  const correctCount = useMemo(() => {
    return Object.entries(answerHistory).reduce((count, [qIdxStr, aIdx]) => {
      const qIdx = Number(qIdxStr);
      const q = questions[qIdx];
      if (!q || typeof aIdx !== "number") return count;
      return q.answer?.[aIdx]?.isCorrect ? count + 1 : count;
    }, 0);
  }, [answerHistory, questions]);

  function goToQuestion(targetIndex: number) {
    if (targetIndex < 0 || targetIndex >= questions.length) return;
    setQuestionIndex(targetIndex);

    const restored = answerHistory[targetIndex];
    setSelectedAnswerIndex(typeof restored === "number" ? restored : null);
  }

  function startQuiz(idx?: number) {
    if (!quizData || quizData.length === 0) return;

    const quizIdx = idx ?? pickRandomArrayIndex(quizData);

    markQuizStarted(quizIdx);
    setQuizSetIndex(quizIdx);
    setQuestionIndex(0);
    setSelectedAnswerIndex(null);
    setAnswerHistory({});
  }

  function nextQuestion() {
    if (questions.length === 0) return;

    // Move through the (already shuffled) quiz set.
    const next = questionIndex + 1;
    if (next >= questions.length) {
      // End reached: restart by picking a fresh random set.
      // startQuiz();
      return;
    }

    setQuestionIndex(next);

    // Restore previous selection if user had answered this question before.
    const restored = answerHistory[next];
    setSelectedAnswerIndex(typeof restored === "number" ? restored : null);
  }

  function prevQuestion() {
    if (questions.length === 0) return;

    const prev = questionIndex - 1;
    if (prev < 0) return;

    setQuestionIndex(prev);

    const restored = answerHistory[prev];
    setSelectedAnswerIndex(typeof restored === "number" ? restored : null);
  }

  function resetQuizProgress() {
    if (quizSetIndex === null) return;
    resetQuiz(quizSetIndex);
    setQuizSetIndex(null);
  }

  function findOriginalQuestionIdx() {
    if (!quizData || quizSetIndex === null || !currentQuestion) return -1;
    return quizData[quizSetIndex].findIndex(
      (q) => q.question === currentQuestion.question
    );
  }

  function isBookmarked() {
    if (quizSetIndex === null) return false;
    const questionId = findOriginalQuestionIdx();
    return bookmarkedQuestions.some(
      (q) => q.quizIdx === quizSetIndex && q.questionIdx === questionId
    );
  }

  function toggleBookmark() {
    if (quizSetIndex === null) return;
    
    const questionId = findOriginalQuestionIdx();
    if (isBookmarked()) {
      removeBookmarkedQuestion(quizSetIndex, questionId);
    } else {
      addBookmarkedQuestion(quizSetIndex, questionId);
    }
  }

  // Effect: complete quiz when all questions have been answered
  useEffect(() => {
    if (Object.keys(answerHistory).length === questions.length) {
      if (typeof quizSetIndex === "number") {
        completeQuiz(quizSetIndex, `${correctCount}/${questions.length}`);
      }
    }
  }, [answerHistory, correctCount, questions.length, quizSetIndex]);

  if (isLoading) {
    return <div>Loading quiz...</div>;
  }

  if (isError) {
    return <QuizError error={error} onRetry={() => refetch()} />;
  }

  if (!quizData || quizData.length === 0) {
    return <div>No quiz questions found.</div>;
  }

  if (quizSetIndex === null || !currentQuestion) {
    return <QuizIntro dataSetLength={quizData.length} onStart={startQuiz} />;
  }

  return (
    <div className={styles.nonHover}>
      {/* Question and Metadata */}
      <div className={`row row--no-gutters margin-bottom--sm ${styles.quizHeader}`}>
        <div className="col col--auto text--center">
          Practice Quiz {quizSetIndex + 1}
        </div>
        <div className={`col col--auto margin-bottom--sm ${styles.questionStat}`}>
          <div>
            <span className="badge badge--info margin-right--sm">
              Question {questionIndex + 1}/{questions.length}
            </span>
            {reveal && (
              <>
                {currentQuestion.answer[selectedAnswerIndex!]?.isCorrect ? (
                  <span className="badge badge--success">Correct</span>
                ) : (
                  <span className="badge badge--danger">Incorrect</span>
                )}
              </>
            )}
          </div>
          <button
            type="button"
            className={`button button--sm button--primary margin-right--sm ${isBookmarked() ? "" : "button--outline"}`}
            onClick={toggleBookmark}
          >
            {isBookmarked() ? "Saved" : "Save"}
          </button>
        </div>
        <div className="col">
          <h2 className="margin-bottom--sm">{currentQuestion.question}</h2>
        </div>
      </div>

      {/* Answers */}
      <div className="margin-bottom--md">
        {currentQuestion.answer.map((ans, idx) => {
          const isSelected = selectedAnswerIndex === idx;
          const shouldHighlightCorrect = reveal && ans.isCorrect;
          const shouldHighlightWrong = reveal && isSelected && !ans.isCorrect;

          const className =
            `button button--block button--lg margin-bottom--sm ${styles.answerButton} ` +
            (reveal ? "button--secondary" : "button--outline button--primary") +
            (shouldHighlightCorrect ? ` ${styles.answerButtonCorrect}` : "") +
            (shouldHighlightWrong ? ` ${styles.answerButtonWrong}` : "");

          return (
            <button
              key={`answer-${quizSetIndex}-${questionIndex}-${idx}`}
              type="button"
              className={className}
              disabled={reveal}
              onClick={() => {
                setSelectedAnswerIndex(idx);
                if (!ans.isCorrect) {
                  addMissedQuestion(quizSetIndex, findOriginalQuestionIdx());
                }
                setAnswerHistory((prev) => ({ ...prev, [questionIndex]: idx }));
                if (autoNextOnCorrect && ans.isCorrect) {
                  setTimeout(() => {
                    nextQuestion();
                  }, 700);
                }
              }}
            >
              {ans.text}
            </button>
          );
        })}
      </div>

      {/* Navigation and Controls */}
      <div className="margin-top--lg">
        <div>

          {/* Checkbox Auto Next on Correct Answer */}
          <div className="margin-bottom--md">
            <label className="margin-right--md">
              <input
                type="checkbox"
                checked={autoNextOnCorrect}
                onChange={(e) => setAutoNextOnCorrect(e.target.checked)}
              />
              {" "}Auto-next on correct answer
            </label>
            
          </div>

          {/* Back, CorrectCount , Next */}
          <div className={`row padding-horiz--md margin-bottom--lg ${styles.spaceBetween}`}>
            <button
              type="button"
              className="button button--secondary"
              onClick={prevQuestion}
              disabled={questionIndex === 0}
            >
              Previous
            </button>
            <div>
              <span className="badge badge--success">
                Correct: {correctCount}/{questions.length}
              </span>
            </div>
            <button
              type="button"
              className="button button--primary"
              onClick={nextQuestion}
              disabled={questionIndex >= questions.length - 1}
            >
              Next
            </button>
          </div>

          {/* Question Map */}
          <div className="margin-bottom--lg">
            <div className={styles.questionMap}>
              <QuizMap
                questionCount={questions.length}
                activeIndex={questionIndex}
                statuses={questionStatuses}
                onGoToQuestion={goToQuestion}
              />
            </div>
          </div>

          {/* Reset and Back to Quiz List */}
          <div className="margin-bottom--sm">
            <button
              type="button"
              className="button button--block button--warning"
              onClick={() => resetQuizProgress()}
            >
              {quizProgress[quizSetIndex]?.score
                ? `Last result: ${quizProgress[quizSetIndex]?.score} | `
                : ""}
              Reset Quiz Progress
            </button>
          </div>
          <div>
            <button
              type="button"
              className="button button--block button--danger"
              onClick={() => setQuizSetIndex(null)}
            >
              Back to Quiz List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
