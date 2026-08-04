import GraphPageTemplate from './GraphPageTemplate';
import { generateKruskalsMSTSteps } from '../../algorithms/graphAlgorithms';
import { getById } from '../../data/algorithms';

export default function KruskalsMSTPage() {
  return <GraphPageTemplate meta={getById('kruskals-mst')!} algoType="kruskals-mst" stepGenerator={generateKruskalsMSTSteps} />;
}
