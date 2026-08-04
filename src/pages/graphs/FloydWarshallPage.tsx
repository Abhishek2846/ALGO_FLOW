import GraphPageTemplate from './GraphPageTemplate';
import { generateFloydWarshallSteps } from '../../algorithms/graphAlgorithms';
import { getById } from '../../data/algorithms';

export default function FloydWarshallPage() {
  return <GraphPageTemplate meta={getById('floyd-warshall')!} algoType="floyd-warshall" stepGenerator={generateFloydWarshallSteps} />;
}
