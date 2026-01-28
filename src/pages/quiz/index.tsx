import Layout from '@theme/Layout';
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

export default function Quiz() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout title={`${siteConfig.title} | Quiz`}>
      <h1>Quiz Page</h1>
    </Layout>
  )
}