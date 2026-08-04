import DPPageTemplate from './DPPageTemplate';
import { generateCoinChangeSteps } from '../../algorithms/dpAlgorithms';
import { getById } from '../../data/algorithms';

export default function CoinChangePage() {
  return <DPPageTemplate meta={getById('coin-change')!} stepGenerator={generateCoinChangeSteps} />;
}
