import React from 'react';

type QuizErrorProps = {
  error: unknown;
  onRetry: () => void;
  preClassName?: string;
};

export default function QuizError({ error, onRetry, preClassName }: QuizErrorProps) {
  return (
    <div>
      <p>Couldn't load quiz data.</p>
      <pre className={preClassName}>{String((error as Error)?.message ?? error)}</pre>
      <button type="button" className="button button--primary" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}
