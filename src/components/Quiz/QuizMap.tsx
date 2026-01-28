import React from 'react';

type Status = 'unanswered' | 'correct' | 'incorrect';

type QuizMapProps = {
  questionCount: number;
  activeIndex: number;
  statuses: readonly Status[];
  buttonClassName: string;
  onGoToQuestion: (index: number) => void;
};

export default function QuizMap({
  questionCount,
  activeIndex,
  statuses,
  buttonClassName,
  onGoToQuestion,
}: QuizMapProps) {
  const items = Array.from({ length: questionCount });

  return (
    <>
      {items.map((_, idx) => {
        const status = statuses[idx] ?? 'unanswered';

        const statusClass =
          status === 'correct'
            ? 'button--success'
            : status === 'incorrect'
              ? 'button--danger'
              : 'button--secondary';

        const isActive = idx === activeIndex;

        return (
          <button
            key={idx}
            type="button"
            className={`button button--sm ${statusClass} ${isActive ? 'button--outline' : ''} ${buttonClassName}`}
            onClick={() => onGoToQuestion(idx)}>
            {idx + 1}
          </button>
        );
      })}
    </>
  );
}
