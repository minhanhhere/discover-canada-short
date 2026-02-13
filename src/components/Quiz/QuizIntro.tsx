import React from "react";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";
import { useQuizProgressStore } from "./state/quizProgressStore";

type QuizIntroProps = {
  dataSetLength: number;
  onStart: (idx?: number) => void;
};
export default function QuizIntro({
  dataSetLength,
  onStart,
}: QuizIntroProps) {
  const quizProgress = useQuizProgressStore((s) => s.quizProgress);

  function isPassed(score: string) {
    const [correct, total] = score.split("/").map(Number);
    return (correct / total) * 100 >= 75;
  }

  return (
    <div>
      <p className="margin-bottom--md">
        Start a random set of questions and test your knowledge. Pick an answer
        to reveal whether it’s correct, then move to the next question.
      </p>

      <p className="margin-bottom--md">
        Want to study first? Start with the{" "}
        <Link to="/docs/oath-citizenship">Discover Canada notes</Link>.
      </p>

      <p className="margin-bottom--md text--muted">
        <strong>Disclaimer:</strong> These practice questions aren’t official
        and may not appear on the real citizenship test.
      </p>

      <div className="margin-top--lg text--center">
        <div className={`margin-top--md ${styles.quizIntroGrid}`}>
          <Link
            className={`button button--info button--lg button--block padding-horiz--none ${styles.quizIntroGridPrimary}`}
            to="/review">
            Review Missed/Saved Questions
          </Link>
          <button
            type="button"
            className={`button button--lg button--block button--primary padding-horiz--none ${styles.quizIntroGridPrimary}`}
            onClick={() => onStart()}
          >
            Start Random Quiz
          </button>

          {Array.from({ length: dataSetLength }, (_, i) => {
            if (i < 10) return null; // Hide quizzes 1-10 for now
            const isStarted = quizProgress[i]?.started ?? false;
            const score = quizProgress[i]?.score;
            const buttonColor = (score && !isPassed(score)) ? "button--danger" : "button--secondary";
            return (
              <button
                key={i}
                type="button"
                className={`button button--lg button--block ${buttonColor} padding-horiz--none ${isStarted ? "" : "button--outline"}`}
                onClick={() => onStart(i)}
              >
                Quiz {i - 9}
                {score ? ` ✅${score}` : ""}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
