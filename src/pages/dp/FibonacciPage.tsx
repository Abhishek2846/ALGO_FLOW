import DPPageTemplate from './DPPageTemplate';
import { generateFibonacciSteps } from '../../algorithms/dpAlgorithms';
import { getById } from '../../data/algorithms';

export default function FibonacciPage() {
  return <DPPageTemplate meta={getById('fibonacci')!} stepGenerator={generateFibonacciSteps} />;
}
