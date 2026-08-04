import DPPageTemplate from './DPPageTemplate';
import { generateKnapsackSteps } from '../../algorithms/dpAlgorithms';
import { getById } from '../../data/algorithms';

export default function KnapsackPage() {
  return <DPPageTemplate meta={getById('knapsack')!} stepGenerator={generateKnapsackSteps} />;
}
