import GraphPageTemplate from './GraphPageTemplate';
import { generateTopologicalSortSteps } from '../../algorithms/graphAlgorithms';
import { getById } from '../../data/algorithms';

export default function TopologicalSortPage() {
  return <GraphPageTemplate meta={getById('topological-sort')!} algoType="topological-sort" stepGenerator={generateTopologicalSortSteps} />;
}
