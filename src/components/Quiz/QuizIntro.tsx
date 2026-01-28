import React from 'react';
import Link from '@docusaurus/Link';

type QuizIntroProps = {
  onStart: () => void;
};

export default function QuizIntro({ onStart }: QuizIntroProps) {
  return (
    <div>
      <p className="margin-bottom--md">
        Start a random set of questions and test your knowledge. Pick an answer to reveal whether
        it’s correct, then move to the next question.
      </p>

      <p className="margin-bottom--md">
        Want to study first? Start with the{' '}
        <Link to="/docs/oath-citizenship">Discover Canada notes</Link>.
      </p>

      <p className="margin-bottom--md text--muted">
        <strong>Disclaimer:</strong> These practice questions aren’t official and may not appear on the
        real citizenship test.
      </p>

      <div className="margin-top--lg text--center">
        <button type="button" className="button button--primary" onClick={onStart}>
          Start Random Quiz
        </button>
      </div>
    </div>
  );
}
