import DPPageTemplate from './DPPageTemplate';
import { generateLCSSteps } from '../../algorithms/dpAlgorithms';
import { getById } from '../../data/algorithms';

export default function LCSPage() {
  return <DPPageTemplate meta={getById('lcs')!} stepGenerator={generateLCSSteps} />;
}
