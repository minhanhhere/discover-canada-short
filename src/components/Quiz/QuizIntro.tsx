import React from "react";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";
import { QuizProgress } from "./QuizProgress";

type QuizIntroProps = {
  dataSetLength: number;
  onStart: (idx?: number) => void;
  quizProgress: QuizProgress;
};
export default function QuizIntro({ dataSetLength, onStart, quizProgress }: QuizIntroProps) {
  
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
          <button
            type="button"
            className={`button button--lg button--block button--primary padding-horiz--none ${styles.quizIntroGridPrimary}`}
            onClick={() => onStart()}
          >
            Start Random Quiz
          </button>

          {Array.from({ length: dataSetLength }, (_, i) => {
            const isStarted = quizProgress.started.includes(i);
            const isCompleted = quizProgress.completed.includes(i);
            return (
              <button
                key={i}
                type="button"
                className={`button button--lg button--block button--secondary padding-horiz--none ${isStarted ? "" : "button--outline"}`}
                onClick={() => onStart(i)}
              >
                Quiz {i + 1}{isCompleted ? ` ✅${quizProgress.scores[i]}` : ""}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
