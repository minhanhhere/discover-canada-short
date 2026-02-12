import React, {useState} from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Review from '@site/src/components/Quiz/Review';
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
    <Layout
      title={`Quiz | ${siteConfig.title}`}
      description="Practice for the Canadian Citizenship test. Review the study guide, then take a quiz to check your knowledge."
    >
      <QueryClientProvider client={client}>
        <main className="container padding-vert--lg" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1>Quiz Review</h1>
          <div style={{ width: '100%', maxWidth: '640px'}}>
            <Review />
          </div>
        </main>
      </QueryClientProvider>
    </Layout>
  );
}