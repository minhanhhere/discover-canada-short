import React, {useState} from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Quiz from '@site/src/components/Quiz';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

export default function QuizPage() {
  const { siteConfig } = useDocusaurusContext();
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );
  return (
    <Layout title={`${siteConfig.title} | Quiz`}>
      <QueryClientProvider client={client}>
        <main className="container padding-vert--lg" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1>Practice Quiz</h1>
          <div style={{ maxWidth: '640px'}}>
            <Quiz />
          </div>
        </main>
      </QueryClientProvider>
    </Layout>
  );
}