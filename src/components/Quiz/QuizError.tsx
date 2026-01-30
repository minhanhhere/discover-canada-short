import React from 'react';
import styles from './styles.module.css';

type QuizErrorProps = {
  error: unknown;
  onRetry: () => void;
};

export default function QuizError({ error, onRetry }: QuizErrorProps) {
  return (
    <div>
      <p>Couldn't load quiz data.</p>
      <pre className={`margin-bottom--md ${styles.preWrap}`}>{String((error as Error)?.message ?? error)}</pre>
      <button type="button" className="button button--primary" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}
