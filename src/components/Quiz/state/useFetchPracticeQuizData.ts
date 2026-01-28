import {useQuery} from "@tanstack/react-query";
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export type QuizAnswer = {
  text: string;
  isCorrect: boolean;
};

export type QuizQuestion = {
  question: string;
  answer: QuizAnswer[];
};

export type QuizData = QuizQuestion[][];

async function fetchQuizData(baseUrl: string): Promise<QuizData> {
  const res = await fetch(`${baseUrl}data/practice-quiz.json`, { headers: { Accept: 'application/json' } });
  if (!res.ok) {
    throw new Error(`Failed to load quiz data: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export function useFetchPracticeQuizData() {
  const {siteConfig} = useDocusaurusContext();
  return useQuery({
    queryKey: ['quiz', 'test1'],
    queryFn: () => fetchQuizData(siteConfig.baseUrl),
  })
}
