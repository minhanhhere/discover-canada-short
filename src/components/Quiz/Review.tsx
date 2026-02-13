import React, { useMemo, useState } from "react";
import { useFetchPracticeQuizData, type QuizQuestion } from "./state/useFetchPracticeQuizData";
import { useQuizReviewStore } from "./state/quizReviewStore";
import styles from "./styles.module.css";
import QuizError from "./QuizError";
import type { QuizQuestionStat } from "./QuizReview";

type TabType = "bookmarked" | "missed";

interface ReviewQuestion extends QuizQuestion {
  quizIdx: number;
  questionIdx: number;
  missedTimes?: number;
}

export default function Review() {
  const bookmarkedQuestions = useQuizReviewStore((s) => s.quizReview.bookmarkedQuestions);
  const missedQuestions = useQuizReviewStore((s) => s.quizReview.missedQuestions);
  const removeBookmarkedQuestion = useQuizReviewStore((s) => s.removeBookmarkedQuestion);
  const removeMissedQuestion = useQuizReviewStore((s) => s.removeMissedQuestion);

  const {
    data: quizData,
    isLoading,
    isError,
    error,
    refetch,
  } = useFetchPracticeQuizData();

  const [activeTab, setActiveTab] = useState<TabType>("bookmarked");

  const reviewQuestions = useMemo(() => {
    if (!quizData) return [];

    const stats = activeTab === "bookmarked" ? bookmarkedQuestions : missedQuestions;
    const questions: ReviewQuestion[] = [];

    stats.forEach((stat) => {
      if (stat.quizIdx >= 0 && stat.quizIdx < quizData.length) {
        const quizSet = quizData[stat.quizIdx];
        if (stat.questionIdx >= 0 && stat.questionIdx < quizSet.length) {
          const question = quizSet[stat.questionIdx];
          questions.push({
            ...question,
            quizIdx: stat.quizIdx,
            questionIdx: stat.questionIdx,
            missedTimes: stat.missedTimes,
          });
        }
      }
    });

    return questions;
  }, [quizData, activeTab, bookmarkedQuestions, missedQuestions]);

  function removeQuestion(question: ReviewQuestion) {
    if (activeTab === "bookmarked") {
      removeBookmarkedQuestion(question.quizIdx, question.questionIdx);
    } else if (activeTab === "missed") {
      removeMissedQuestion(question.quizIdx, question.questionIdx);
    }
  }

  if (isError) {
    return <QuizError error={error} onRetry={() => refetch()} />;
  }

  if (!quizData || quizData.length === 0) {
    return <div>No quiz questions found.</div>;
  }

  return (
    <div className={styles.nonHover}>
      {/* Tab Navigation */}
      <div className="margin-bottom--lg">
        <div role="tablist" className="tabs">
          <div
            role="tab"
            tabIndex={activeTab === "bookmarked" ? 0 : -1}
            aria-selected={activeTab === "bookmarked"}
            className={`tabs__item ${activeTab === "bookmarked" ? "tabs__item--active" : ""}`}
            onClick={() => setActiveTab("bookmarked")}
          >
            Bookmarked ({bookmarkedQuestions.length})
          </div>
          <div
            role="tab"
            tabIndex={activeTab === "missed" ? 0 : -1}
            aria-selected={activeTab === "missed"}
            className={`tabs__item ${activeTab === "missed" ? "tabs__item--active" : ""}`}
            onClick={() => setActiveTab("missed")}
          >
            Missed ({missedQuestions.length})
          </div>
        </div>
      </div>

      {/* Content */}
      {reviewQuestions.length === 0 ? (
        <div className="alert alert--info">
          No {activeTab} questions yet. Answer some quiz questions to see them here.
        </div>
      ) : (
        <div className="margin-bottom--lg">
          {reviewQuestions.map((question, displayIdx) => (
            <div
              key={`${question.quizIdx}-${question.questionIdx}`}
              className="margin-bottom--xl"
            >
              {/* Question Header */}
              <div className={`${styles.quizHeader} margin-bottom--md`}>
                <div className="col col--auto">
                  <span className="badge badge--secondary margin-right--sm">
                    Q{displayIdx + 1}
                  </span>
                  <span className="badge badge--info margin-right--sm">
                    Quiz {question.quizIdx + 1}
                  </span>
                  {activeTab === "missed" && question.missedTimes && question.missedTimes > 0 && (
                    <span className="badge badge--danger">
                      Missed {question.missedTimes}x
                    </span>
                  )}
                </div>
              </div>

              {/* Question Text */}
              <div className="margin-bottom--md">
                <h3 className={`margin-bottom--sm ${styles.preWrap}`}>
                  {question.question}
                </h3>
              </div>

              <div className="margin-bottom--md">
                  <button className="button button--danger button--outline" onClick={() => removeQuestion(question)}>
                    Remove
                  </button>
              </div>

              {/* Answers */}
              <div className="margin-bottom--md">
                {question.answer.map((ans, answerIdx) => {
                  const isCorrect = ans.isCorrect;

                  return (
                    <div
                      key={`answer-${question.quizIdx}-${question.questionIdx}-${answerIdx}`}
                      className="margin-bottom--sm"
                    >
                      <span className={isCorrect ? "text--success" : ""}>
                        {ans.text}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Divider */}
              <hr className="margin-top--lg margin-bottom--lg" />
            </div>
          ))}
        </div>
      )}

      {/* Back Button */}
      {/* <div className="margin-top--lg">
        <a href="/docs/quiz" className="button button--primary button--block">
          Back to Quiz
        </a>
      </div> */}
    </div>
  );
}
