import DPPageTemplate from './DPPageTemplate';
import { generateMatrixChainSteps } from '../../algorithms/dpAlgorithms';
import { getById } from '../../data/algorithms';

export default function MatrixChainPage() {
  return <DPPageTemplate meta={getById('matrix-chain-multiplication')!} stepGenerator={generateMatrixChainSteps} />;
}
