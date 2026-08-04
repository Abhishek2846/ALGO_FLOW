import GraphPageTemplate from './GraphPageTemplate';
import { generateDijkstraSteps } from '../../algorithms/graphAlgorithms';
import { getById } from '../../data/algorithms';

export default function DijkstraPage() {
  return <GraphPageTemplate meta={getById('dijkstra')!} algoType="dijkstra" stepGenerator={generateDijkstraSteps} />;
}
