import GraphPageTemplate from './GraphPageTemplate';
import { generatePrimsMSTSteps } from '../../algorithms/graphAlgorithms';
import { getById } from '../../data/algorithms';

export default function PrimsMSTPage() {
  return <GraphPageTemplate meta={getById('prims-mst')!} algoType="prims-mst" stepGenerator={generatePrimsMSTSteps} />;
}
