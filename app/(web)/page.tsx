import FeatureDivider from '~/components/shared/feature-divider';
import FAQ from './component/faq';
import Features from './component/features';
import FinalCTA from './component/final-cta';
import Hero from './component/hero';
import Pricing from './component/pricing';
import ProblemSolution from './component/problem-solution';
import TargetAudience from './component/target-audience';

export default function Home() {
  return (
    <>
      <Hero />

      <ProblemSolution />

      <FeatureDivider className="mx-auto my-16 max-w-6xl" />

      <Features />

      <FeatureDivider className="mx-auto my-16 max-w-6xl" />

      <TargetAudience />

      <Pricing />

      <FAQ />

      <FinalCTA />
    </>
  );
}
