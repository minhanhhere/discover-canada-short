import React, { useEffect, useMemo, useState } from 'react';
import { QuizQuestion, useFetchPracticeQuizData } from './state/useFetchPracticeQuizData';
import styles from './styles.module.css';
import QuizIntro from './QuizIntro';
import QuizError from './QuizError';
import QuizMap from './QuizMap';
import { useQuizProgressStore } from './state/quizProgressStore';

function pickRandomArrayIndex(array: any[]) {
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

function normalizeQuizSet(set: QuizQuestion[] | undefined | null): QuizQuestion[] {
  // Defensive copy + shuffle questions and answers
  const questions = (set ?? []).filter(Boolean).map((q) => ({
    ...q,
    answer: shuffle(q.answer ?? []),
  }));
  return shuffle(questions);
}

export default function Quiz() {
  const quizProgress = useQuizProgressStore((s) => s.quizProgress);
  const markQuizStarted = useQuizProgressStore((s) => s.startQuiz);
  const completeQuiz = useQuizProgressStore((s) => s.completeQuiz);
  const resetQuiz = useQuizProgressStore((s) => s.resetQuiz);

  const { data: quizData, isLoading, isError, error, refetch } = useFetchPracticeQuizData();

  // The selected quiz set (one inner array from QuizData). Null means "not started".
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
    questionIndex < 0 || questionIndex >= questions.length ? null : questions[questionIndex];

  const reveal = selectedAnswerIndex !== null;

  const questionStatuses = useMemo(() => {
    return questions.map((q, idx) => {
      const chosen = answerHistory[idx];
      if (typeof chosen !== 'number') return 'unanswered' as const;
      return q.answer?.[chosen]?.isCorrect ? ('correct' as const) : ('incorrect' as const);
    });
  }, [questions, answerHistory]);

  const correctCount = useMemo(() => {
    return Object.entries(answerHistory).reduce((count, [qIdxStr, aIdx]) => {
      const qIdx = Number(qIdxStr);
      const q = questions[qIdx];
      if (!q || typeof aIdx !== 'number') return count;
      return q.answer?.[aIdx]?.isCorrect ? count + 1 : count;
    }, 0);
  }, [answerHistory, questions]);

  function goToQuestion(targetIndex: number) {
    if (targetIndex < 0 || targetIndex >= questions.length) return;
    setQuestionIndex(targetIndex);

    const restored = answerHistory[targetIndex];
    setSelectedAnswerIndex(typeof restored === 'number' ? restored : null);
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
    setSelectedAnswerIndex(typeof restored === 'number' ? restored : null);
  }

  function prevQuestion() {
    if (questions.length === 0) return;

    const prev = questionIndex - 1;
    if (prev < 0) return;

    setQuestionIndex(prev);

    const restored = answerHistory[prev];
    setSelectedAnswerIndex(typeof restored === 'number' ? restored : null);
  }

  function resetQuizProgress() {
    resetQuiz(quizSetIndex);
    setQuizSetIndex(null);
  }

  // complete quiz when all questions have been answered
  useEffect(() => {
    if (Object.keys(answerHistory).length === questions.length) {
      if (typeof quizSetIndex === 'number') {
        completeQuiz(quizSetIndex, `${correctCount}/${questions.length}`);
      }
    }
  }, [answerHistory, correctCount, questions.length, quizSetIndex]);

  if (isLoading) {
    return <div>Loading quiz...</div>;
  }

  if (isError) {
    return (
      <QuizError
        error={error}
        preClassName={`margin-bottom--md ${styles.preWrap}`}
        onRetry={() => refetch()}
      />
    );
  }

  if (!quizData || quizData.length === 0) {
    return <div>No quiz questions found.</div>;
  }

  if (quizSetIndex === null || !currentQuestion) {
    return <QuizIntro
      quizProgress={quizProgress}
      dataSetLength={quizData.length}
      onStart={startQuiz} />;
  }

  return (
    <div>
      <div className={`row row--no-gutters margin-bottom--sm ${styles.quizHeader}`}>
        <div className="col col--auto text--center">Quiz {quizSetIndex + 1}</div>
        <div className="col col--auto">
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
        <div className="col">
          <h2 className="margin-bottom--sm">{currentQuestion.question}</h2>
        </div>
      </div>

      <div className="margin-bottom--md">
        {currentQuestion.answer.map((ans, idx) => {
          const isSelected = selectedAnswerIndex === idx;
          const shouldHighlightCorrect = reveal && ans.isCorrect;
          const shouldHighlightWrong = reveal && isSelected && !ans.isCorrect;

          const className =
            `button button--block button--lg margin-bottom--sm ${styles.answerButton} ` +
            (reveal ? 'button--secondary' : 'button--outline button--primary') +
            (shouldHighlightCorrect ? ` ${styles.answerButtonCorrect}` : '') +
            (shouldHighlightWrong ? ` ${styles.answerButtonWrong}` : '');

          return (
            <button
              key={idx}
              type="button"
              className={className}
              disabled={reveal}
              onClick={() => {
                setSelectedAnswerIndex(idx);
                setAnswerHistory((prev) => ({ ...prev, [questionIndex]: idx }));
              }}>
              {ans.text}
            </button>
          );
        })}
      </div>

      <div className="margin-top--lg">
        <div>
          <div className={`row padding-horiz--md margin-bottom--lg ${styles.spaceBetween}`}>
            <button
              type="button"
              className="button button--secondary"
              onClick={prevQuestion}
              disabled={questionIndex === 0}>
              Previous
            </button>
            <div>
              <span className="badge badge--success">Correct: {correctCount}/{questions.length}</span>
            </div>
            <button
              type="button"
              className="button button--primary"
              onClick={nextQuestion}
              disabled={questionIndex >= questions.length - 1}>
              Next
            </button>
          </div>

          <div className="margin-bottom--lg">
            <div className={styles.questionMap}>
              <QuizMap
                questionCount={questions.length}
                activeIndex={questionIndex}
                statuses={questionStatuses}
                buttonClassName={styles.questionMapButton}
                onGoToQuestion={goToQuestion}
              />
            </div>
          </div>

          <div className="margin-bottom--sm">
            <button type="button" className="button button--block button--warning" onClick={() => resetQuizProgress()}>
              {quizProgress[quizSetIndex]?.score ? `Last result: ${quizProgress[quizSetIndex]?.score} | ` : ''}Reset Quiz Progress
            </button>
          </div>
          <div>
            <button type="button" className="button button--block button--danger" onClick={() => setQuizSetIndex(null)}>
              Back to Quiz List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
