import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  // Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  img: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Easy to Learn',
    img: 'img/canada_easy.svg',
    // Svg: require('@site/static/img/canada_easy.svg').default,
    description: (
      <>
        Clear, plain-language summaries of the official <em>Discover Canada</em>{' '}
        guide—organized so you can learn faster without getting lost in details.
      </>
    ),
  },
  {
    title: 'Citizenship-Test Focused',
    img: 'img/canada_focus.svg',
    // Svg: require('@site/static/img/canada_focus.svg').default,
    description: (
      <>
        Covers the key topics you'll be tested on: Canadian history, government,
        geography, symbols, and important milestones—prioritizing what matters.
      </>
    ),
  },
  {
    title: 'Rights & Responsibilities',
    img: 'img/canada_law.svg',
    // Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Understand your rights and responsibilities as a Canadian citizen,
        including important civic duties and privileges.
      </>
    ),
  },
  {
    title: 'Content Search',
    img: 'img/feature_search.svg',
    description: (
      <>
        Quickly find the information you need with our powerful content search feature.
      </>
    ),
  },
  {
    title: 'Mobile-Friendly',
    img: 'img/feature_responsive.svg', // reuse an existing icon you already have
    description: (
      <>
        Read and search comfortably on phone, tablet, or desktop with a responsive
        layout that adapts to any screen size.
      </>
    ),
  },
];

function Feature({title, img, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4 margin-top--lg')}>
      <div className="text--center">
        <img alt={title} src={img} className={styles.featureSvg} />
        {/* <Svg className={styles.featureSvg} role="img" /> */}
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row justify-content--center">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
